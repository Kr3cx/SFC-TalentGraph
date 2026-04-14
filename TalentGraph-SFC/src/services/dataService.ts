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
        return [
          {
            id: '1',
            role: 'Senior AI Research Engineer',
            company: 'OpenAI',
            location: 'San Francisco, CA (Hybrid)',
            salary: '$250k - $450k',
            match: 98,
            type: 'Full-time',
            posted: '2h ago',
            tags: ['PyTorch', 'LLMs', 'Distributed Systems', 'CUDA'],
            reason: 'Your expertise in transformer architectures and distributed training perfectly aligns with their core research objectives.'
          },
          {
            id: '2',
            role: 'Staff Machine Learning Engineer',
            company: 'Anthropic',
            location: 'San Francisco, CA',
            salary: '$220k - $380k',
            match: 94,
            type: 'Full-time',
            posted: '5h ago',
            tags: ['Python', 'Rust', 'JAX', 'Model Safety'],
            reason: 'Your background in AI safety and high-performance computing makes you a top candidate for their alignment team.'
          },
          {
            id: '3',
            role: 'Lead Data Scientist',
            company: 'Mistral AI',
            location: 'Paris, FR (Remote)',
            salary: '€180k - €240k',
            match: 89,
            type: 'Full-time',
            posted: '1d ago',
            tags: ['NLP', 'Open Source', 'Optimization', 'Quantization'],
            reason: 'Your contributions to open-source LLM optimization match their mission of building efficient, high-performance models.'
          }
        ];
      }
      return data;
    } catch (error) {
      return [];
    }
  },

  async getMarketTrends() {
    try {
      // In a real app, we'd fetch from a market_trends table
      // For now, returning mock data that matches the UI expectations
      return [
        { month: 'Jan', demand: 45 },
        { month: 'Feb', demand: 52 },
        { month: 'Mar', demand: 48 },
        { month: 'Apr', demand: 61 },
        { month: 'May', demand: 55 },
        { month: 'Jun', demand: 67 },
        { month: 'Jul', demand: 72 },
      ];
    } catch (error) {
      return [];
    }
  },

  async getMarketPulse() {
    return [
      { label: 'Generative AI', value: '+12.4%', trend: 'up' },
      { label: 'Web3 / Blockchain', value: '-4.1%', trend: 'down' },
      { label: 'Data Engineering', value: '+8.2%', trend: 'up' },
    ];
  },

  async getTopSkills() {
    return [
      { name: 'Go / Golang', growth: 28, popularity: 85, icon: 'Terminal', color: 'text-primary' },
      { name: 'AWS / Cloud', growth: 15, popularity: 72, icon: 'Cloud', color: 'text-tertiary' },
      { name: 'Prompt Eng.', growth: 42, popularity: 94, icon: 'Zap', color: 'text-primary' },
      { name: 'Cybersecurity', growth: 12, popularity: 65, icon: 'Shield', color: 'text-secondary' },
    ];
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
        // Fallback mock data if none exists in DB
        return [
          {
            id: '1',
            title: 'Advanced Neural Architectures',
            status: 'completed',
            duration: '4 weeks',
            description: 'Master transformer optimization and attention mechanisms for large-scale models.',
            milestones: ['Attention Mechanisms', 'Transformer Blocks', 'Model Scaling'],
            points: 1200
          },
          {
            id: '2',
            title: 'MLOps & Infrastructure',
            status: 'current',
            duration: '6 weeks',
            description: 'Building scalable training pipelines and deploying models with Kubernetes.',
            milestones: ['Dockerization', 'Kubernetes Clusters', 'CI/CD for ML'],
            points: 2500
          },
          {
            id: '3',
            title: 'Generative AI Strategy',
            status: 'locked',
            duration: '3 weeks',
            description: 'Business applications and ethical considerations of generative systems.',
            milestones: ['Ethical AI', 'Business Integration', 'Future Trends'],
            points: 1800
          }
        ];
      }
      return data;
    } catch (error) {
      console.error('Roadmap fetch error:', error);
      return [];
    }
  }
};

