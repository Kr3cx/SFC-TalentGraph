import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  Layout,
  Palette,
  Check,
  Download,
  ZoomIn,
  Share2,
  Printer,
  Linkedin,
  Github,
  Award,
  Globe,
  Briefcase,
  Target,
  Clock,
  Lock as LockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, UserProfile, UserSkill, Certificate } from '../store/useStore';
import { cn } from '../lib/utils';

const ModernTemplate: React.FC<{ profile: UserProfile }> = ({ profile }) => (
  <div className="font-sans">
    <div className="border-b-2 border-slate-100 pb-6 mb-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-slate-900">{profile.fullName}</h1>
      <p className="text-primary-container font-semibold uppercase tracking-widest text-[10px] mt-1">{profile.targetRole || 'Professional'}</p>
      <div className="flex flex-wrap gap-3 mt-3">
        {profile.socials.linkedin && (
          <span className="text-[8px] text-slate-400 flex items-center gap-1">
            <Linkedin className="w-2.5 h-2.5" /> {profile.socials.linkedin}
          </span>
        )}
        {profile.socials.github && (
          <span className="text-[8px] text-slate-400 flex items-center gap-1">
            <Github className="w-2.5 h-2.5" /> {profile.socials.github}
          </span>
        )}
        {profile.socials.portfolio && (
          <span className="text-[8px] text-slate-400 flex items-center gap-1">
            <Globe className="w-2.5 h-2.5" /> {profile.socials.portfolio}
          </span>
        )}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8 flex-1">
      <div className="col-span-1 space-y-6">
        <section>
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Contact</h5>
          <div className="space-y-1">
            <p className="text-[9px] text-slate-600 flex items-center gap-2"><MapPin className="w-2 h-2" /> {profile.location}</p>
            <p className="text-[9px] text-slate-600 flex items-center gap-2"><Mail className="w-2 h-2" /> {profile.email}</p>
            <p className="text-[9px] text-slate-600 flex items-center gap-2"><Phone className="w-2 h-2" /> {profile.phone}</p>
          </div>
        </section>

        <section>
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Expertise</h5>
          <div className="space-y-3">
            {profile.skills.slice(0, 8).map((skill, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[8px] text-slate-500">
                  <span className="font-bold">{skill.name}</span>
                  <span className="opacity-60">{skill.score}%</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-container" 
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {profile.languages.length > 0 && (
          <section>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Languages</h5>
            <div className="flex flex-wrap gap-1.5">
              {profile.languages.map((lang, i) => (
                <span key={i} className="text-[8px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{lang}</span>
              ))}
            </div>
          </section>
        )}

        {profile.certificates && profile.certificates.length > 0 && (
          <section>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Certifications</h5>
            <div className="space-y-1.5">
              {profile.certificates.map((cert) => (
                <div key={cert.id} className="flex gap-2">
                  <Award className="w-2 h-2 text-primary-container shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[8px] text-slate-800 font-bold leading-tight">{cert.name}</p>
                    <p className="text-[7px] text-slate-400">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-2 space-y-6">
        <section>
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Profile</h5>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            {profile.summary}
          </p>
        </section>

        <section>
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Experience</h5>
          <div className="space-y-5">
            {profile.experience?.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <p className="text-[11px] font-bold text-slate-800">{exp.role}</p>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{exp.period}</span>
                </div>
                <p className="text-[9px] text-primary-container font-bold">{exp.company} | {exp.location}</p>
                <p className="text-[9px] text-slate-500 leading-relaxed mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

const ATSTemplate: React.FC<{ profile: UserProfile }> = ({ profile }) => (
  <div className="font-sans text-slate-900 space-y-6 max-w-[95%] mx-auto py-4">
    {/* Header */}
    <div className="text-center space-y-1 border-b-0 pb-0">
      <h1 className="text-3xl font-bold tracking-tight text-black">{profile.fullName}</h1>
      <div className="text-[10px] flex justify-center gap-2 text-slate-700">
        <span>{profile.location}</span>
        <span>|</span>
        <a href={`mailto:${profile.email}`} className="text-blue-700 underline">{profile.email}</a>
        <span>|</span>
        <span>{profile.phone}</span>
      </div>
      <div className="text-[10px] flex justify-center gap-2 text-slate-700">
        {profile.socials.linkedin && (
          <>
            <a href={profile.socials.linkedin.startsWith('http') ? profile.socials.linkedin : `https://${profile.socials.linkedin}`} className="text-blue-700 underline">
              {profile.socials.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
            <span>|</span>
          </>
        )}
        {profile.socials.github && (
          <>
            <a href={profile.socials.github.startsWith('http') ? profile.socials.github : `https://${profile.socials.github}`} className="text-blue-700 underline">
              {profile.socials.github.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
            <span>|</span>
          </>
        )}
        {profile.socials.portfolio && (
          <a href={profile.socials.portfolio.startsWith('http') ? profile.socials.portfolio : `https://${profile.socials.portfolio}`} className="text-blue-700 underline">
            {profile.socials.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}
      </div>
    </div>

    {/* Summary */}
    <section>
      <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Summary</h2>
      <hr className="border-slate-300 mb-2" />
      <p className="text-[10px] leading-relaxed text-slate-800">{profile.summary}</p>
    </section>

    {/* Experience */}
    <section>
      <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Work Experience</h2>
      <hr className="border-slate-300 mb-2" />
      <div className="space-y-4">
        {profile.experience?.map((exp) => (
          <div key={exp.id} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[11px] font-bold text-black">{exp.role}</h3>
              <span className="text-[10px] text-black">{exp.period}</span>
            </div>
            <p className="text-[10px] text-black font-medium">{exp.company} | {exp.location}</p>
            <ul className="list-disc ml-4 text-[10px] text-slate-700 space-y-0.5">
              {exp.description?.split('\n').map((line: string, i: number) => (
                <li key={i}>{line.trim().startsWith('●') || line.trim().startsWith('-') ? line.trim().substring(1).trim() : line.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* Projects */}
    {profile.projects && profile.projects.length > 0 && (
      <section>
        <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Projects</h2>
        <hr className="border-slate-300 mb-2" />
        <div className="space-y-4">
          {profile.projects.map((project) => (
            <div key={project.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[11px] font-bold text-black">{project.name}</h3>
                {project.link && (
                  <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} className="text-[9px] text-blue-700 font-bold">
                    View in GitHub
                  </a>
                )}
              </div>
              <ul className="list-disc ml-4 text-[10px] text-slate-700 space-y-0.5">
                {project.description?.split('\n').map((line: string, i: number) => (
                  <li key={i}>{line.trim().startsWith('●') || line.trim().startsWith('-') ? line.trim().substring(1).trim() : line.trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {profile.certificates && profile.certificates.length > 0 && (
      <section>
        <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Certifications</h2>
        <hr className="border-slate-300 mb-2" />
        <div className="space-y-1">
          {profile.certificates.map((cert) => (
            <div key={cert.id} className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-black">{cert.name} ({cert.issuer})</p>
              <span className="text-[9px] text-blue-700 font-bold">View credentials</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {profile.education && profile.education.length > 0 && (
      <section>
        <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Education</h2>
        <hr className="border-slate-300 mb-2" />
        <div className="space-y-2">
          {profile.education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[11px] font-bold text-black">{edu.degree}</h3>
                <span className="text-[10px] text-black">{edu.period}</span>
              </div>
              <p className="text-[10px] text-black font-medium">{edu.school}, {edu.location}</p>
              {edu.description && <p className="text-[9px] text-slate-600 italic">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    <section>
      <h2 className="text-[12px] font-bold uppercase text-blue-800 tracking-wider mb-1">Skills</h2>
      <hr className="border-slate-300 mb-2" />
      <div className="space-y-1.5">
        <div className="text-[10px]">
          <span className="font-bold text-black">Hard Skills: </span>
          <span className="text-slate-700">
            {profile.skills.filter(s => s.type === 'Hard').map(s => s.name).join(', ')}
          </span>
        </div>
        <div className="text-[10px]">
          <span className="font-bold text-black">Soft Skills: </span>
          <span className="text-slate-700">
            {profile.skills.filter(s => s.type === 'Soft').map(s => s.name).join(', ')}
          </span>
        </div>
      </div>
    </section>
  </div>
);

const CreativeTemplate: React.FC<{ profile: UserProfile }> = ({ profile }) => (
  <div className="flex h-full gap-0 -m-12 font-sans">
    {/* Sidebar */}
    <div className="w-[35%] bg-slate-900 text-white p-10 flex flex-col shadow-2xl">
      <div className="mb-12 text-center">
        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary via-primary-container to-secondary rounded-3xl mb-6 border-4 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
        <h1 className="text-2xl font-black font-headline leading-tight tracking-tight">{profile.fullName}</h1>
        <div className="h-1 w-12 bg-primary mx-auto my-3 rounded-full" />
        <p className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">{profile.targetRole}</p>
      </div>

      <div className="space-y-10 flex-1">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
            <div className="w-4 h-px bg-primary/30" /> Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[9px] opacity-70 font-medium truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[9px] opacity-70 font-medium">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[9px] opacity-70 font-medium">{profile.location}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
            <div className="w-4 h-px bg-primary/30" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span key={i} className="px-2.5 py-1 bg-white/5 hover:bg-primary/10 rounded-md text-[8px] font-bold border border-white/5 transition-colors cursor-default">
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {profile.languages.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
              <div className="w-4 h-px bg-primary/30" /> Languages
            </h2>
            <div className="space-y-3">
              {profile.languages.map((lang, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="opacity-80 font-bold">{lang}</span>
                    <span className="text-primary/60">Fluent</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 bg-white p-14 text-slate-900 flex flex-col">
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4 text-slate-400">
          <span className="w-12 h-1 bg-primary rounded-full" /> Profile
        </h2>
        <p className="text-[11px] leading-relaxed text-slate-600 font-medium text-justify">
          {profile.summary}
        </p>
      </section>

      <section className="flex-1">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4 text-slate-400">
          <span className="w-12 h-1 bg-primary rounded-full" /> Experience
        </h2>
        <div className="space-y-10 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-slate-50 ml-[7px] rounded-full" />
          {profile.experience?.map((exp) => (
            <div key={exp.id} className="relative pl-10 group">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-primary shadow-lg group-hover:scale-125 transition-transform duration-300" />
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{exp.role}</h3>
                <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">{exp.period}</span>
              </div>
              <p className="text-[10px] text-primary-container font-black mb-3">{exp.company} | {exp.location}</p>
              <p className="text-[10px] leading-relaxed text-slate-500 font-medium text-justify">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {profile.certificates && profile.certificates.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-50">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4 text-slate-400">
            <span className="w-12 h-1 bg-primary rounded-full" /> Certifications
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {profile.certificates.map((cert) => (
              <div key={cert.id} className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Award className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{cert.name}</p>
                  <p className="text-[8px] text-slate-400 font-medium">{cert.issuer} • {cert.issue_date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

const steps = [
  { id: 'personal', label: 'Personal & Core', icon: User },
  { id: 'education', label: 'Education', icon: Award },
  { id: 'projects', label: 'Projects', icon: Layout },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'skills', label: 'Neural Skills', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: FileText },
];

const locations = {
  '+62': [
    'Surabaya, East Java',
    'Malang, East Java',
    'Sidoarjo, East Java',
    'Gresik, East Java',
    'Pasuruan, East Java',
    'Mojokerto, East Java',
    'Probolinggo, East Java',
    'Jember, East Java',
    'Banyuwangi, East Java',
    'Kediri, East Java',
    'Madiun, East Java',
    'Blitar, East Java',
    'Batu, East Java'
  ],
  '+1': [
    'Seattle, WA',
    'Spokane, WA',
    'Tacoma, WA',
    'Vancouver, WA',
    'Bellevue, WA',
    'Kent, WA',
    'Everett, WA',
    'Renton, WA',
    'Federal Way, WA',
    'Yakima, WA'
  ]
};

const WORLD_LANGUAGES = [
  'English',
  'Indonesian',
  'Mandarin Chinese',
  'Spanish',
  'French',
  'Arabic',
  'Bengali',
  'Portuguese',
  'Russian',
  'Japanese',
  'German',
  'Korean',
  'Vietnamese',
  'Italian',
  'Turkish',
  'Thai',
  'Hindi',
  'Dutch',
  'Malay'
].sort();

export const CVBuilder: React.FC = () => {
  const profile = useStore(state => state.profile);
  const setProfile = useStore(state => state.setProfile);
  const addSkill = useStore(state => state.addSkill);
  const removeSkill = useStore(state => state.removeSkill);
  const addExperience = useStore(state => state.addExperience);
  const removeExperience = useStore(state => state.removeExperience);
  const addEducation = useStore(state => state.addEducation);
  const removeEducation = useStore(state => state.removeEducation);
  const addProject = useStore(state => state.addProject);
  const removeProject = useStore(state => state.removeProject);
  const addCertificate = useStore(state => state.addCertificate);
  const removeCertificate = useStore(state => state.removeCertificate);
  const setToast = useStore(state => state.setToast);
  const isLoadingStore = useStore(state => state.isLoading);
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('cv_builder_step');
    return saved ? parseInt(saved) : 0;
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('cv_builder_template') || 'ats';
  });
  const [countryCode, setCountryCode] = useState('+62');
  const [hasInitializedCountry, setHasInitializedCountry] = useState(false);

  const [isDraftSaved, setIsDraftSaved] = useState(true);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [detectedDraft, setDetectedDraft] = useState<any>(null);

  // Persistence for current step and template
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('cv_builder_step', currentStep.toString());
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('cv_builder_template', template);
    }, 500);
    return () => clearTimeout(timer);
  }, [template]);

  // Persistence for profile draft
  useEffect(() => {
    if (profile) {
      setIsDraftSaved(false);
      const timer = setTimeout(() => {
        localStorage.setItem('cv_builder_profile_draft', JSON.stringify({
          ...profile,
          _timestamp: Date.now()
        }));
        setIsDraftSaved(true);
      }, 500); // Reduced to 500ms
      return () => clearTimeout(timer);
    }
  }, [profile]);

  // Save on unload
  useEffect(() => {
    const handleUnload = () => {
      if (profile) {
        localStorage.setItem('cv_builder_profile_draft', JSON.stringify({
          ...profile,
          _timestamp: Date.now()
        }));
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [profile]);

  // Load draft on mount
  useEffect(() => {
    if (!profile || isLoadingStore || hasRestoredDraft) return;

    const savedDraft = localStorage.getItem('cv_builder_profile_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setDetectedDraft(draft);
        
        // Check if draft is significantly more complete or newer than current profile
        const currentSummaryLen = profile.summary?.length || 0;
        const draftSummaryLen = draft.summary?.length || 0;
        
        const currentExpLen = profile.experience?.length || 0;
        const draftExpLen = draft.experience?.length || 0;

        // If draft has more content OR it was saved very recently (within last 5 mins) and current is empty
        const isDraftNewer = draft._timestamp && (Date.now() - draft._timestamp < 300000);
        const isCurrentEmpty = !profile.fullName && !profile.summary && profile.experience.length === 0;

        if (((draftSummaryLen > currentSummaryLen + 5 || draftExpLen > currentExpLen) || (isDraftNewer && isCurrentEmpty)) && 
            (draft.id === profile.id || !draft.id || !profile.id)) {
          
          // Merge draft into profile
          setProfile({
            ...draft,
            id: profile.id || draft.id, // Keep current user ID if available
            email: profile.email || draft.email, // Keep current email if available
          });
          
          setHasRestoredDraft(true);
          setToast({ 
            message: "Restored your unsaved changes from local storage.", 
            type: 'info' 
          });
        }
      } catch (e) {
        console.error('Failed to parse CV draft:', e);
      }
    }
  }, [isLoadingStore, profile?.id, hasRestoredDraft]);

  const handleManualRestore = () => {
    if (detectedDraft) {
      setProfile({
        ...detectedDraft,
        id: profile?.id || detectedDraft.id,
        email: profile?.email || detectedDraft.email,
      });
      setHasRestoredDraft(true);
      setDetectedDraft(null);
      setToast({ message: "Draft restored successfully!", type: 'success' });
    }
  };

  useEffect(() => {
    if (profile?.phone && !hasInitializedCountry) {
      if (profile.phone.startsWith('+1')) setCountryCode('+1');
      else if (profile.phone.startsWith('+62')) setCountryCode('+62');
      setHasInitializedCountry(true);
    }
  }, [profile?.phone, hasInitializedCountry]);

  // Modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Form states with local storage persistence
  const [newSkill, setNewSkill] = useState<UserSkill>(() => {
    const saved = localStorage.getItem('cv_builder_new_skill');
    return saved ? JSON.parse(saved) : { id: '', name: '', score: 50, type: 'Hard' };
  });
  const [newExp, setNewExp] = useState<any>(() => {
    const saved = localStorage.getItem('cv_builder_new_exp');
    return saved ? JSON.parse(saved) : { 
      id: '', 
      company: '', 
      role: '', 
      location: '',
      startDate: '', 
      endDate: '', 
      isCurrent: false,
      description: '' 
    };
  });
  const [newEdu, setNewEdu] = useState<any>(() => {
    const saved = localStorage.getItem('cv_builder_new_edu');
    return saved ? JSON.parse(saved) : { id: '', school: '', degree: '', startDate: '', endDate: '', isCurrent: false, location: '', description: '' };
  });
  const [newProject, setNewProject] = useState<any>(() => {
    const saved = localStorage.getItem('cv_builder_new_project');
    return saved ? JSON.parse(saved) : { id: '', name: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '', link: '' };
  });
  const [expBullets, setExpBullets] = useState<string[]>(() => {
    const saved = localStorage.getItem('cv_builder_exp_bullets');
    return saved ? JSON.parse(saved) : [''];
  });
  const [projectBullets, setProjectBullets] = useState<string[]>(() => {
    const saved = localStorage.getItem('cv_builder_project_bullets');
    return saved ? JSON.parse(saved) : [''];
  });
  const [newCert, setNewCert] = useState<Omit<Certificate, 'id' | 'user_id'>>(() => {
    const saved = localStorage.getItem('cv_builder_new_cert');
    return saved ? JSON.parse(saved) : {
      name: '',
      issuer: '',
      issue_date: '',
      expiration_date: '',
      skill_demand_id: '',
      hard_skill_id: '',
      soft_skill_id: '',
    };
  });

  // Persist form states with debouncing
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_new_skill', JSON.stringify(newSkill)), 500);
    return () => clearTimeout(timer);
  }, [newSkill]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_new_exp', JSON.stringify(newExp)), 500);
    return () => clearTimeout(timer);
  }, [newExp]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_new_edu', JSON.stringify(newEdu)), 500);
    return () => clearTimeout(timer);
  }, [newEdu]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_new_project', JSON.stringify(newProject)), 500);
    return () => clearTimeout(timer);
  }, [newProject]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_exp_bullets', JSON.stringify(expBullets)), 500);
    return () => clearTimeout(timer);
  }, [expBullets]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_project_bullets', JSON.stringify(projectBullets)), 500);
    return () => clearTimeout(timer);
  }, [projectBullets]);
  useEffect(() => { 
    const timer = setTimeout(() => localStorage.setItem('cv_builder_new_cert', JSON.stringify(newCert)), 500);
    return () => clearTimeout(timer);
  }, [newCert]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setToast({ 
        message: "CV Generated Successfully! Your profile is now optimized for the Neural Engine.", 
        type: 'success' 
      });
      // Optionally navigate to dashboard or show a success state
      setCurrentStep(0); // Reset or stay on last step? Let's stay on last step but show success
    }, 2000);
  };

  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    await addSkill({ ...newSkill, id: crypto.randomUUID() });
    setNewSkill({ id: '', name: '', score: 50, type: 'Hard' });
    setIsSkillModalOpen(false);
  };

  const handleAddExp = async () => {
    if (!newExp.company || !newExp.role || !newExp.startDate) return;
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const period = `${formatDate(newExp.startDate)} - ${newExp.isCurrent ? 'Present' : formatDate(newExp.endDate)}`;

    const description = expBullets
      .filter(b => b.trim() !== '')
      .map(b => `● ${b.trim()}`)
      .join('\n');

    await addExperience({ 
      ...newExp, 
      company_name: newExp.company,
      start_date: newExp.startDate,
      end_date: newExp.endDate,
      is_current: newExp.isCurrent,
      period,
      description, 
      id: crypto.randomUUID() 
    });
    setNewExp({ id: '', company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    setExpBullets(['']);
    setIsExpModalOpen(false);
  };

  const handleAddEdu = async () => {
    if (!newEdu.school || !newEdu.degree) return;
    
    const startYear = newEdu.startDate ? newEdu.startDate.split('-')[0] : '';
    const endYear = newEdu.isCurrent ? 'Present' : (newEdu.endDate ? newEdu.endDate.split('-')[0] : 'Present');
    const period = startYear && endYear ? `${startYear} - ${endYear}` : (startYear || endYear || '');

    await addEducation({ 
      ...newEdu, 
      field_of_study: newEdu.degree,
      start_date: newEdu.startDate,
      end_date: newEdu.isCurrent ? null : newEdu.endDate,
      period,
      id: crypto.randomUUID() 
    });
    setNewEdu({ id: '', school: '', degree: '', startDate: '', endDate: '', isCurrent: false, location: '', description: '' });
    setIsEduModalOpen(false);
  };

  const handleAddProject = async () => {
    if (!newProject.name) return;
    
    const startYear = newProject.startDate ? newProject.startDate.split('-')[0] : '';
    const endYear = newProject.isCurrent ? 'Present' : (newProject.endDate ? newProject.endDate.split('-')[0] : 'Present');
    const period = startYear && endYear ? `${startYear} - ${endYear}` : (startYear || endYear || '');

    const description = projectBullets
      .filter(b => b.trim() !== '')
      .map(b => `● ${b.trim()}`)
      .join('\n');
    await addProject({ 
      ...newProject, 
      description, 
      period,
      id: crypto.randomUUID() 
    });
    setNewProject({ id: '', name: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '', link: '' });
    setProjectBullets(['']);
    setIsProjectModalOpen(false);
  };

  const handleAddCert = async () => {
    if (!newCert.name || !newCert.issuer) return;
    await addCertificate({ ...newCert, id: crypto.randomUUID() });
    setNewCert({
      name: '',
      issuer: '',
      issue_date: '',
      expiration_date: '',
      skill_demand_id: '',
      hard_skill_id: '',
      soft_skill_id: '',
    });
    setIsCertModalOpen(false);
  };

  if (!profile || isLoadingStore) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xs text-outline font-bold animate-pulse uppercase tracking-widest">Synchronizing Neural Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-0 min-h-[calc(100vh-80px)] animate-in fade-in duration-500">
      {/* Skill Modal */}
      <AnimatePresence>
        {isSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Add New Skill</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Skill Name</label>
                  <input 
                    type="text" 
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. React, Python, UI Design"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Score (0-100)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={newSkill.score}
                      onChange={(e) => setNewSkill({ ...newSkill, score: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Type</label>
                    <select 
                      value={newSkill.type}
                      onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value as any })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none appearance-none"
                    >
                      <option value="Hard">Hard Skill</option>
                      <option value="Soft">Soft Skill</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsSkillModalOpen(false)}
                    className="flex-1 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddSkill}
                    className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certification Modal */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-xl font-bold mb-6">Add New Certification</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Certificate Name</label>
                  <input 
                    type="text" 
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Issuer</label>
                  <input 
                    type="text" 
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Issue Date</label>
                    <input 
                      type="date" 
                      value={newCert.issue_date}
                      onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Expiration Date (Optional)</label>
                    <input 
                      type="date" 
                      value={newCert.expiration_date}
                      onChange={(e) => setNewCert({ ...newCert, expiration_date: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsCertModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCert}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all"
                >
                  Add Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Add Project</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Project Name</label>
                    <input 
                      type="text" 
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="e.g. E-commerce Platform"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Your Role</label>
                    <input 
                      type="text" 
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                      placeholder="e.g. Lead Developer"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Start Date</label>
                    <input 
                      type="month" 
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">End Date (or Expected)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="month" 
                        value={newProject.endDate}
                        disabled={newProject.isCurrent}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newProject.isCurrent}
                          onChange={(e) => setNewProject({ ...newProject, isCurrent: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                        />
                        <span className="text-[10px] font-bold text-outline uppercase">I currently work on this</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Project Link (Optional)</label>
                  <input 
                    type="text" 
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    placeholder="e.g. github.com/user/repo"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Key Achievements (Bullets)</label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                    {projectBullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="mt-2.5 text-primary text-xs">●</div>
                        <input 
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...projectBullets];
                            newBullets[idx] = e.target.value;
                            setProjectBullets(newBullets);
                          }}
                          placeholder="e.g. Led the development of..."
                          className="flex-1 bg-surface-container-high border border-white/5 rounded-xl py-2 px-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {projectBullets.length > 1 && (
                          <button 
                            onClick={() => setProjectBullets(projectBullets.filter((_, i) => i !== idx))}
                            className="p-2 text-outline hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setProjectBullets([...projectBullets, ''])}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline px-1"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddProject}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all"
                >
                  Add Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Education Modal */}
      <AnimatePresence>
        {isEduModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Add Education</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Degree / Major</label>
                    <input 
                      type="text" 
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">School / University</label>
                    <input 
                      type="text" 
                      value={newEdu.school}
                      onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                      placeholder="e.g. Stanford University"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Start Date</label>
                    <input 
                      type="month" 
                      value={newEdu.startDate}
                      onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">End Date (or Expected)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="month" 
                        value={newEdu.endDate}
                        disabled={newEdu.isCurrent}
                        onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newEdu.isCurrent}
                          onChange={(e) => setNewEdu({ ...newEdu, isCurrent: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                        />
                        <span className="text-[10px] font-bold text-outline uppercase">I currently study here</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    value={newEdu.location}
                    onChange={(e) => setNewEdu({ ...newEdu, location: e.target.value })}
                    placeholder="e.g. Palo Alto, CA"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                    placeholder="e.g. GPA 3.9/4.0, Cum Laude"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsEduModalOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEdu}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all"
                >
                  Add Education
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Experience Modal */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Add Experience</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Role / Position</label>
                    <input 
                      type="text" 
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      placeholder="e.g. Senior Developer"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Company</label>
                    <input 
                      type="text" 
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                      placeholder="e.g. Google"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    placeholder="e.g. Jakarta, Indonesia"
                    className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">Start Date</label>
                    <input 
                      type="month" 
                      value={newExp.startDate}
                      onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest">End Date</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="month" 
                        value={newExp.endDate}
                        disabled={newExp.isCurrent}
                        onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newExp.isCurrent}
                          onChange={(e) => setNewExp({ ...newExp, isCurrent: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                        />
                        <span className="text-[10px] font-bold text-outline uppercase">I currently work here</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest">Key Achievements (Bullets)</label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                    {expBullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="mt-2.5 text-primary text-xs">●</div>
                        <input 
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...expBullets];
                            newBullets[idx] = e.target.value;
                            setExpBullets(newBullets);
                          }}
                          placeholder="e.g. Improved system reliability by 20%"
                          className="flex-1 bg-surface-container-high border border-white/5 rounded-xl py-2 px-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {expBullets.length > 1 && (
                          <button 
                            onClick={() => setExpBullets(expBullets.filter((_, i) => i !== idx))}
                            className="p-2 text-outline hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setExpBullets([...expBullets, ''])}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline px-1"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement
                  </button>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsExpModalOpen(false)}
                    className="flex-1 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddExp}
                    className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <div className="col-span-12 lg:col-span-7 p-6 md:p-8 lg:p-12 overflow-y-auto border-r border-outline-variant/10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Draft Detection Alert */}
          <AnimatePresence>
            {detectedDraft && !hasRestoredDraft && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Unsaved draft detected</p>
                    <p className="text-[10px] text-on-surface-variant">We found a more recent version of your CV in this browser.</p>
                  </div>
                </div>
                <button 
                  onClick={handleManualRestore}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
                >
                  Restore Draft
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 shadow-xl shadow-primary/5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold">Step 0{currentStep + 1} / 0{steps.length}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isDraftSaved ? "bg-primary" : "bg-warning animate-pulse")} />
                    <span className="text-[9px] text-outline font-bold uppercase tracking-tighter">
                      {isDraftSaved ? 'Changes Saved Locally' : 'Saving Draft...'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant">{steps[currentStep].label} Information</span>
              </div>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 mt-6 gap-2">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[14px] transition-all",
                    i < currentStep ? "bg-tertiary/20 text-tertiary" : 
                    i === currentStep ? "bg-primary text-on-primary font-bold" : 
                    "bg-surface-container-highest text-outline"
                  )}>
                    {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:inline",
                    i === currentStep ? "text-on-surface" : "text-on-surface-variant"
                  )}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Template Switcher */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Select Template Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'modern', label: 'Modern', desc: 'AI Optimized', icon: Layout, locked: true },
                { id: 'ats', label: 'ATS', desc: 'Standard Profile', icon: FileText, locked: false },
                { id: 'creative', label: 'Creative', desc: 'Visual Heavy', icon: Palette, locked: true },
              ].map((tpl) => (
                <button 
                  key={tpl.id}
                  onClick={() => {
                    if (tpl.locked) {
                      setToast({ 
                        message: `Template ${tpl.label} masih dalam tahap pengembangan.`, 
                        type: 'info' 
                      });
                      return;
                    }
                    setTemplate(tpl.id);
                  }}
                  className={cn(
                    "bg-surface-container-low p-4 rounded-xl text-left border-2 transition-all group relative",
                    template === tpl.id ? "border-primary ring-4 ring-primary/10 bg-surface-container-high" : "border-transparent hover:bg-surface-container-high",
                    tpl.locked && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <div className="aspect-[3/4] bg-surface-container-highest rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                    <tpl.icon className={cn("w-8 h-8 transition-all duration-500", template === tpl.id ? "text-primary scale-110" : "text-outline group-hover:text-primary")} />
                    {template === tpl.id && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                        <Check className="w-3 h-3 text-on-primary" />
                      </div>
                    )}
                    {tpl.locked && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <LockIcon className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-on-surface">{tpl.label}</span>
                    {tpl.locked && <LockIcon className="w-3 h-3 text-outline" />}
                  </div>
                  <span className="block text-[10px] text-on-surface-variant uppercase tracking-tighter">{tpl.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface-container-low p-5 md:p-8 rounded-xl space-y-6 border border-white/5"
            >
              <h4 className="text-xl font-bold text-on-surface">
                {steps[currentStep].label} Details
              </h4>
              
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        value={profile.fullName}
                        onChange={(e) => setProfile({ fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email
                      </label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({ email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Phone
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative shrink-0">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            <img 
                              src={countryCode === '+62' ? 'https://flagcdn.com/w20/id.png' : 'https://flagcdn.com/w20/us.png'} 
                              alt="flag"
                              className="w-4 h-3 object-cover rounded-sm"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <select 
                            value={countryCode}
                            onChange={(e) => {
                              const newCode = e.target.value;
                              const oldNumber = profile.phone.replace(countryCode, '');
                              setCountryCode(newCode);
                              setProfile({ phone: `${newCode}${oldNumber}` });
                            }}
                            className="w-full sm:w-auto bg-surface-container-high border border-white/5 rounded-xl py-3 pl-9 pr-7 text-sm text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="+62">+62</option>
                            <option value="+1">+1</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-outline pointer-events-none" />
                        </div>
                        <input 
                          type="tel" 
                          value={profile.phone.replace(countryCode, '')}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (countryCode === '+62' && val.startsWith('0')) {
                              val = val.substring(1);
                            }
                            if (countryCode === '+1' && val.length > 10) return;
                            if (countryCode === '+62' && val.length > 12) return;
                            setProfile({ phone: `${countryCode}${val}` });
                          }}
                          placeholder={countryCode === '+62' ? '81234567890' : '5550123456'}
                          className="flex-1 bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none min-w-0"
                        />
                      </div>
                      <p className="text-[9px] text-outline px-1 flex justify-between">
                        <span>{countryCode === '+62' ? 'Indonesia: 10-12 digits' : 'USA: 10 digits'}</span>
                        <span className={cn(
                          "font-bold",
                          countryCode === '+1' 
                            ? (profile.phone.replace(countryCode, '').length === 10 ? "text-primary" : "text-error")
                            : (profile.phone.replace(countryCode, '').length >= 10 && profile.phone.replace(countryCode, '').length <= 12 ? "text-primary" : "text-error")
                        )}>
                          {profile.phone.replace(countryCode, '').length} digits
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Location
                      </label>
                      <div className="relative">
                        <select 
                          value={profile.location}
                          onChange={(e) => setProfile({ location: e.target.value })}
                          className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Select Location</option>
                          {locations[countryCode as keyof typeof locations].map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                      </div>
                      <p className="text-[9px] text-outline px-1">
                        Showing regions for {countryCode === '+62' ? 'East Java, Indonesia' : 'Washington, USA'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Linkedin className="w-3 h-3" /> LinkedIn
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={profile.socials.linkedin}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Basic validation: allow empty or if it contains linkedin
                            if (val === '' || val.toLowerCase().includes('linkedin.com')) {
                              setProfile({ socials: { ...profile.socials, linkedin: val } });
                            } else {
                              // If they try to paste something else, we can either block or show error
                              // For now, let's block non-linkedin strings if they are long enough to be a URL
                              if (val.length < 8) {
                                setProfile({ socials: { ...profile.socials, linkedin: val } });
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (val && !val.toLowerCase().includes('linkedin.com')) {
                              setToast({ 
                                message: "Invalid URL. Please provide a valid LinkedIn profile link.", 
                                type: 'error' 
                              });
                              setProfile({ socials: { ...profile.socials, linkedin: '' } });
                            }
                          }}
                          placeholder="linkedin.com/in/username"
                          className={cn(
                            "w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none",
                            profile.socials.linkedin && !profile.socials.linkedin.toLowerCase().includes('linkedin.com') && "border-error/50 ring-1 ring-error/20"
                          )}
                        />
                        {profile.socials.linkedin && profile.socials.linkedin.toLowerCase().includes('linkedin.com') && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-in zoom-in duration-300">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] text-outline px-1">
                        Only official LinkedIn profile URLs are accepted.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Github className="w-3 h-3" /> GitHub
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={profile.socials.github}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || val.toLowerCase().includes('github.com')) {
                              setProfile({ socials: { ...profile.socials, github: val } });
                            } else if (val.length < 8) {
                              setProfile({ socials: { ...profile.socials, github: val } });
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (val && !val.toLowerCase().includes('github.com')) {
                              setToast({ message: "Please provide a valid GitHub link.", type: 'error' });
                              setProfile({ socials: { ...profile.socials, github: '' } });
                            }
                          }}
                          placeholder="github.com/username"
                          className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                        />
                        {profile.socials.github && profile.socials.github.toLowerCase().includes('github.com') && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-in zoom-in duration-300">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Portfolio
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={profile.socials.portfolio}
                          onChange={(e) => setProfile({ socials: { ...profile.socials, portfolio: e.target.value } })}
                          placeholder="yourportfolio.com"
                          className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                        />
                        {profile.socials.portfolio && (profile.socials.portfolio.includes('.') || profile.socials.portfolio.includes('http')) && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-in zoom-in duration-300">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Target Role
                      </label>
                      <input 
                        type="text" 
                        value={profile.targetRole}
                        onChange={(e) => setProfile({ targetRole: e.target.value })}
                        placeholder="e.g. Senior AI Engineer"
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Availability
                      </label>
                      <select 
                        value={profile.availability || ''}
                        onChange={(e) => setProfile({ availability: e.target.value as any })}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="2_weeks">2 Weeks Notice</option>
                        <option value="1_month">1 Month Notice</option>
                        <option value="3_months">3 Months Notice</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Languages
                      </label>
                      <div className="space-y-3">
                        <div className="relative">
                          <select 
                            value=""
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val && !profile.languages.includes(val)) {
                                setProfile({ languages: [...profile.languages, val] });
                              }
                            }}
                            className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Add a language...</option>
                            {WORLD_LANGUAGES.map(lang => (
                              <option key={lang} value={lang} disabled={profile.languages.includes(lang)}>
                                {lang}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.map((lang) => (
                            <span 
                              key={lang} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20 animate-in zoom-in duration-200"
                            >
                              {lang}
                              <button 
                                onClick={() => setProfile({ languages: profile.languages.filter(l => l !== lang) })}
                                className="hover:text-error transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {profile.languages.length === 0 && (
                            <p className="text-[10px] text-outline italic px-1">No languages selected</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                      <Target className="w-3 h-3" /> Personal Summary
                    </label>
                    <textarea 
                      rows={3}
                      value={profile.summary}
                      onChange={(e) => setProfile({ summary: e.target.value })}
                      placeholder="A brief overview of who you are..."
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all resize-none outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Career Goals
                    </label>
                    <textarea 
                      rows={2}
                      value={profile.careerGoals}
                      onChange={(e) => setProfile({ careerGoals: e.target.value })}
                      placeholder="What are your career aspirations?"
                      className="w-full bg-surface-container-high border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all resize-none outline-none"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface">Academic Background</h3>
                    <button 
                      onClick={() => setIsEduModalOpen(true)}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/20"
                    >
                      <Plus className="w-3 h-3" /> Add Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.education?.map((edu, i) => (
                      <div key={i} className="bg-surface-container-high p-4 rounded-xl flex items-center justify-between group border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{edu.degree}</p>
                            <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">
                              {edu.school} • {edu.period}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!profile.education || profile.education.length === 0) && (
                      <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                        <Award className="w-12 h-12 text-outline/20 mx-auto mb-4" />
                        <p className="text-sm text-outline">No education added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface">Key Projects</h3>
                    <button 
                      onClick={() => setIsProjectModalOpen(true)}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/20"
                    >
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.projects?.map((project, i) => (
                      <div key={i} className="bg-surface-container-high p-4 rounded-xl flex items-center justify-between group border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layout className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{project.name}</p>
                            <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">
                              {project.role || 'Contributor'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeProject(project.id)}
                          className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!profile.projects || profile.projects.length === 0) && (
                      <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                        <Layout className="w-12 h-12 text-outline/20 mx-auto mb-4" />
                        <p className="text-sm text-outline">No projects added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface">Certifications & Credentials</h3>
                    <button 
                      onClick={() => setIsCertModalOpen(true)}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/20"
                    >
                      <Plus className="w-3 h-3" /> Add Certificate
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.certificates?.map((cert, i) => (
                      <div key={i} className="bg-surface-container-high p-4 rounded-xl flex items-center justify-between group border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{cert.name}</p>
                            <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">
                              {cert.issuer} • {cert.issue_date}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeCertificate(cert.id)}
                          className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!profile.certificates || profile.certificates.length === 0) && (
                      <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                        <Award className="w-12 h-12 text-outline/20 mx-auto mb-4" />
                        <p className="text-sm text-outline">No certifications added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface">Your Neural Skills</h3>
                    <button 
                      onClick={() => setIsSkillModalOpen(true)}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/20"
                    >
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.skills.map((skill, i) => (
                      <div key={i} className="bg-surface-container-high p-4 rounded-xl flex items-center justify-between group border border-white/5">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{skill.name}</p>
                          <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter">{skill.score}%</p>
                        </div>
                        <button 
                          onClick={() => removeSkill(skill.id)}
                          className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface">Professional Trajectory</h3>
                    <button 
                      onClick={() => setIsExpModalOpen(true)}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/20"
                    >
                      <Plus className="w-3 h-3" /> Add Experience
                    </button>
                  </div>
                  {profile.experience?.map((exp) => (
                    <div key={exp.id} className="bg-surface-container-high p-6 rounded-2xl space-y-4 relative group border border-white/5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-bold text-on-surface">{exp.role}</h4>
                          <p className="text-sm text-primary font-medium">{exp.company}</p>
                        </div>
                        <span className="text-xs font-bold text-outline">{exp.period}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{exp.description}</p>
                      <button 
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-4 right-4 text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-6">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">Previous</span>
                </button>
                
                <button 
                  onClick={() => currentStep < steps.length - 1 ? setCurrentStep(prev => prev + 1) : handleOptimize()}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      {isOptimizing ? 'Neural Processing...' : 'Generate CV'} 
                      {!isOptimizing && <Sparkles className="w-4 h-4" />}
                    </>
                  ) : (
                    <>Next Step <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* AI Floating Action */}
          <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-between border-t border-primary/10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-tertiary to-secondary flex items-center justify-center shadow-lg shadow-tertiary/20">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AI Assistant is ready</p>
                <p className="text-[10px] text-on-surface-variant">We can optimize your wording for ATS compliance now.</p>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all">
              Optimize CV
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="col-span-12 lg:col-span-5 bg-surface p-6 md:p-12 relative overflow-y-auto no-scrollbar border-t lg:border-t-0 border-white/5">
        <div className="sticky top-0 space-y-6">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Real-time Preview</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-low rounded-lg text-outline hover:text-primary transition-all">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.print()}
                className="p-2 bg-surface-container-low rounded-lg text-outline hover:text-primary transition-all"
                title="Download as PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Resume Preview */}
          <div 
            id="cv-printable-area"
            className="aspect-[1/1.414] bg-white shadow-2xl rounded-sm p-6 md:p-12 transform origin-top hover:scale-[1.01] transition-all duration-500 overflow-hidden"
          >
            <div className="text-slate-900 h-full flex flex-col overflow-y-auto no-scrollbar">
              {template === 'modern' && <ModernTemplate profile={profile} />}
              {template === 'ats' && <ATSTemplate profile={profile} />}
              {template === 'creative' && <CreativeTemplate profile={profile} />}
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
                <span className="text-[7px] text-slate-300 uppercase tracking-widest font-bold">Generated by Talent Graph AI</span>
                <span className="text-[7px] text-slate-300">Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant flex items-center gap-2 hover:text-white transition-all border border-white/5"
            >
              <Printer className="w-3 h-3" /> Print / PDF
            </button>
            <button className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant flex items-center gap-2 hover:text-white transition-all border border-white/5">
              <Share2 className="w-3 h-3" /> Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

