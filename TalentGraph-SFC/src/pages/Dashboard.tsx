import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Briefcase, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { dataService } from '../services/dataService';
import { cn } from '../lib/utils';

const skillGapData = [
  { name: 'React', current: 85, required: 95 },
  { name: 'Node.js', current: 60, required: 90 },
  { name: 'System Design', current: 40, required: 80 },
  { name: 'Cloud', current: 30, required: 75 },
];

export const Dashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { profile, user, isProfileComplete } = useStore();
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  const isComplete = isProfileComplete();

  useEffect(() => {
    const fetchTrends = async () => {
      setLoadingTrends(true);
      const data = await dataService.getMarketTrends();
      setMarketTrends(data);
      setLoadingTrends(false);
    };
    fetchTrends();
  }, []);

  const careerScore = profile?.skills.reduce((acc, s) => acc + s.score, 0) / (profile?.skills.length || 1) || 0;
  const roundedScore = Math.round(careerScore);


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Profile Completion Warning */}
      {!isComplete && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-error/20 via-primary/10 to-error/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-surface-container-low border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-error blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-surface-container-highest border border-error/30 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-error" />
                </div>
              </div>
              <div className="space-y-2 max-w-xl">
                <h3 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">Complete Your Profile First</h3>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                  To unlock the <span className="text-primary font-bold">One-Click Career Engine</span>, you must first complete your skills and experience in the CV Builder.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('cv-builder')}
              className="w-full md:w-auto group relative px-8 md:px-10 py-4 md:py-5 bg-error text-on-error font-black rounded-2xl shadow-2xl shadow-error/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10">Go to CV Builder</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-surface-container-low/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden group shadow-2xl shadow-black/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-highest md:hidden" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" />
                <circle 
                  className="text-primary md:hidden" 
                  cx="64" cy="64" r="58" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray={364}
                  strokeDashoffset={364 * (1 - roundedScore / 100)}
                  strokeLinecap="round"
                />
                <circle className="text-surface-container-highest hidden md:block" cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" />
                <circle 
                  className="text-primary hidden md:block" 
                  cx="96" cy="96" r="88" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  strokeDasharray={553}
                  strokeDashoffset={553 * (1 - roundedScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-5xl font-black text-on-surface tracking-tighter">{roundedScore}</span>
                <span className="text-[8px] md:text-[10px] font-black text-outline uppercase tracking-[0.2em]">Score</span>
              </div>
            </div>
 
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Sparkles className="w-3 h-3" />
                AI Analysis Complete
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight leading-tight">
                You're {roundedScore}% ready for <span className="text-primary">{profile?.targetRole || 'Full Stack Developer'}</span> roles
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto md:mx-0">
                {profile?.summary || 'Your profile shows strong alignment with modern web standards. Addressing your cloud architecture gaps will push you into the top 5% of candidates.'}
              </p>
              <button 
                onClick={() => setActiveTab('one-click')}
                className={cn(
                  "w-full md:w-auto px-6 py-3 rounded-full font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2",
                  isComplete 
                    ? "bg-primary text-on-primary shadow-primary/20 hover:scale-105" 
                    : "bg-surface-container-highest text-on-surface hover:bg-primary/20"
                )}
              >
                {isComplete ? 'Launch Career Engine' : 'Check Engine Status'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-4 bg-surface-container-highest/40 backdrop-blur-xl rounded-3xl p-8 text-on-surface flex flex-col justify-between border border-white/10 shadow-xl"
        >
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-6">Market Pulse</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Profile Visibility</span>
                <span className="text-secondary font-bold">High</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[85%] rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-[10px] text-outline font-black uppercase">Inquiries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-[10px] text-outline font-black uppercase">Offers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-[10px] text-outline font-black uppercase">Rank</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-on-surface-variant italic leading-relaxed">
              "Demand for {profile?.skills?.[0]?.name || 'React'} expertise in your region has increased by 14% this month."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 bg-surface-container-low/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-tertiary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Skill Gap Analysis</h3>
            </div>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Update</button>
          </div>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#918fa1' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface-container-highest text-on-surface p-2 rounded-lg text-[10px] font-bold border border-white/10">
                          {payload[0].value}% / {payload[1].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="current" fill="#c0c1ff" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="required" fill="#2d3449" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-surface-container-low/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Market Demand</h3>
            </div>
            <div className="flex items-center gap-1 text-secondary text-[10px] font-black uppercase tracking-widest">
              +24.5% <TrendingUp className="w-3 h-3" />
            </div>
          </div>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketTrends}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4cd7f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4cd7f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#918fa1', fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171f33', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#4cd7f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorDemand)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Recommended Opportunities</h3>
          <button 
            onClick={() => setActiveTab('job-matching')}
            className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: 'Vercel', role: 'Senior Frontend Engineer', match: 98, salary: '$160k - $220k' },
            { company: 'Stripe', role: 'Full Stack Developer', match: 92, salary: '$180k - $240k' },
            { company: 'Linear', role: 'Product Engineer', match: 88, salary: '$150k - $200k' },
          ].map((job, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-surface-container-low/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
                  <Briefcase className="text-primary w-6 h-6" />
                </div>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase border border-primary/20">
                  {job.match}% Match
                </span>
              </div>
              <h4 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{job.role}</h4>
              <p className="text-on-surface-variant text-sm mb-6">{job.company}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-black text-on-surface">{job.salary}</span>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
