import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  Target, 
  ArrowUpRight,
  DollarSign,
  Lightbulb,
  MapPin,
  TrendingDown,
  Terminal,
  Cloud,
  Shield,
  Sparkles,
  Award,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { dataService } from '../services/dataService';

export const CareerIntelligence: React.FC = () => {
  const { 
    profile, 
    getRoadmapProgress, 
    roadmapData, 
    setRoadmapData,
    marketPulse,
    topSkills,
    marketTrends,
    setIntelligenceData,
    refreshProfile
  } = useStore();
  
  const [loading, setLoading] = useState({
    pulse: !marketPulse,
    skills: !topSkills,
    trends: !marketTrends,
    roadmap: !roadmapData,
    profile: true
  });

  const matchingPercentage = getRoadmapProgress();

  useEffect(() => {
    console.log('CareerIntelligence Profile Data:', {
      targetRole: profile?.targetRole,
      salary_min: profile?.salary_min,
      salary_max: profile?.salary_max,
      salary_avg: profile?.salary_avg,
      currency: profile?.salary_currency
    });
  }, [profile]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Refresh profile to get latest salary data from Supabase
      try {
        await refreshProfile();
        if (isMounted) setLoading(prev => ({ ...prev, profile: false }));
      } catch (err) {
        console.error('Error refreshing profile:', err);
        if (isMounted) setLoading(prev => ({ ...prev, profile: false }));
      }

      // Helper to handle individual fetch with error recovery
      const safeFetch = async (
        fetchFn: () => Promise<any>, 
        setter: (data: any) => void, 
        loadingKey: keyof typeof loading
      ) => {
        try {
          // Add a timeout to prevent indefinite hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          );
          
          const data = await Promise.race([fetchFn(), timeoutPromise]);
          
          if (isMounted) {
            setter(data);
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
          }
        } catch (error) {
          console.error(`Error fetching ${loadingKey}:`, error);
          if (isMounted) {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
          }
        }
      };

      // Fetch Market Pulse
      if (!marketPulse) {
        safeFetch(() => dataService.getMarketPulse(), (data) => setIntelligenceData({ marketPulse: data }), 'pulse');
      } else {
        setLoading(prev => ({ ...prev, pulse: false }));
      }

      // Fetch Top Skills
      if (!topSkills) {
        safeFetch(() => dataService.getTopSkills(), (data) => setIntelligenceData({ topSkills: data }), 'skills');
      } else {
        setLoading(prev => ({ ...prev, skills: false }));
      }

      // Fetch Market Trends
      if (!marketTrends) {
        safeFetch(() => dataService.getMarketTrends(), (data) => setIntelligenceData({ marketTrends: data }), 'trends');
      } else {
        setLoading(prev => ({ ...prev, trends: false }));
      }

      // Fetch Roadmap
      if (!roadmapData) {
        safeFetch(() => dataService.getRoadmap(), (data) => setRoadmapData(data), 'roadmap');
      } else {
        setLoading(prev => ({ ...prev, roadmap: false }));
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [marketPulse, topSkills, marketTrends, roadmapData, setIntelligenceData, setRoadmapData]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = { Terminal, Cloud, Zap, Shield };
    return icons[iconName] || Terminal;
  };

  const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-surface-container-highest/30 rounded-xl", className)} />
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Insight & Pulse */}
      <div className="grid grid-cols-12 gap-8">
        {/* AI Insight Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-surface-container to-surface p-8 md:p-10 group border border-white/5"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-md space-y-4">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] uppercase font-bold tracking-widest">AI Prediction</span>
              {loading.roadmap ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">You are {matchingPercentage}% ready for <span className="text-primary">{profile?.targetRole || 'Backend Developer'}</span> roles.</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Based on your current skill set and recent market shifts, you're only a few certifications away from high-tier positions.</p>
                </>
              )}
              <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                Complete Roadmap
              </button>
            </div>
            <div className="w-full md:w-auto flex items-center justify-center relative">
              {loading.roadmap ? (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-surface-container-highest animate-pulse" />
              ) : (
                <>
                  <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="12" />
                    <circle 
                      className="text-secondary drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]" 
                      cx="50%" cy="50%" r="45%" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeDasharray={440}
                      strokeDashoffset={440 * (1 - matchingPercentage / 100)}
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-4xl font-black text-white">{matchingPercentage}%</span>
                    <span className="text-[8px] md:text-[10px] uppercase text-secondary font-bold">Matching</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Market Pulse Bento */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low rounded-[2rem] p-8 border border-white/5 h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Market Pulse</h3>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            
            <div className="space-y-6 flex-grow">
              {loading.pulse ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              ) : (
                marketPulse?.map((pulse, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{pulse.label}</span>
                      <span className={cn("text-xs font-bold", pulse.trend === 'up' ? "text-secondary" : "text-error")}>
                        {pulse.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: pulse.value }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={cn("h-full rounded-full", pulse.trend === 'up' ? "bg-secondary" : "bg-error")}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Real-time demand index based on top 3 trending roles in your target industry.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Job Trends & Salary */}
      <div className="grid grid-cols-12 gap-8">
        {/* Global Job Trends Graph */}
        <div className="col-span-12 xl:col-span-9 bg-surface-container-low rounded-[2rem] p-8 border border-white/5">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-2xl font-bold">Global Job Trends</h3>
              <p className="text-on-surface-variant text-sm mt-1">Demand score comparison across job roles (Lowest to Highest)</p>
            </div>
            <div className="flex space-x-2">
              <span className="px-4 py-1.5 bg-surface-container-highest rounded-full text-xs font-medium text-primary">Monthly</span>
              <span className="px-4 py-1.5 hover:bg-surface-container-highest rounded-full text-xs font-medium transition-colors cursor-pointer">Quarterly</span>
            </div>
          </div>
          <div className="h-64">
            {loading.trends ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketTrends || []}>
                  <defs>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171f33', border: 'none', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="demand" stroke="#c0c1ff" strokeWidth={3} fillOpacity={1} fill="url(#colorAI)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-between mt-6 text-[10px] uppercase font-bold text-slate-500 px-2">
            {loading.trends ? (
              [1, 2, 3, 4, 5, 6, 7].map(i => <Skeleton key={i} className="h-3 w-10" />)
            ) : (
              marketTrends?.map((d, i) => <span key={i}>{d.month}</span>)
            )}
          </div>
        </div>

        {/* Salary Insights Card */}
        <div className="col-span-12 xl:col-span-3 space-y-4">
          <div className="bg-surface-container-high rounded-[1.5rem] p-6 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-12 h-12" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-secondary font-bold mb-4">Salary Range: {profile?.targetRole || 'Professional'}</p>
            
            {!loading.profile && (!profile?.salary_avg || profile.salary_avg === 0) && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-[10px] text-primary leading-relaxed">
                  <span className="font-bold">Note:</span> Salary data for "{profile?.targetRole || 'this role'}" is not yet available in the database.
                </p>
              </div>
            )}
            
            {loading.profile ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-10 w-3/4" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">Average Base</span>
                  <span className="text-3xl font-black text-white">
                    {profile?.salary_avg && profile.salary_avg > 0
                      ? new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: profile.salary_currency || 'USD', 
                          maximumFractionDigits: 0 
                        }).format(profile.salary_avg)
                      : '---'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase block">Low</span>
                    <span className="text-sm font-bold text-error">
                      {profile?.salary_min && profile.salary_min > 0
                        ? new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: profile.salary_currency || 'USD', 
                            maximumFractionDigits: 0 
                          }).format(profile.salary_min)
                        : '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase block">High</span>
                    <span className="text-sm font-bold text-secondary">
                      {profile?.salary_max && profile.salary_max > 0
                        ? new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: profile.salary_currency || 'USD', 
                            maximumFractionDigits: 0 
                          }).format(profile.salary_max)
                        : '---'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-surface-container-highest rounded-[1.5rem] p-6 border border-primary/10">
            <p className="text-xs font-medium text-on-surface mb-2">Remote Premium</p>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">Roles offering "Full Remote" are currently paying <span className="text-primary font-bold">15% higher</span> than hybrid equivalents.</p>
          </div>
        </div>
      </div>

      {/* Top Skills in Demand */}
      <section className="bg-surface-container-low rounded-[2.5rem] p-10 border border-white/5">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-bold">Top Skills in Demand</h3>
          <div className="flex items-center space-x-2 text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>High Demand</span>
          </div>
        </div>
        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
          {loading.skills ? (
            [1, 2, 3, 4].map(i => <Skeleton key={i} className="min-w-[280px] lg:min-w-0 h-48 rounded-[1.5rem]" />)
          ) : (
            topSkills?.map((skill, i) => {
              const Icon = getIcon(skill.icon);
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="min-w-[280px] lg:min-w-0 group bg-surface-container-high p-6 rounded-[1.5rem] transition-all hover:bg-surface-container-highest border border-white/5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-surface-container-lowest rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Icon className={cn("w-5 h-5", skill.color)} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-secondary">+{skill.growth}%</span>
                      <span className="text-[8px] text-outline uppercase font-black">Growth</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2 h-14">{skill.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest font-bold">Top Demand Skill</p>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.popularity}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={cn("h-full rounded-full", i % 2 === 0 ? "bg-secondary" : "bg-primary")}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-[9px] uppercase font-black text-slate-500">
                      <span>Popularity Score</span>
                      <span className="text-on-surface">{skill.popularity}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Dynamic Insights Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, color: 'border-primary', text: 'Transitioning from Junior to Senior is currently 40% faster in FinTech than in AdTech startups.', label: 'Growth Hack' },
          { icon: MapPin, color: 'border-secondary', text: 'Berlin and Lisbon have seen a 200% increase in remote-friendly AI engineering roles this quarter.', label: 'Geo Insight' },
          { icon: Award, color: 'border-tertiary', text: "Professionals with 'Google Cloud Professional Architect' earn 22% more on average.", label: 'Certification' },
        ].map((insight, i) => (
          <div key={i} className={cn("bg-surface-container-high rounded-2xl p-6 border-l-4", insight.color)}>
            <div className="flex items-center space-x-3 mb-3">
              <insight.icon className="w-4 h-4 text-on-surface" />
              <span className="text-xs font-black uppercase tracking-widest">{insight.label}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

