import { supabase } from '../lib/supabase';

export const rapidApiService = {
  async searchJobsWithGap(job_role: string, skills: string[], location: string) {
    try {
      const { data, error } = await supabase.functions.invoke('jobstreet-search', {
        body: { job_role, skills, location }
      });

      if (error) throw error;

      const rawData = data?.results || data?.data || data || [];
      
      const roles = rawData.map((item: any, index: number) => ({
        id: item.id || `api-${index}`,
        name: (item.title || item.jobTitle || item.role || 'Unknown Role').trim(),
        category: item.category || 'General',
        link: item.link || '#'
      }));

      return Array.from(
        new Map(roles.map((r: any) => [r.name.toLowerCase(), r])).values()
      );
    } catch (error) {
      console.error('Error calling JobStreet Edge Function:', error);
      // Fallback to local search in Supabase job_roles if Edge Function fails
      try {
        const { data: supabaseRoles } = await supabase
          .from('job_roles')
          .select('*')
          .ilike('name', `%${job_role}%`)
          .limit(5);
        
        if (supabaseRoles && supabaseRoles.length > 0) {
          return supabaseRoles.map(r => ({
            id: r.id,
            name: r.name,
            category: 'Supabase Fallback',
            link: '#'
          }));
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch failed:', fallbackErr);
      }
      return [];
    }
  },

  async getJobRoles(query?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('jobstreet-search', {
        body: { job_role: query || 'Software Engineer', skills: [], location: 'Indonesia' }
      });

      if (error) throw error;

      const rawData = data?.results || data?.data || data || [];
      
      const roles = rawData.map((item: any, index: number) => ({
        id: item.id || `api-${index}`,
        name: (item.title || item.jobTitle || item.role || 'Unknown Role').trim(),
        category: item.category || 'General'
      }));

      return Array.from(
        new Map(roles.map((r: any) => [r.name.toLowerCase(), r])).values()
      );
    } catch (error) {
      console.error('Error fetching job roles from Edge Function:', error);
      // Fallback to Supabase job_roles table
      try {
        const { data: supabaseRoles } = await supabase
          .from('job_roles')
          .select('*')
          .ilike('name', `%${query || ''}%`)
          .limit(10);
        
        if (supabaseRoles && supabaseRoles.length > 0) {
          return supabaseRoles.map(r => ({
            id: r.id,
            name: r.name,
            category: 'Supabase Fallback'
          }));
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch failed:', fallbackErr);
      }
      return [];
    }
  }
};
