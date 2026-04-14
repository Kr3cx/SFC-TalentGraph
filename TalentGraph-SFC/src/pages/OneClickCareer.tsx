import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  BarChart3,
  Zap, 
  Target, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Rocket,
  Lock,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  MapPin,
  DollarSign,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { rapidApiService } from '../services/rapidApiService';

// Removed hardcoded ROLE_DESCRIPTIONS as it's now fetched from Supabase job_roles table

// Removed hardcoded TARGET_COMPANIES as it's now fetched from Supabase companies table

export const OneClickCareer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { 
    setEngineLaunched, 
    setSelectedJobRole, 
    setTargetCompanies, 
    runGapAnalysis, 
    gapAnalysis, 
    isProfileComplete,
    addNotification,
    setToast,
    jobRoles: storeJobRoles,
    fetchJobRoles
  } = useStore();
  const [step, setStep] = useState<'role' | 'companies' | 'analyzing' | 'complete'>('role');
  const [progress, setProgress] = useState(0);
  const [showInsights, setShowInsights] = useState(false);
  const [relevance, setRelevance] = useState<'relevant' | 'not-relevant' | null>(null);
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [roleCache, setRoleCache] = useState<Record<string, any[]>>({});
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [experienceFilter, setExperienceFilter] = useState('All Experience');
  const [payTypeFilter, setPayTypeFilter] = useState('All Types');
  const [salaryRange, setSalaryRange] = useState([0, 50000]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const isComplete = isProfileComplete();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  useEffect(() => {
    if (step === 'role') {
      const fetchRoles = async () => {
        // If query is too short and not empty, don't fetch from API
        if (debouncedSearchTerm.length > 0 && debouncedSearchTerm.length < 3) {
          const filtered = storeJobRoles.filter((r: any) => 
            r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
          setJobRoles(filtered);
          return;
        }

        // Check cache
        if (roleCache[debouncedSearchTerm]) {
          setJobRoles(roleCache[debouncedSearchTerm]);
          return;
        }

        setLoadingRoles(true);
        try {
          const supabaseLookup = new Map(storeJobRoles.map((r: any) => [r.name.toLowerCase().trim(), r]));

          let mergedRoles = [];
          
          // Only call API if query is long enough or empty (for default roles)
          if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
            try {
              const apiRoles = await rapidApiService.getJobRoles(debouncedSearchTerm);
              if (apiRoles && apiRoles.length > 0) {
                mergedRoles = apiRoles.map((role: any) => {
                  const sbRole = supabaseLookup.get(role.name.toLowerCase().trim());
                  return {
                    ...role,
                    ...sbRole // Merge all fields from Supabase (summary, scores, salary, etc.)
                  };
                });
              }
            } catch (apiErr) {
              console.warn('API fetch failed, falling back to Supabase');
            }
          }

          if (mergedRoles.length === 0) {
            // Fallback to Supabase roles
            mergedRoles = Array.from(supabaseLookup.values());
          }

          // Filter locally if needed
          const filtered = debouncedSearchTerm 
            ? mergedRoles.filter((r: any) => r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            : mergedRoles;
            
          setJobRoles(filtered);
          setRoleCache(prev => ({ ...prev, [debouncedSearchTerm]: filtered }));
        } catch (error) {
          console.error('Role fetching failed:', error);
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [step, debouncedSearchTerm, storeJobRoles]);

  useEffect(() => {
    if (step === 'companies' && selectedRole) {
      const fetchCompanies = async () => {
        // Only fetch if we have a valid Supabase UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedRole.id);
        
        if (!isUuid) {
          setCompanies([]);
          setLoadingCompanies(false);
          return;
        }

        setLoadingCompanies(true);
        try {
          const { data, error } = await supabase
            .from('company_requirements')
            .select(`
              *,
              companies (*)
            `)
            .eq('job_role_id', selectedRole.id);

          if (error) throw error;

          if (data) {
            const formatted = data.map((req: any) => ({
              id: req.companies.id,
              name: req.companies.name,
              role: selectedRole.name,
              date: new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              salary: `$${(Number(req.salary_min || 0) / 1000).toFixed(1)}k - $${(Number(req.salary_max || 0) / 1000).toFixed(1)}k`,
              salaryValue: req.salary_min || 0,
              payType: 'Per month',
              experience: req.min_experience_level,
              location: req.companies.location,
              hardSkills: req.hard_skills || [],
              softSkills: req.soft_skills || [],
              tags: [...(req.hard_skills || []), ...(req.soft_skills || [])],
              brandColor: req.companies.brand_color || '#4285F4',
              logo: req.companies.logo_url,
              schedule: req.employment_type || 'Full time',
              employmentType: req.work_type || 'Onsite',
              description: req.description
            }));
            setCompanies(formatted);
          }
        } catch (err) {
          console.error('Error fetching companies:', err);
          setCompanies([]);
        } finally {
          setLoadingCompanies(false);
        }
      };
      fetchCompanies();
    }
  }, [step, selectedRole]);

  const startAnalysis = async () => {
    setStep('analyzing');
    setSelectedJobRole(selectedRole);
    setTargetCompanies(selectedCompanies);
    
    // Simulate progress while running analysis
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      if (p <= 90) setProgress(p);
    }, 100);

    await runGapAnalysis();
    
    // Fetch recommended jobs based on gap analysis
    setLoadingJobs(true);
    try {
      // Get top 3 missing skills
      const missingSkills = useStore.getState().gapAnalysis?.slice(0, 3).map(s => s.name) || [];
      const jobs = await rapidApiService.searchJobsWithGap(
        selectedRole?.name || '',
        missingSkills,
        'Indonesia' // Default to Indonesia for now
      );
      setRecommendedJobs(jobs.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
    
    clearInterval(interval);
    setProgress(100);
    setTimeout(() => setStep('complete'), 500);
  };

  const handleExecuteRoadmap = () => {
    setEngineLaunched(true);
    setActiveTab('roadmap');
  };

  const analysisSteps = [
    { title: 'Neural Profile Sync', detail: 'Aligning your skills with global market demand...' },
    { title: 'Market Intelligence Scan', detail: 'Analyzing 1.2M+ job openings in real-time...' },
    { title: 'Trajectory Optimization', detail: 'Calculating the highest ROI career paths...' },
    { title: 'Opportunity Generation', detail: 'Finalizing your personalized career strategy...' }
  ];

  const filteredCompanies = companies.filter(company => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    const matchesSearch = (
      company.name.toLowerCase().includes(searchLower) ||
      company.role.toLowerCase().includes(searchLower) ||
      company.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );

    const matchesLocation = locationFilter === 'All Locations' || company.location.includes(locationFilter);
    const matchesExperience = experienceFilter === 'All Experience' || company.experience === experienceFilter;
    const matchesPayType = payTypeFilter === 'All Types' || company.payType === payTypeFilter;
    const matchesSalary = company.salaryValue >= salaryRange[0] && company.salaryValue <= salaryRange[1];
    const matchesSchedule = selectedSchedules.length === 0 || selectedSchedules.includes(company.schedule);
    const matchesEmploymentType = selectedEmploymentTypes.length === 0 || selectedEmploymentTypes.includes(company.employmentType);

    return matchesSearch && matchesLocation && matchesExperience && matchesPayType && matchesSalary && matchesSchedule && matchesEmploymentType;
  });

  return (
    <>
      {/* Floating Action Bar */}
      <AnimatePresence>
        {((step === 'role' && selectedRole) || (step === 'companies' && selectedCompanies.length > 0)) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <div className="bg-surface-container-high/80 backdrop-blur-2xl rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10">
                <button 
                  onClick={() => {
                    if (step === 'companies') {
                      setStep('role');
                      setSearchTerm('');
                    }
                    else setSelectedRole(null);
                  }}
                  className="flex items-center gap-2 px-3 md:px-6 py-3 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Back</span>
                </button>
                
                <div className="flex items-center gap-1.5 md:gap-3">
                  {/* Completed Bubble */}
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-surface-container-highest/50 rounded-xl border border-white/10">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs md:text-sm font-bold text-on-surface whitespace-nowrap">
                      {step === 'role' ? '1/4' : '2/4'} <span className="hidden sm:inline">Completed</span>
                    </span>
                  </div>

                  {/* Selected Bubble */}
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-surface-container-highest/50 rounded-xl border border-white/10 max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-xs md:text-sm font-bold text-on-surface truncate">
                      {step === 'role' ? selectedRole?.name : `${selectedCompanies.length}/3 Selected`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={() => {
                      if (step === 'role') {
                        setStep('companies');
                        setSearchTerm('');
                      }
                      else startAnalysis();
                    }}
                    className="flex items-center gap-2 px-4 md:px-8 py-3 md:py-3.5 rounded-full text-sm font-black bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    <span className="hidden md:inline">Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Detail Pop-up */}
      <AnimatePresence>
        {selectedCompanyDetail && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompanyDetail(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Pop-up Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-[70] shadow-2xl flex flex-col rounded-l-[3.5rem] overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-white/5 overflow-hidden p-2">
                    {selectedCompanyDetail.logo ? (
                      <img 
                        src={selectedCompanyDetail.logo} 
                        alt={selectedCompanyDetail.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Briefcase className="w-6 h-6 text-outline" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on-surface">{selectedCompanyDetail.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCompanyDetail(null)}
                  className="p-2 rounded-full hover:bg-white/5 text-outline hover:text-on-surface transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Role Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      Target Role
                    </div>
                    <h2 className="text-3xl font-black text-on-surface leading-tight">
                      {selectedCompanyDetail.role}
                    </h2>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Location */}
                    <div className="flex items-center gap-4 text-on-surface-variant group">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                        <MapPin className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">{selectedCompanyDetail.location}</span>
                    </div>

                    {/* Position/Role */}
                    <div className="flex items-center gap-4 text-on-surface-variant group">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                        <Briefcase className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">{selectedCompanyDetail.role}</span>
                    </div>

                    {/* Schedule/Time */}
                    <div className="flex items-center gap-4 text-on-surface-variant group">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                        <Clock className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">{selectedCompanyDetail.schedule}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-4 text-on-surface-variant group">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                        <DollarSign className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">{selectedCompanyDetail.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Description Placeholder */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-outline uppercase tracking-widest">Job Description</h4>
                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    As a {selectedCompanyDetail.role} at {selectedCompanyDetail.name}, you will be at the forefront of innovation. 
                    This role involves working with cutting-edge technologies to solve complex problems and deliver high-impact solutions. 
                    You'll collaborate with cross-functional teams in {selectedCompanyDetail.location} to drive excellence and shape the future of the industry.
                  </p>
                </div>

                {/* Required Skills */}
                <div className="space-y-6">
                  {selectedCompanyDetail.hardSkills && selectedCompanyDetail.hardSkills.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-black text-outline uppercase tracking-widest">Hard Skills</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompanyDetail.hardSkills.map((tag: string, idx: number) => (
                          <div 
                            key={idx}
                            className="px-4 py-2 bg-primary/5 rounded-xl text-xs font-bold text-primary border border-primary/10 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCompanyDetail.softSkills && selectedCompanyDetail.softSkills.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-secondary" />
                        <h4 className="text-xs font-black text-outline uppercase tracking-widest">Soft Skills</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompanyDetail.softSkills.map((tag: string, idx: number) => (
                          <div 
                            key={idx}
                            className="px-4 py-2 bg-secondary/5 rounded-xl text-xs font-bold text-secondary border border-secondary/10 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!selectedCompanyDetail.hardSkills || selectedCompanyDetail.hardSkills.length === 0) && 
                   (!selectedCompanyDetail.softSkills || selectedCompanyDetail.softSkills.length === 0) && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-outline uppercase tracking-widest">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompanyDetail.tags.map((tag: string, idx: number) => (
                          <div 
                            key={idx}
                            className="px-4 py-2 bg-surface-container-highest rounded-xl text-xs font-bold text-on-surface-variant border border-white/5 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-highest/50 rounded-2xl border border-white/5 space-y-1">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Employment</p>
                    <p className="text-sm font-bold text-on-surface">{selectedCompanyDetail.employmentType}</p>
                  </div>
                  <div className="p-4 bg-surface-container-highest/50 rounded-2xl border border-white/5 space-y-1">
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Posted Date</p>
                    <p className="text-sm font-bold text-on-surface">{selectedCompanyDetail.date}</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-white/5 bg-surface/80 backdrop-blur-xl">
                <button 
                  onClick={() => {
                    if (selectedCompanies.includes(selectedCompanyDetail.name)) {
                      setSelectedCompanies(selectedCompanies.filter(c => c !== selectedCompanyDetail.name));
                      setSelectionError(null);
                    } else if (selectedCompanies.length < 3) {
                      setSelectedCompanies([...selectedCompanies, selectedCompanyDetail.name]);
                      setSelectionError(null);
                    } else {
                      addNotification({
                        title: 'Selection Limit Reached',
                        desc: "You can only select a maximum of 3 companies for the best neural optimization results.",
                        type: 'alert'
                      });
                      setToast({
                        message: "Maximum 3 companies allowed!",
                        type: 'error'
                      });
                      setSelectionError("Maximum 3 companies allowed");
                      setTimeout(() => setSelectionError(null), 3000);
                    }
                    setSelectedCompanyDetail(null);
                  }}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl",
                    selectedCompanies.includes(selectedCompanyDetail.name)
                      ? "bg-surface-container-highest text-on-surface border border-white/10"
                      : "bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20"
                  )}
                >
                  {selectedCompanies.includes(selectedCompanyDetail.name) ? 'Remove Selection' : 'Select Company'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">

      {!isComplete && !isSkipped ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-[120px] rounded-full"></div>
          <div className="relative bg-surface-container-low rounded-[3.5rem] border border-white/5 p-12 md:p-24 text-center space-y-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error/50 to-transparent"></div>
            
            <AnimatePresence mode="wait">
              {!showSkipWarning ? (
                <motion.div 
                  key="locked-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-10"
                >
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-error/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative w-full h-full bg-surface-container-highest rounded-[2.5rem] border border-error/20 flex items-center justify-center shadow-2xl">
                      <Lock className="w-14 h-14 text-error" />
                    </div>
                  </div>

                  <div className="space-y-6 max-w-2xl mx-auto">
                    <h2 className="text-5xl font-black text-on-surface tracking-tighter leading-tight">
                      Neural Engine <span className="text-error">Locked</span>
                    </h2>
                    <p className="text-on-surface-variant text-xl leading-relaxed font-medium">
                      Your career trajectory requires a baseline. To calculate accurate <span className="text-primary font-bold">Skill Gaps</span> and generate your <span className="text-secondary font-bold">Roadmap</span>, you must first populate your profile data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                      {['Skills Inventory', 'Work Experience', 'Career Summary'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-full border border-white/5 text-xs font-bold text-outline">
                          <div className="w-1.5 h-1.5 rounded-full bg-error/50"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-center gap-6 pt-4">
                    <button 
                      onClick={() => setActiveTab('cv-builder')}
                      className="group relative bg-primary text-on-primary px-8 md:px-14 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative z-10">Build Your CV First</span>
                      <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setShowSkipWarning(true)}
                      className="group relative bg-surface-container-highest text-on-surface px-8 md:px-14 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl border border-white/5 hover:bg-white/5 transition-all flex items-center justify-center gap-4 overflow-hidden"
                    >
                      <span className="relative z-10">Skip Step</span>
                    </button>
                  </div>

                  <p className="text-outline text-xs font-medium tracking-widest uppercase">
                    Required for AI Trajectory Calculation
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="warning-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-10 py-12"
                >
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-warning/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative w-full h-full bg-surface-container-highest rounded-[2rem] border border-warning/20 flex items-center justify-center shadow-2xl">
                      <Info className="w-10 h-10 text-warning" />
                    </div>
                  </div>

                  <div className="space-y-4 max-w-xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Wait, are you sure?</h3>
                    <p className="text-base md:text-lg leading-relaxed font-medium text-on-surface-variant">
                      Skipping this step will significantly affect your <span className="text-warning font-bold">Skill Statistics</span>.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                    <button 
                      onClick={() => setShowSkipWarning(false)}
                      className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                      Back (I'm still thinking)
                    </button>
                    <button 
                      onClick={() => setIsSkipped(true)}
                      className="px-10 py-4 bg-surface-container-highest text-on-surface-variant border border-white/5 rounded-2xl font-black text-sm hover:bg-warning hover:text-on-warning hover:border-warning hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-warning/20"
                    >
                      Skip (I don't care)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Hero Section */}
      <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-surface-container-low border border-white/5 p-8 md:p-20 text-center space-y-6 md:space-y-8">
        {/* Step Navigation Buttons */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 z-20">
          <button
            onClick={() => {
              if (step === 'companies') setStep('role');
              else if (step === 'complete') setStep('companies');
            }}
            disabled={step === 'role' || step === 'analyzing'}
            className={cn(
              "p-2 rounded-xl border border-white/10 bg-surface-container-highest/50 backdrop-blur-sm transition-all",
              (step === 'role' || step === 'analyzing') 
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-primary/20 hover:border-primary/30 text-on-surface"
            )}
            title="Previous Step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (step === 'role' && selectedRole) setStep('companies');
              else if (step === 'companies' && selectedCompanies.length > 0) startAnalysis();
            }}
            disabled={
              step === 'complete' || 
              step === 'analyzing' || 
              (step === 'role' && !selectedRole) || 
              (step === 'companies' && selectedCompanies.length === 0)
            }
            className={cn(
              "p-2 rounded-xl border border-white/10 bg-surface-container-highest/50 backdrop-blur-sm transition-all",
              (step === 'complete' || step === 'analyzing' || (step === 'role' && !selectedRole) || (step === 'companies' && selectedCompanies.length === 0))
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-primary/20 hover:border-primary/30 text-on-surface"
            )}
            title="Next Step"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(192,193,255,0.08),transparent_50%)]"></div>
        
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'role' && (
                <motion.div 
                  key="role-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="space-y-12">
                    {/* Step Progress Indicator - Always visible in role step */}
                    <div className="max-w-md mx-auto w-full pt-4">
                      <div className="relative">
                        {/* Label following progress */}
                        <div className="absolute -top-10 left-0 w-full">
                          <motion.div 
                            initial={{ left: 0 }}
                            animate={{ left: '25%' }}
                            className="absolute -translate-x-1/2 px-3 py-1 bg-surface-container-highest rounded-lg border border-white/10 shadow-inner"
                          >
                            <span className="text-[10px] font-black tracking-widest text-primary">1/4</span>
                          </motion.div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '25%' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {selectedRole ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="inline-flex items-center px-4 py-1.5 bg-surface-container-highest rounded-lg border border-white/10 shadow-inner">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                                {selectedRole.category || 'Career Path'}
                              </span>
                            </div>
                            {(selectedRole.salary_min != null || selectedRole.salary != null) && (
                              <div className="inline-flex items-center px-4 py-1.5 bg-secondary/10 text-secondary rounded-lg border border-secondary/20 shadow-inner">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                  Salary Average {selectedRole.currency || 'USD'} {Number(selectedRole.salary_min || selectedRole.salary).toLocaleString()} 
                                  {selectedRole.salary_max ? ` - ${Number(selectedRole.salary_max).toLocaleString()}` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        
                        <h3 className="text-4xl md:text-7xl font-black text-on-surface tracking-tighter leading-none">
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                            {selectedRole.name}
                          </span>
                        </h3>

                        <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto">
                          {selectedRole.summary || `Expertly architect and implement solutions as a ${selectedRole.name}, ensuring high performance and scalability while collaborating across teams to deliver exceptional results.`}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black text-on-surface tracking-tighter">
                          Select Your Target Role
                        </h3>
                        <p className="text-on-surface-variant text-lg font-medium">Choose the path that defines your future trajectory</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <input 
                        type="text"
                        placeholder="Search roles (e.g. AI Engineer, DevOps)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-high/40 backdrop-blur-xl border border-white/10 rounded-2xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {loadingRoles ? (
                    <div className="flex flex-wrap justify-center gap-3 py-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div 
                          key={i} 
                          className="px-8 py-5 rounded-full bg-surface-container-high/20 border border-white/5 animate-pulse w-32"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-3 py-4">
                      <AnimatePresence mode="popLayout">
                        {jobRoles.length > 0 ? (
                          jobRoles.map((role) => (
                            <motion.button
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              key={role.id}
                              onClick={() => setSelectedRole(role)}
                              className={cn(
                                "px-6 py-3 rounded-full border transition-all text-sm font-bold whitespace-nowrap",
                                selectedRole?.id === role.id 
                                  ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105" 
                                  : "bg-surface-container-high/40 backdrop-blur-xl text-on-surface border-white/10 hover:bg-surface-container-highest/60 hover:border-white/20"
                              )}
                            >
                              {role.name}
                            </motion.button>
                          ))
                        ) : (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-outline text-sm font-medium py-8"
                          >
                            No roles found matching "{searchTerm}"
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'companies' && (
                <motion.div 
                  key="company-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="space-y-12">
                    {/* Step Progress Indicator - Step 2 */}
                    <div className="max-w-md mx-auto w-full pt-4">
                      <div className="relative">
                        {/* Label following progress */}
                        <div className="absolute -top-10 left-0 w-full">
                          <motion.div 
                            initial={{ left: '25%' }}
                            animate={{ left: '50%' }}
                            className="absolute -translate-x-1/2 px-3 py-1 bg-surface-container-highest rounded-lg border border-white/10 shadow-inner"
                          >
                            <span className="text-[10px] font-black tracking-widest text-primary">2/4</span>
                          </motion.div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: '25%' }}
                            animate={{ width: '50%' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <h3 className="text-4xl font-black text-on-surface tracking-tighter">
                        Select Target Companies
                      </h3>
                      <p className="text-on-surface-variant text-lg font-medium">Choose 1-3 companies you'd like to target for your next move</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-6">
                      <div className="max-w-2xl mx-auto">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                          <input
                            type="text"
                            placeholder="Search companies, roles, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-2xl border border-white/5 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* Filter Bar */}
                      <div className="max-w-6xl mx-auto bg-surface-container-high/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                        {/* Left Section: Core Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                          {/* Location Filter */}
                          <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                              <MapPin className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-outline">Location</span>
                              <select 
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer appearance-none pr-4"
                              >
                                <option value="All Locations">All Locations</option>
                                <option value="California">California</option>
                                <option value="Washington">Washington</option>
                                <option value="New York">New York</option>
                              </select>
                            </div>
                            <ChevronDown className="w-4 h-4 text-outline" />
                          </div>

                          <div className="w-px h-8 bg-white/5 hidden lg:block" />

                          {/* Experience Filter */}
                          <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                              <Briefcase className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-outline">Experience</span>
                              <select 
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(e.target.value)}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer appearance-none pr-4"
                              >
                                <option value="All Experience">All Experience</option>
                                <option value="Entry-Level">Entry-Level</option>
                                <option value="Mid-Level">Mid-Level</option>
                                <option value="Senior">Senior</option>
                              </select>
                            </div>
                            <ChevronDown className="w-4 h-4 text-outline" />
                          </div>

                          <div className="w-px h-8 bg-white/5 hidden lg:block" />

                          {/* Pay Type Filter */}
                          <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                              <DollarSign className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-outline">Pay Type</span>
                              <select 
                                value={payTypeFilter}
                                onChange={(e) => setPayTypeFilter(e.target.value)}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer appearance-none pr-4"
                              >
                                <option value="All Types">All Types</option>
                                <option value="Per hour">Per hour</option>
                                <option value="Per month">Per month</option>
                              </select>
                            </div>
                            <ChevronDown className="w-4 h-4 text-outline" />
                          </div>
                        </div>

                        <div className="w-px h-8 bg-white/5 hidden 2xl:block" />

                        {/* Middle Section: Advanced Filters (Horizontal) */}
                        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                          {/* Working Schedule */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-outline">Working schedule</h5>
                            <div className="flex flex-wrap items-center gap-4">
                              {['Full time', 'Part time', 'Internship'].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                  <div className="relative flex items-center justify-center">
                                    <input 
                                      type="checkbox"
                                      checked={selectedSchedules.includes(type)}
                                      onChange={() => {
                                        if (selectedSchedules.includes(type)) {
                                          setSelectedSchedules(selectedSchedules.filter(s => s !== type));
                                        } else {
                                          setSelectedSchedules([...selectedSchedules, type]);
                                        }
                                      }}
                                      className="peer appearance-none w-4 h-4 rounded border border-white/10 checked:bg-primary checked:border-primary transition-all"
                                    />
                                    <CheckCircle2 className="absolute w-2.5 h-2.5 text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                                  </div>
                                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="w-px h-8 bg-white/5 hidden lg:block" />

                          {/* Employment Type */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-outline">Employment type</h5>
                            <div className="flex flex-wrap items-center gap-4">
                              {['Full day', 'Flexible schedule', 'Distant work'].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                  <div className="relative flex items-center justify-center">
                                    <input 
                                      type="checkbox"
                                      checked={selectedEmploymentTypes.includes(type)}
                                      onChange={() => {
                                        if (selectedEmploymentTypes.includes(type)) {
                                          setSelectedEmploymentTypes(selectedEmploymentTypes.filter(s => s !== type));
                                        } else {
                                          setSelectedEmploymentTypes([...selectedEmploymentTypes, type]);
                                        }
                                      }}
                                      className="peer appearance-none w-4 h-4 rounded border border-white/10 checked:bg-primary checked:border-primary transition-all"
                                    />
                                    <CheckCircle2 className="absolute w-2.5 h-2.5 text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                                  </div>
                                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-white/5 hidden 2xl:block" />

                        {/* Right Section: Salary Range */}
                        <div className="w-full lg:w-auto lg:min-w-[300px] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Salary Range</span>
                            <span className="text-sm font-bold text-on-surface">
                              ${salaryRange[0].toLocaleString()} - ${salaryRange[1] >= 1000 ? `${(salaryRange[1] / 1000).toFixed(0)}k` : salaryRange[1]}
                            </span>
                          </div>
                          <div className="relative h-6 flex items-center">
                            <input 
                              type="range"
                              min="0"
                              max="50000"
                              step="500"
                              value={salaryRange[1]}
                              onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                              className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Grid */}
                    {loadingCompanies ? (
                      <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-outline font-bold animate-pulse">Scanning Market Opportunities...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCompanies.length > 0 ? (
                          filteredCompanies.map((company) => (
                            <motion.div
                              key={company.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ y: -5 }}
                              className={cn(
                                "relative rounded-[2rem] p-8 transition-all border-2 flex flex-col justify-between min-h-[380px] w-full bg-surface-container-high/40 backdrop-blur-xl text-left shadow-xl",
                                selectedCompanies.includes(company.name)
                                  ? "border-primary ring-4 ring-primary/10"
                                  : "border-white/10"
                              )}
                            >
                            {/* Top Section */}
                            <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                <div className="px-4 py-1.5 bg-surface-container-highest rounded-full text-[11px] font-bold text-on-surface-variant shadow-sm border border-white/5">
                                  {company.date}
                                </div>
                              </div>

                              <div className="space-y-2 pr-16">
                                <p className="text-xs font-bold text-outline">{company.name}</p>
                                <h4 className="text-2xl font-black text-on-surface leading-tight">
                                  {company.role}
                                </h4>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {company.tags.map((tag, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface-variant border border-white/5"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between gap-4">
                              <div className="space-y-0.5 shrink-0">
                                <p className="text-lg font-black text-on-surface">{company.salary}</p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-outline">
                                  <MapPin className="w-3 h-3" />
                                  {company.location}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 flex-1 max-w-[140px]">
                                <button 
                                  onClick={() => setSelectedCompanyDetail(company)}
                                  className="w-full px-4 py-2 rounded-xl font-bold text-xs bg-surface-container-highest text-on-surface border border-white/5 hover:bg-white/5 transition-all"
                                >
                                  Details
                                </button>
                                <button 
                                  onClick={() => {
                                    if (selectedCompanies.includes(company.name)) {
                                      setSelectedCompanies(selectedCompanies.filter(c => c !== company.name));
                                      setSelectionError(null);
                                    } else if (selectedCompanies.length < 3) {
                                      setSelectedCompanies([...selectedCompanies, company.name]);
                                      setSelectionError(null);
                                    } else {
                                      addNotification({
                                        title: 'Selection Limit Reached',
                                        desc: "You can only select a maximum of 3 companies for the best neural optimization results.",
                                        type: 'alert'
                                      });
                                      setToast({
                                        message: "Maximum 3 companies allowed!",
                                        type: 'error'
                                      });
                                      setSelectionError("Maximum 3 companies allowed");
                                      setTimeout(() => setSelectionError(null), 3000);
                                    }
                                  }}
                                  style={{ 
                                    backgroundColor: selectedCompanies.includes(company.name) ? company.brandColor : undefined,
                                    color: selectedCompanies.includes(company.name) ? 'white' : undefined
                                  }}
                                  className={cn(
                                    "w-full px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg",
                                    selectedCompanies.includes(company.name)
                                      ? "shadow-primary/20"
                                      : "bg-primary text-on-primary hover:bg-primary/90"
                                  )}
                                >
                                  {selectedCompanies.includes(company.name) ? 'Selected' : 'Select'}
                                </button>
                              </div>
                            </div>

                            {/* Company Logo Float - Adjusted placement */}
                            <div className="absolute top-28 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center p-2.5 shadow-xl border border-white/10">
                              <img 
                                src={company.logo} 
                                alt={company.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-outline" />
                          </div>
                          <h4 className="text-2xl font-black text-on-surface">No companies found</h4>
                          <p className="text-outline font-medium">Try searching for a different keyword or company name</p>
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setLocationFilter('All Locations');
                              setExperienceFilter('All Experience');
                              setSalaryRange([0, 50000]);
                            }}
                            className="text-primary font-bold hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </motion.div>
              )}

              {step === 'analyzing' && (
                <motion.div 
                  key="analyzing-ui"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 max-w-md mx-auto"
                >
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-outline">
                    <span>Engine Status: Active</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-on-surface">
                      {progress < 25 ? analysisSteps[0].title : 
                       progress < 50 ? analysisSteps[1].title : 
                       progress < 75 ? analysisSteps[2].title : 
                       analysisSteps[3].title}
                    </p>
                    <p className="text-sm text-outline">
                      {progress < 25 ? analysisSteps[0].detail : 
                       progress < 50 ? analysisSteps[1].detail : 
                       progress < 75 ? analysisSteps[2].detail : 
                       analysisSteps[3].detail}
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'complete' && (
                <motion.div 
                  key="complete-ui"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 max-w-2xl mx-auto"
                >
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-on-secondary shadow-2xl shadow-secondary/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-on-surface">Strategy Finalized</h3>
                    <p className="text-on-surface-variant font-medium">Your neural-optimized career path to {selectedRole?.name} at {selectedCompanies.join(', ')} is ready.</p>
                  </div>

                  {/* Gap Analysis Dropdown */}
                  <div className="bg-surface-container-high rounded-3xl border border-white/5 overflow-hidden text-left">
                    <button 
                      onClick={() => setShowInsights(!showInsights)}
                      className="w-full p-6 flex items-center justify-between hover:bg-surface-container-highest transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Neural Gap Analysis</p>
                          <p className="text-[10px] text-outline font-black uppercase tracking-widest">Review your skill deficits</p>
                        </div>
                      </div>
                      {showInsights ? <ChevronUp className="w-5 h-5 text-outline" /> : <ChevronDown className="w-5 h-5 text-outline" />}
                    </button>

                    <AnimatePresence>
                      {showInsights && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-8 border-t border-white/5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                            {gapAnalysis?.slice(0, 3).map((item, i) => (
                              <div key={i} className="bg-surface-container-highest p-5 rounded-2xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline">{item.name}</p>
                                <p className="text-xl font-black text-primary">{item.gap}% Gap</p>
                                <p className="text-[10px] text-on-surface-variant leading-tight">Priority: {item.priority}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Is this strategy relevant to your goals?</p>
                            <div className="flex gap-4">
                              <button 
                                onClick={() => setRelevance('relevant')}
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-xs",
                                  relevance === 'relevant' ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface hover:bg-primary/20"
                                )}
                              >
                                <ThumbsUp className="w-3 h-3" /> Relevant
                              </button>
                              <button 
                                onClick={() => setRelevance('not-relevant')}
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-xs",
                                  relevance === 'not-relevant' ? "bg-error text-on-error" : "bg-surface-container-highest text-on-surface hover:bg-error/20"
                                )}
                              >
                                <ThumbsDown className="w-3 h-3" /> Not Relevant
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Recommended Jobs Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-outline">Target Opportunities</h4>
                      {loadingJobs && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    </div>
                    
                    <div className="space-y-3">
                      {recommendedJobs.length > 0 ? (
                        recommendedJobs.map((job, i) => (
                          <motion.a
                            key={i}
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 bg-surface-container-high rounded-2xl border border-white/5 hover:bg-surface-container-highest transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-secondary" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{job.name}</p>
                                <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-tighter">{job.category}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </motion.a>
                        ))
                      ) : !loadingJobs && (
                        <div className="p-8 text-center bg-surface-container-high rounded-2xl border border-dashed border-white/10">
                          <p className="text-xs text-on-surface-variant font-medium">No direct matches found for this specific skill gap. Adjusting search parameters...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleExecuteRoadmap}
                      className="w-full py-5 bg-primary text-on-primary font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      Execute Roadmap <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Precision Matching', detail: '99.8% accuracy in aligning your profile with role requirements.', color: 'text-primary' },
          { icon: ShieldCheck, title: 'Verified Roles', detail: 'Only Tier-1, vetted opportunities from global tech leaders.', color: 'text-secondary' },
          { icon: Cpu, title: 'Neural Optimization', detail: 'Continuous profile refinement based on real-time market feedback.', color: 'text-tertiary' }
        ].map((feature, i) => (
          <div key={i} className="bg-surface-container-low p-8 rounded-[2rem] border border-white/5 space-y-4 hover:bg-surface-container-high transition-all group">
            <div className={cn("w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center transition-transform group-hover:scale-110", feature.color)}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">{feature.title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{feature.detail}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-surface-container-low rounded-[2.5rem] p-10 border border-white/5 flex flex-col md:flex-row items-center justify-around gap-10">
        <div className="text-center">
          <p className="text-4xl font-black text-primary mb-1">12.4k</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">Successful Placements</p>
        </div>
        <div className="h-12 w-[1px] bg-outline-variant/20 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-secondary mb-1">$210k</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">Avg. Salary Increase</p>
        </div>
        <div className="h-12 w-[1px] bg-outline-variant/20 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-tertiary mb-1">14 Days</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-outline">Avg. Time to Employed</p>
        </div>
      </div>
    </>
  )}
</div>
</>
);
};

