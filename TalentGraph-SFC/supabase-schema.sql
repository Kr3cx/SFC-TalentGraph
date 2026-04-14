-- Supabase SQL Schema for Career Decision Engine (Updated)

-- 0. EXTENSION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. MASTER TABLE (PARENT DULU)
-- JOB_ROLES
CREATE TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    summary TEXT,
    market_pulse_score FLOAT,
    demand_score FLOAT,
    salary_min BIGINT,
    salary_max BIGINT,
    salary_currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LEARNING
CREATE TABLE learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    url TEXT,
    type TEXT,
    difficulty TEXT,
    rating FLOAT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SKILLS
-- HARD_SKILLS
CREATE TABLE hard_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    score FLOAT,
    learning_id UUID REFERENCES learning(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOFT_SKILLS
CREATE TABLE soft_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    score FLOAT,
    learning_id UUID REFERENCES learning(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SKILL_DEMAND
CREATE TABLE skill_demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    skill_score FLOAT,
    popularity FLOAT,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USERS (FIXED DESIGN ✅)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE SET NULL,
    target_role TEXT, -- Backup text field
    location TEXT,
    summary TEXT,
    career_goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SOCIALS
CREATE TABLE socials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USER SKILLS
-- USER_SKILLS
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hard_skill_id UUID REFERENCES hard_skills(id) ON DELETE SET NULL,
    soft_skill_id UUID REFERENCES soft_skills(id) ON DELETE SET NULL,
    score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USER_SKILL_HISTORY
CREATE TABLE user_skill_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    source TEXT,
    source_id TEXT,
    previous_score FLOAT,
    score_change FLOAT,
    new_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🏆 7. CERTIFICATES
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    issuer TEXT,
    issue_date DATE,
    expiration_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    skill_demand_id UUID REFERENCES skill_demand(id),
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🏢 7.1 COMPANIES
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    size TEXT,
    logo_url TEXT,
    brand_color TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📋 7.2 COMPANY_REQUIREMENTS
CREATE TABLE company_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE CASCADE,
    hard_skills JSONB, -- Store as array of strings
    soft_skills JSONB, -- Store as array of strings
    min_experience_level TEXT,
    salary_min BIGINT,
    salary_max BIGINT,
    description TEXT,
    employment_type TEXT,
    work_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 💼 8. EXPERIENCES
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_role_id UUID REFERENCES job_roles(id),
    employment_type TEXT,
    company_name TEXT,
    is_current BOOLEAN,
    start_date DATE,
    end_date DATE,
    location_type TEXT,
    location TEXT,
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎓 9. EDUCATIONS
CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school TEXT,
    degree TEXT,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    grade TEXT,
    description TEXT,
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🗺️ 10. ROADMAPS
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    status TEXT,
    duration TEXT,
    description TEXT,
    milestones JSONB,
    point_score FLOAT,
    learning_id UUID REFERENCES learning(id),
    job_role_id UUID REFERENCES job_roles(id),
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ⚠️ 11. CAREER_GAPS
CREATE TABLE career_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_demand_id UUID REFERENCES skill_demand(id),
    current_level_score FLOAT,
    required_level FLOAT,
    gap_score FLOAT,
    priority INT,
    ai_reason TEXT,
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📊 12. CAREER_ASSESSMENTS
CREATE TABLE career_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_target TEXT,
    match_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎯 13. CAREER_TARGETS
CREATE TABLE career_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_role TEXT,
    industry TEXT,
    priority INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎯 14. CAREER_TARGET_SKILLS
CREATE TABLE career_target_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_target_id UUID REFERENCES career_targets(id) ON DELETE CASCADE,
    skill_demand_id UUID REFERENCES skill_demand(id),
    hard_skill_id UUID REFERENCES hard_skills(id),
    soft_skill_id UUID REFERENCES soft_skills(id),
    required_level FLOAT,
    current_level_score FLOAT,
    importance_weight FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skill_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_target_skills ENABLE ROW LEVEL SECURITY;

-- Create Policies (Basic Ownership)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Apply similar policies to other user-related tables
CREATE POLICY "Users can manage their own socials" ON socials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own certificates" ON certificates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experiences" ON experiences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own educations" ON educations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own roadmaps" ON roadmaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own career gaps" ON career_gaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own assessments" ON career_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own career targets" ON career_targets FOR ALL USING (auth.uid() = user_id);
