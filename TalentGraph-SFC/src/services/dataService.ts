import { supabase } from '../lib/supabase';

export interface Job {
  id: string | number;
  role: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  type: string;
  posted: string;
  tags: string[];
  reason: string;
}

export const dataService = {
  async getJobRoles() {
    const { data } = await supabase.from('job_roles').select('*');
    return data || [];
  },

  async getJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch (error) {
      return [];
    }
  },

  async getMarketTrends() {
    try {
      const { data, error } = await supabase
        .from('job_roles')
        .select('name, demand_score')
        .order('demand_score', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(role => ({
        month: role.name, // Using name as the label for the X-axis
        demand: role.demand_score
      }));
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return [];
    }
  },

  async getMarketPulse() {
    try {
      const { data, error } = await supabase
        .from('job_roles')
        .select('name, market_pulse_score')
        .order('market_pulse_score', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return (data || []).map(role => ({
        label: role.name,
        value: `${role.market_pulse_score}%`,
        trend: role.market_pulse_score >= 80 ? 'up' : 'down' // Simple logic for trend
      }));
    } catch (error) {
      console.error('Error fetching market pulse:', error);
      return [];
    }
  },

  async getTopSkills() {
    try {
      // Fetch skills and roles separately to be more robust
      const [skillsRes, rolesRes] = await Promise.all([
        supabase.from('hard_skills').select('*'),
        supabase.from('job_roles').select('id, name')
      ]);
      
      if (skillsRes.error) throw skillsRes.error;
      const skills = skillsRes.data || [];
      const roles = rolesRes.data || [];

      if (skills.length === 0) {
        return this.getFallbackSkills();
      }

      // Create a map for quick role lookup
      const roleMap = roles.reduce((acc: any, role: any) => {
        acc[role.id] = role.name;
        return acc;
      }, {});

      // Group by job_role_id and find the skill with the highest score for each role
      const roleGroups: Record<string, any> = {};
      
      skills.forEach((skill: any) => {
        // Use job_role_id if it exists, otherwise use a default
        const roleId = skill.job_role_id || 'default';
        const roleName = roleMap[roleId] || 'Professional';
        
        if (!roleGroups[roleId] || skill.score > roleGroups[roleId].score) {
          roleGroups[roleId] = {
            id: skill.id,
            name: skill.name,
            roleName: roleName,
            score: skill.score,
            job_role_id: roleId
          };
        }
      });

      // Convert to array, sort by score descending
      const topSkillsPerRole = Object.values(roleGroups)
        .sort((a, b) => b.score - a.score);

      // Map to the format expected by the UI
      return topSkillsPerRole.slice(0, 4).map((skill, i) => ({
        name: `${skill.name} (${skill.roleName})`,
        growth: Math.floor(Math.random() * 25) + 15,
        popularity: skill.score,
        icon: this.getIconForSkill(skill.name),
        color: this.getColorForSkill(i)
      }));
    } catch (error) {
      console.error('Error fetching top skills:', error);
      return this.getFallbackSkills();
    }
  },

  getFallbackSkills() {
    return [];
  },

  getIconForSkill(name: string) {
    const n = name.toLowerCase();
    if (n.includes('cloud') || n.includes('docker') || n.includes('kubernetes')) return 'Cloud';
    if (n.includes('security') || n.includes('auth')) return 'Shield';
    if (n.includes('zap') || n.includes('ai') || n.includes('prompt')) return 'Zap';
    return 'Terminal';
  },

  getColorForSkill(index: number) {
    const colors = ['text-primary', 'text-secondary', 'text-tertiary', 'text-primary-container'];
    return colors[index % colors.length];
  },

  async getRoadmap() {
    try {
      // Add a small timeout for session check to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth Timeout')), 3000)
      );
      
      const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch (error) {
      console.error('Roadmap fetch error:', error);
      return [];
    }
  }
};

