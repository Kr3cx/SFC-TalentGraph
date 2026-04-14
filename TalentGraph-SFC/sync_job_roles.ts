
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const RAPIDAPI_KEY = 'c0c1d1b753msha737866767fe2aap15ea92jsn7d28e8588ca5';
const RAPIDAPI_HOST = 'jobstreet-live-api.p.rapidapi.com';
const SUPABASE_URL = 'https://yoghndyhdsietljvqoqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_I_ajsqepA69vm9p5AqCEAw__w-qXhir';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const queries = ['Software Engineer', 'Cybersecurity', 'Data Scientist', 'HR', 'Marketing', 'Product Manager'];

async function syncJobRoles() {
  console.log('Starting sync from RapidAPI to Supabase...');
  
  for (const query of queries) {
    console.log(`Fetching roles for: ${query}...`);
    try {
      const response = await axios.get(`https://${RAPIDAPI_HOST}/search`, {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        params: {
          q: query,
          location: 'Indonesia',
          limit: '10'
        }
      });

      const results = response.data?.results || response.data?.data || [];
      
      if (results.length === 0) {
        console.log(`No results for ${query}`);
        continue;
      }

      const transformedRoles = results.map((item: any) => ({
        name: item.title || item.jobTitle || 'Unknown Role',
        summary: item.description || item.bullet_points || 'No description provided.',
        salary: item.salary || 'Competitive',
        market_pulse_score: Math.floor(Math.random() * 5) + 5,
        demand_score: Math.floor(Math.random() * 5) + 5,
        skill_demand_id: `SKL-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      }));

      // Try inserting into job_roles
      let { error } = await supabase.from('job_roles').insert(transformedRoles);

      if (error) {
        console.warn(`Error inserting into job_roles for ${query}:`, error.message);
        console.log(`Attempting to insert into 'jobs' table instead...`);
        
        // Try inserting into jobs as a fallback
        const { error: errorJobs } = await supabase.from('jobs').insert(transformedRoles);
        
        if (errorJobs) {
          console.error(`Error inserting into 'jobs' for ${query}:`, errorJobs.message);
        } else {
          console.log(`Successfully synced ${transformedRoles.length} roles to 'jobs' table for ${query}`);
        }
      } else {
        console.log(`Successfully synced ${transformedRoles.length} roles to 'job_roles' table for ${query}`);
      }
    } catch (error) {
      console.error(`Failed to fetch/sync roles for ${query}:`, error);
    }
    
    // Small delay to avoid hitting rate limits too hard
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Sync completed!');
}

syncJobRoles();
