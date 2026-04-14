import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface UserSkill {
  id: string;
  name: string;
  score: number;
  type: 'Hard' | 'Soft';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  careerGoals: string;
  targetRole: string;
  jobRoleId?: string;
  socials: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  skills: UserSkill[];
  experience: Experience[];
  certificates: Certificate[];
  education: Education[];
  projects: Project[];
  languages: string[];
  availability?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  link?: string;
}

export interface Experience {
  id: string;
  company_name: string;
  company?: string; // For UI compatibility
  role?: string; // For UI compatibility
  job_role_id?: string;
  employment_type?: string;
  is_current: boolean;
  start_date: string;
  end_date?: string;
  period?: string; // For UI compatibility
  location_type?: string;
  location: string;
  description?: string;
  hard_skill_id?: string;
  soft_skill_id?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  period?: string; // For UI compatibility
  location?: string; // For UI compatibility
  grade?: string;
  description?: string;
  hard_skill_id?: string;
  soft_skill_id?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string;
  skill_demand_id?: string;
  hard_skill_id?: string;
  soft_skill_id?: string;
}

interface AppState {
  profile: UserProfile | null;
  careerScore: number;
  isEngineLaunched: boolean;
  roadmapData: any[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialLoadDone: boolean;
  user: { id: string; email: string; fullName: string; targetRole: string } | null;
  
  // One Click Career State
  selectedJobRole: any | null;
  targetCompanies: string[];
  gapAnalysis: any[] | null;
  toast: { message: string; type: 'error' | 'success' | 'info' } | null;
  notifications: { id: string; title: string; desc: string; time: string; type: 'match' | 'update' | 'alert' }[];
  
  // Intelligence Cache
  marketPulse: any[] | null;
  topSkills: any[] | null;
  marketTrends: any[] | null;
  jobRoles: any[];
  
  setProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addSkill: (skill: UserSkill) => void;
  removeSkill: (id: string) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addCertificate: (cert: any) => void;
  removeCertificate: (id: string) => void;
  setEngineLaunched: (launched: boolean) => void;
  setRoadmapData: (data: any[]) => void;
  updateRoadmapStatus: (id: string, status: 'completed' | 'current' | 'locked') => Promise<void>;
  getRoadmapProgress: () => number;
  setUser: (user: AppState['user']) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isProfileComplete: () => boolean;
  
  // One Click Career Actions
  setSelectedJobRole: (role: any) => void;
  setTargetCompanies: (companies: string[]) => void;
  runGapAnalysis: () => Promise<void>;
  completeLearning: (learningId: string, skillId: string, skillType: 'Hard' | 'Soft', points: number) => Promise<void>;
  setToast: (toast: { message: string; type: 'error' | 'success' | 'info' } | null) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'time'>) => void;
  removeNotification: (id: string) => void;
  setIntelligenceData: (data: { marketPulse?: any[], topSkills?: any[], marketTrends?: any[] }) => void;
  fetchJobRoles: () => Promise<void>;
}

const initialProfile: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  careerGoals: '',
  targetRole: '',
  socials: {
    linkedin: '',
    github: '',
    portfolio: ''
  },
  skills: [],
  experience: [],
  certificates: [],
  education: [],
  projects: [],
  languages: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
  careerScore: 0,
  isEngineLaunched: false,
  roadmapData: null,
  isAuthenticated: false,
  isLoading: true,
  hasInitialLoadDone: false,
  user: null,
  selectedJobRole: null,
  targetCompanies: [],
  gapAnalysis: null,
  toast: null,
  notifications: [
    { id: '1', title: 'New Job Match', desc: 'Senior AI Architect at Google aligns 98% with your profile.', time: '2m ago', type: 'match' },
    { id: '2', title: 'Roadmap Update', desc: 'New certifications added to your trajectory.', time: '1h ago', type: 'update' },
    { id: '3', title: 'Market Alert', desc: 'AI Engineer salaries increased by 12% in San Francisco.', time: '3h ago', type: 'alert' },
  ],
  marketPulse: null,
  topSkills: null,
  marketTrends: null,
  jobRoles: [],

  setProfile: async (newProfile) => {
    const { user, profile } = get();
    
    // Always update local state first
    const updatedProfile = profile 
      ? { ...profile, ...newProfile } 
      : { ...initialProfile, ...newProfile, id: user?.id || '' };
    
    set({ profile: updatedProfile });

    if (!user) return;

    // Debounced sync to Supabase
    const timeoutId = (globalThis as any)._profileSyncTimeout;
    if (timeoutId) clearTimeout(timeoutId);

    (globalThis as any)._profileSyncTimeout = setTimeout(async () => {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: updatedProfile.fullName,
          location: updatedProfile.location,
          summary: updatedProfile.summary,
          career_goals: updatedProfile.careerGoals,
          job_role_id: updatedProfile.jobRoleId,
          socials: updatedProfile.socials,
          languages: updatedProfile.languages,
          availability: updatedProfile.availability
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error syncing profile to Supabase:', error);
      }
      delete (globalThis as any)._profileSyncTimeout;
    }, 2000); // 2 second debounce
  },

  addSkill: async (skill) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update
    const tempId = skill.id || crypto.randomUUID();
    const newSkill = { ...skill, id: tempId };
    set({ profile: { ...profile, skills: [...profile.skills, newSkill] } });

    if (!user) return;

    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: user.id,
        name: skill.name,
        score: skill.score,
        type: skill.type,
        [skill.type === 'Hard' ? 'hard_skill_id' : 'soft_skill_id']: skill.id && skill.id.length > 30 ? skill.id : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding skill to Supabase:', error);
      // Rollback if needed, but for now just log
    } else if (data) {
      // Update with real ID if different
      set({ 
        profile: { 
          ...get().profile!, 
          skills: get().profile!.skills.map(s => s.id === tempId ? { ...s, id: data.id } : s) 
        } 
      });
    }
  },

  removeSkill: async (id) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update
    set({ profile: { ...profile, skills: profile.skills.filter(s => s.id !== id) } });

    if (!user) return;

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting skill from Supabase:', error);
    }
  },

  addExperience: async (exp) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update
    const tempId = exp.id || crypto.randomUUID();
    const newExp = { ...exp, id: tempId };
    set({ profile: { ...profile, experience: [...profile.experience, newExp] } });

    if (!user) return;

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        user_id: user.id,
        company_name: exp.company || exp.company_name,
        role_name: exp.role,
        location: exp.location,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding experience to Supabase:', error);
    } else if (data) {
      const transformed = {
        ...data,
        company: data.company_name,
        role: data.role_name,
        period: data.period || `${new Date(data.start_date).getFullYear()} - ${data.is_current ? 'Present' : (data.end_date ? new Date(data.end_date).getFullYear() : 'Present')}`
      };
      set({ 
        profile: { 
          ...get().profile!, 
          experience: get().profile!.experience.map(e => e.id === tempId ? transformed : e) 
        } 
      });
    }
  },

  removeExperience: async (id) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update
    set({ profile: { ...profile, experience: profile.experience.filter(e => e.id !== id) } });

    if (!user) return;

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting experience from Supabase:', error);
    }
  },

  addEducation: async (edu) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update
    const tempId = crypto.randomUUID();
    const newEdu = { ...edu, id: tempId };
    set({ profile: { ...profile, education: [...profile.education, newEdu] } });

    if (!user) return;
    
    const { data, error } = await supabase
      .from('educations')
      .insert({
        user_id: user.id,
        school: edu.school,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        start_date: edu.start_date,
        end_date: edu.end_date,
        location: edu.location,
        description: edu.description
      })
      .select()
      .single();

    if (!error && data) {
      // Replace temp ID with real DB ID
      const transformed = {
        ...data,
        period: data.period || `${new Date(data.start_date).getFullYear()} - ${data.end_date ? new Date(data.end_date).getFullYear() : 'Present'}`
      };
      set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          education: state.profile.education.map(e => e.id === tempId ? transformed : e)
        } : null
      }));
    } else if (error) {
      console.error('Error saving education to Supabase:', error);
    }
  },

  removeEducation: async (id) => {
    const { user, profile } = get();
    if (!profile) return;
    
    // Optimistic update: remove from local state immediately
    set({ 
      profile: { 
        ...profile, 
        education: profile.education.filter(e => e.id !== id) 
      } 
    });

    // If no user, we're done (local only mode)
    if (!user) return;

    // Attempt to delete from Supabase
    const { error } = await supabase
      .from('educations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting education from Supabase:', error);
      // Optional: Rollback if it's a critical error, but for UX usually better to keep it removed
    }
  },

  addProject: (project: Project) => {
    const { profile } = get();
    if (!profile) return;
    set({ profile: { ...profile, projects: [...(profile.projects || []), project] } });
  },

  removeProject: (id: string) => {
    const { profile } = get();
    if (!profile) return;
    set({ profile: { ...profile, projects: profile.projects.filter(p => p.id !== id) } });
  },

  addCertificate: async (cert) => {
    const { user, profile } = get();
    if (!profile) return;

    // Optimistic update
    const tempId = cert.id || crypto.randomUUID();
    const newCert = { ...cert, id: tempId, user_id: user?.id || '' };
    set({ profile: { ...profile, certificates: [...(profile.certificates || []), newCert] } });

    if (!user) return;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
        expiration_date: cert.expiration_date,
        skill_demand_id: cert.skill_demand_id,
        hard_skill_id: cert.hard_skill_id,
        soft_skill_id: cert.soft_skill_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding certificate to Supabase:', error);
    } else if (data) {
      set({ 
        profile: { 
          ...get().profile!, 
          certificates: get().profile!.certificates.map(c => c.id === tempId ? data : c) 
        } 
      });
    }
  },

  removeCertificate: async (id) => {
    const { user, profile } = get();
    if (!profile) return;

    // Optimistic update
    set({ 
      profile: { 
        ...profile, 
        certificates: profile.certificates.filter(c => c.id !== id) 
      } 
    });

    if (!user) return;

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting certificate from Supabase:', error);
    }
  },

  setEngineLaunched: (launched) => set({ isEngineLaunched: launched }),
  setRoadmapData: (data) => set({ roadmapData: data }),
  
  updateRoadmapStatus: async (id, status) => {
    const { roadmapData } = get();
    if (!roadmapData) return;

    const updatedRoadmap = roadmapData.map(item => 
      item.id === id ? { ...item, status } : item
    );

    // Sync to Supabase
    const { error } = await supabase
      .from('roadmaps')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating roadmap status:', error);
    } else {
      set({ roadmapData: updatedRoadmap });
    }
  },

  getRoadmapProgress: () => {
    const { roadmapData } = get();
    if (!roadmapData || roadmapData.length === 0) return 0;
    const completed = roadmapData.filter(item => item.status === 'completed').length;
    return Math.round((completed / roadmapData.length) * 100);
  },

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    profile: user ? { ...initialProfile, id: user.id, fullName: user.fullName, email: user.email, targetRole: user.targetRole } : null
  }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, profile: null, hasInitialLoadDone: false });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data: profileData } = await supabase
      .from('users')
      .select('*, job_roles(name), user_skills(*, hard_skills(name), soft_skills(name)), certificates(*), experiences(*), educations(*)')
      .eq('id', user.id)
      .single();

    if (profileData) {
      const transformedSkills: UserSkill[] = (profileData.user_skills || []).map((s: any) => ({
        id: s.id,
        name: s.hard_skills?.name || s.soft_skills?.name || 'Unknown',
        score: s.score,
        type: s.hard_skills ? 'Hard' : 'Soft'
      }));

      const transformedExperience = (profileData.experiences || []).map((e: any) => ({
        ...e,
        company: e.company_name,
        role: e.role_name,
        period: e.period || `${new Date(e.start_date).getFullYear()} - ${e.is_current ? 'Present' : (e.end_date ? new Date(e.end_date).getFullYear() : 'Present')}`
      }));

      const transformedEducation = (profileData.educations || []).map((e: any) => ({
        ...e,
        period: e.period || `${new Date(e.start_date).getFullYear()} - ${e.end_date ? new Date(e.end_date).getFullYear() : 'Present'}`
      }));

      set({ 
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: profileData.full_name || '', 
          targetRole: profileData.job_roles?.name || '' 
        },
        profile: {
          ...initialProfile,
          id: profileData.id,
          email: user.email,
          fullName: profileData.full_name || '',
          targetRole: profileData.job_roles?.name || '',
          jobRoleId: profileData.job_role_id,
          location: profileData.location || '',
          summary: profileData.summary || '',
          careerGoals: profileData.career_goals || '',
          socials: {
            linkedin: profileData.socials?.linkedin || '',
            github: profileData.socials?.github || '',
            portfolio: profileData.socials?.portfolio || ''
          },
          skills: transformedSkills,
          experience: transformedExperience,
          certificates: profileData.certificates || [],
          education: transformedEducation,
          languages: profileData.languages || [],
        }
      });
    }
  },

  initializeAuth: async () => {
    const { hasInitialLoadDone } = get();
    if (!hasInitialLoadDone) {
      set({ isLoading: true });
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*, job_roles(name), user_skills(*, hard_skills(name), soft_skills(name)), certificates(*), experiences(*), educations(*)')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          const transformedSkills: UserSkill[] = (profileData.user_skills || []).map((s: any) => ({
            id: s.id,
            name: s.hard_skills?.name || s.soft_skills?.name || 'Unknown',
            score: s.score,
            type: s.hard_skills ? 'Hard' : 'Soft'
          }));

          const transformedExperience = (profileData.experiences || []).map((e: any) => ({
            ...e,
            company: e.company_name,
            role: e.role_name,
            period: e.period || `${new Date(e.start_date).getFullYear()} - ${e.is_current ? 'Present' : (e.end_date ? new Date(e.end_date).getFullYear() : 'Present')}`
          }));

          const transformedEducation = (profileData.educations || []).map((e: any) => ({
            ...e,
            period: e.period || `${new Date(e.start_date).getFullYear()} - ${e.end_date ? new Date(e.end_date).getFullYear() : 'Present'}`
          }));

          const userObj = { 
            id: session.user.id, 
            email: session.user.email || '', 
            fullName: profileData.full_name || '', 
            targetRole: profileData.job_roles?.name || '' 
          };

          set({ 
            isAuthenticated: true, 
            user: userObj,
            profile: {
              ...initialProfile,
              id: profileData.id,
              email: session.user.email || '',
              fullName: profileData.full_name || '',
              targetRole: profileData.job_roles?.name || '',
              jobRoleId: profileData.job_role_id,
              location: profileData.location || '',
              summary: profileData.summary || '',
              careerGoals: profileData.career_goals || '',
              socials: {
                linkedin: profileData.socials?.linkedin || '',
                github: profileData.socials?.github || '',
                portfolio: profileData.socials?.portfolio || ''
              },
              skills: transformedSkills,
              experience: transformedExperience,
              certificates: profileData.certificates || [],
              education: transformedEducation,
              languages: profileData.languages || [],
            }
          });
        } else {
          // No profile yet, but authenticated - initialize basic profile
          const userObj = { 
            id: session.user.id, 
            email: session.user.email || '', 
            fullName: session.user.user_metadata?.full_name || '', 
            targetRole: session.user.user_metadata?.target_role || '' 
          };
          set({ 
            isAuthenticated: true,
            user: userObj,
            profile: {
              ...initialProfile,
              id: userObj.id,
              email: userObj.email,
              fullName: userObj.fullName,
              targetRole: userObj.targetRole
            }
          });
        }
      } else {
        set({ isAuthenticated: false, user: null, profile: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isAuthenticated: false, user: null, profile: null });
    } finally {
      set({ isLoading: false, hasInitialLoadDone: true });
    }

    // Set up listener for future changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { refreshProfile, hasInitialLoadDone } = get();
        // Only show full loading if it's the first time
        if (!hasInitialLoadDone) {
          set({ isAuthenticated: true, isLoading: true });
        } else {
          set({ isAuthenticated: true });
        }
        await refreshProfile();
        set({ isLoading: false, hasInitialLoadDone: true });
      } else if (event === 'SIGNED_OUT') {
        set({ isAuthenticated: false, user: null, profile: null, isLoading: false });
      }
    });
  },

  setSelectedJobRole: (role) => set({ selectedJobRole: role }),
  setTargetCompanies: (companies) => set({ targetCompanies: companies }),
  setToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => set({ toast: null }), 4000);
    }
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      time: 'Just now'
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  runGapAnalysis: async () => {
    const { user, selectedJobRole, profile } = get();
    if (!user || !selectedJobRole || !profile) return;

    // Fetch skill demands for the role
    const { data: demands } = await supabase
      .from('skill_demand')
      .select('*')
      .eq('job_role_id', selectedJobRole.id);

    if (!demands) return;

    const analysis = demands.map(demand => {
      const userSkill = profile.skills.find(s => s.name.toLowerCase() === demand.name.toLowerCase());
      const currentScore = userSkill?.score || 0;
      const gap = demand.skill_score - currentScore;
      
      return {
        id: demand.id,
        name: demand.name,
        required: demand.skill_score,
        current: currentScore,
        gap: gap > 0 ? gap : 0,
        priority: gap > 40 ? 3 : gap > 20 ? 2 : 1, // 3: High, 2: Medium, 1: Low
        reason: `Market demand for ${demand.name} is high in ${selectedJobRole.name} roles.`
      };
    });

    // Save to Supabase in bulk
    const insertData = analysis.map(item => ({
      user_id: user.id,
      skill_demand_id: item.id,
      current_level_score: item.current,
      required_level: item.required,
      gap_score: item.gap,
      priority: item.priority,
      ai_reason: item.reason,
    }));

    const { error } = await supabase.from('career_gaps').insert(insertData);
    if (error) {
      console.error('Error saving gap analysis:', error);
    }

    set({ gapAnalysis: analysis.map(a => ({
      ...a,
      priority: a.priority === 3 ? 'High' : a.priority === 2 ? 'Medium' : 'Low'
    })) });
  },

  completeLearning: async (learningId, skillId, skillType, points) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    const userSkill = profile.skills.find(s => s.id === skillId);
    
    const previousScore = userSkill?.score || 0;
    const newScore = Math.min(100, previousScore + points);

    // Update user_skills
    if (userSkill) {
      await supabase
        .from('user_skills')
        .update({ score: newScore })
        .eq('id', userSkill.id);
    } else {
      await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          [skillType === 'Hard' ? 'hard_skill_id' : 'soft_skill_id']: skillId,
          score: newScore
        });
    }

    // Insert into history
    await supabase.from('user_skill_history').insert({
      user_id: user.id,
      [skillType === 'Hard' ? 'hard_skill_id' : 'soft_skill_id']: skillId,
      source: 'learning_completion',
      source_id: learningId,
      previous_score: previousScore,
      score_change: points,
      new_score: newScore
    });

    // Refresh profile
    const { refreshProfile } = get();
    await refreshProfile();
  },

  setIntelligenceData: (data) => set((state) => ({
    marketPulse: data.marketPulse ?? state.marketPulse,
    topSkills: data.topSkills ?? state.topSkills,
    marketTrends: data.marketTrends ?? state.marketTrends
  })),

  fetchJobRoles: async () => {
    const { jobRoles } = get();
    if (jobRoles.length > 0) return;

    const { data, error } = await supabase
      .from('job_roles')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      set({ jobRoles: data });
    }
  },

      isProfileComplete: () => {
        const { profile } = get();
        if (!profile) return false;
        
        const hasBasicInfo = !!(profile.fullName && profile.targetRole && profile.location && profile.summary);
        const hasSkills = profile.skills && profile.skills.length > 0;
        const hasExperience = profile.experience && profile.experience.length > 0;
        const hasEducation = profile.education && profile.education.length > 0;
        
        return hasBasicInfo && hasSkills && hasExperience && hasEducation;
      }
    }),
    {
      name: 'talent-graph-storage',
      partialize: (state) => ({ 
        profile: state.profile,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

