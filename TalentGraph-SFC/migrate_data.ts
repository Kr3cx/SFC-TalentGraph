import { createClient } from '@supabase/supabase-js';

const OLD_URL = 'https://yoghndyhdsietljvqoqt.supabase.co';
const OLD_KEY = 'sb_publishable_I_ajsqepA69vm9p5AqCEAw__w-qXhir';

const NEW_URL = 'https://gbbeguojswhjhqvcvaxo.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiYmVndW9qc3doamhxdmN2YXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODc1MDksImV4cCI6MjA5MTU2MzUwOX0.RK5r6OIxHYLfL9KOuCHCLeUajhzFyTFnizLjSNqoDPI';

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

const tables = [
  'job_roles',
  'hard_skills',
  'soft_skills',
  'skill_demand',
  'learning'
];

async function migrate() {
  console.log('Starting migration...');

  for (const table of tables) {
    console.log(`Migrating table: ${table}`);
    
    // Fetch from old
    const { data, error: fetchError } = await oldSupabase.from(table).select('*');
    
    if (fetchError) {
      console.error(`Error fetching from ${table}:`, fetchError.message);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`No data found in ${table}`);
      continue;
    }

    console.log(`Found ${data.length} records in ${table}. Inserting into new project...`);

    // Insert into new
    // We use upsert to avoid duplicates if run multiple times
    const { error: insertError } = await newSupabase.from(table).upsert(data);

    if (insertError) {
      console.error(`Error inserting into ${table}:`, insertError.message);
    } else {
      console.log(`Successfully migrated ${table}`);
    }
  }

  console.log('Migration finished.');
}

migrate().catch(console.error);
