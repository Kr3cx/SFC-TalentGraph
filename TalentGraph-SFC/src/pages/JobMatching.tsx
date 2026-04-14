import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Building2,
  Globe,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { dataService, Job } from '../services/dataService';

export const JobMatching: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const data = await dataService.getJobs();
      setJobs(data);
      if (data.length > 0) setSelectedJob(data[0]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-surface-container-highest flex items-center justify-center border border-white/5">
          <Briefcase className="w-10 h-10 text-outline" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-on-surface">No Matches Found</h3>
          <p className="text-on-surface-variant max-w-xs mx-auto">Complete your profile to let our AI find the perfect roles for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Search & Filter Header */}
      <div className="col-span-12 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search roles, companies, or specific tech stacks..." 
            className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
          />
        </div>
        <button className="bg-surface-container-low px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-2 text-sm font-bold text-on-surface hover:bg-surface-container-high transition-all">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Job List */}
      <div className="col-span-12 lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-outline">AI Recommendations</h3>
          <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">{jobs.length} Matches</span>
        </div>
        
        {jobs.map((job) => (
          <motion.div 
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className={cn(
              "p-6 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden",
              selectedJob.id === job.id 
                ? "bg-surface-container-high border-primary/40 shadow-xl shadow-primary/5" 
                : "bg-surface-container-low border-white/5 hover:border-primary/20"
            )}
          >
            {selectedJob.id === job.id && (
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner">
                <Building2 className="text-slate-400 w-6 h-6" />
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter",
                  job.match > 90 ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                )}>
                  {job.match}% Match
                </span>
                <p className="text-[10px] text-outline mt-1 font-bold uppercase">{job.posted}</p>
              </div>
            </div>
            <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{job.role}</h4>
            <p className="text-xs text-on-surface-variant mt-1">{job.company}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold bg-surface-container-highest px-2 py-1 rounded text-outline">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>


      {/* Job Detail View */}
      <div className="col-span-12 lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedJob.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low rounded-[2rem] p-10 border border-white/5 sticky top-24"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-on-surface">{selectedJob.role}</h2>
                  <ShieldCheck className="text-secondary w-6 h-6" />
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {selectedJob.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                </div>
              </div>
              <button className="p-3 bg-surface-container-high rounded-xl text-outline hover:text-primary transition-all">
                <Star className="w-5 h-5" />
              </button>
            </div>

            {/* AI Match Reason */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Sparkles className="text-on-primary w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">AI Match Insight</p>
                <p className="text-sm text-on-surface leading-relaxed">{selectedJob.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              <div className="p-4 bg-surface-container-high rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Salary Range</p>
                <p className="text-base md:text-lg font-bold text-on-surface">{selectedJob.salary}</p>
              </div>
              <div className="p-4 bg-surface-container-high rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Job Type</p>
                <p className="text-base md:text-lg font-bold text-on-surface">{selectedJob.type}</p>
              </div>
              <div className="p-4 bg-surface-container-high rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Work Mode</p>
                <p className="text-base md:text-lg font-bold text-on-surface">Hybrid</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">Role Overview</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  We are looking for a visionary engineer to join our core research team. You will be responsible for pushing the boundaries of what's possible with large-scale generative models. You'll work alongside world-class researchers and engineers to build the next generation of AI infrastructure.
                </p>
              </section>

              <section>
                <h4 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">Required Neural Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-xs font-bold text-on-surface">{tag}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                Apply Now <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl border border-white/5 hover:bg-surface-container-highest transition-all">
                Refer a Friend
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

