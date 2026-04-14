import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Trophy,
  Zap,
  Target,
  Award,
  Star,
  Sparkles,
  ArrowRight,
  Rocket,
  Loader2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { dataService } from '../services/dataService';
import { LearningPage } from './Learning';

export const Roadmap: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { isEngineLaunched, roadmapData, setRoadmapData, updateRoadmapStatus, profile, gapAnalysis, isProfileComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isGapDropdownOpen, setIsGapDropdownOpen] = useState(false);

  useEffect(() => {
    if (isEngineLaunched && !roadmapData) {
      const fetchRoadmap = async () => {
        setLoading(true);
        const data = await dataService.getRoadmap();
        setRoadmapData(data);
        setLoading(false);
      };
      fetchRoadmap();
    }
  }, [isEngineLaunched, roadmapData]);

  const handleComplete = async (id: string) => {
    await updateRoadmapStatus(id, 'completed');
    
    // Auto-unlock next one if it's locked
    const currentIndex = roadmapData?.findIndex(item => item.id === id);
    if (currentIndex !== undefined && roadmapData && currentIndex < roadmapData.length - 1) {
      const nextItem = roadmapData[currentIndex + 1];
      if (nextItem.status === 'locked') {
        await updateRoadmapStatus(nextItem.id, 'current');
      }
    }
  };

  const handleStart = (id: string) => {
    setSelectedStep(id);
  };

  const isComplete = isProfileComplete();
  const allCompleted = roadmapData?.every(step => step.status === 'completed');

  if (!isEngineLaunched) {
    return (
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
          <div className="relative w-32 h-32 bg-surface-container-low rounded-[2.5rem] border border-white/5 flex items-center justify-center shadow-2xl">
            <Lock className="w-12 h-12 text-outline" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg">
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Roadmap Locked</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Your personalized career trajectory hasn't been generated yet. Launch the Career Engine to build your neural-optimized roadmap.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('one-click')}
          className="group bg-primary hover:bg-primary/90 text-on-primary font-black px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
        >
          Launch Career Engine
          <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        <div className="grid grid-cols-3 gap-6 pt-12 w-full opacity-50 grayscale">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-low rounded-2xl border border-white/5 border-dashed"></div>
          ))}
        </div>
      </div>
    );
  }

  if (loading || !roadmapData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (selectedStep) {
    return <LearningPage roadmapStepId={selectedStep} onBack={() => setSelectedStep(null)} />;
  }

  const totalXP = roadmapData.reduce((acc, item) => item.status === 'completed' ? acc + (item.points || 0) : acc, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Gap Analysis Dropdown */}
      {gapAnalysis && gapAnalysis.length > 0 && (
        <div className="bg-surface-container-low rounded-3xl border border-white/5 overflow-hidden shadow-xl shadow-primary/5">
          <button 
            onClick={() => setIsGapDropdownOpen(!isGapDropdownOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-on-surface">Neural Gap Analysis</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-outline">Insights from One Click Career Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {gapAnalysis.length} Gaps Identified
              </span>
              {isGapDropdownOpen ? <ChevronUp className="w-5 h-5 text-outline" /> : <ChevronDown className="w-5 h-5 text-outline" />}
            </div>
          </button>

          {isGapDropdownOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-6 pb-8 border-t border-white/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                {gapAnalysis.map((item, i) => (
                  <div key={i} className="bg-surface-container-high p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black uppercase tracking-widest text-outline">{item.name}</p>
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                        item.priority.toLowerCase() === 'high' ? "bg-error/20 text-error" : 
                        item.priority.toLowerCase() === 'medium' ? "bg-primary/20 text-primary" : 
                        "bg-secondary/20 text-secondary"
                      )}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-on-surface">{item.gap}%</p>
                      <p className="text-[10px] text-on-surface-variant font-bold">Gap Deficit</p>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          item.priority.toLowerCase() === 'high' ? "bg-error" : 
                          item.priority.toLowerCase() === 'medium' ? "bg-primary" : 
                          "bg-secondary"
                        )}
                        style={{ width: `${item.gap}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  These gaps were identified by analyzing your current profile against the specific requirements of your target role. Your roadmap has been optimized to prioritize these areas.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] uppercase font-black tracking-widest">Active Path</span>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-tighter">Updated 2h ago</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Neural Engineering Roadmap</h2>
          <p className="text-base md:text-lg text-on-surface-variant">Your personalized trajectory to {profile?.targetRole || 'Senior AI Architect'}</p>
        </div>
        <div className="w-full md:w-auto bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-around md:justify-start gap-6 shadow-xl shadow-primary/5">
          <div className="text-center">
            <p className="text-[10px] uppercase font-black text-outline mb-1">Total XP</p>
            <p className="text-lg md:text-xl font-black text-primary">{totalXP.toLocaleString()}</p>
          </div>
          <div className="h-10 w-[1px] bg-outline-variant/20"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-black text-outline mb-1">Rank</p>
            <p className="text-lg md:text-xl font-black text-secondary">Top 2%</p>
          </div>
        </div>
      </header>

      {/* Roadmap Timeline */}
      <div className="relative space-y-12 before:absolute before:left-[20px] md:before:left-[27px] before:top-8 before:bottom-8 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-secondary before:to-surface-container-highest">
        {roadmapData.map((step, i) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12 md:pl-20 group"
          >
            {/* Timeline Node */}
            <div className={cn(
              "absolute left-0 top-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-2xl",
              step.status === 'completed' ? "bg-primary text-on-primary shadow-primary/20" :
              step.status === 'current' ? "bg-surface border-4 border-secondary text-secondary ring-8 ring-secondary/10" :
              "bg-surface-container-highest text-outline border border-white/5"
            )}>
              {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : 
               step.status === 'current' ? <PlayCircle className="w-5 h-5 md:w-6 md:h-6 animate-pulse" /> : 
               <Lock className="w-4 h-4 md:w-5 md:h-5" />}
            </div>

            <div className={cn(
              "bg-surface-container-low rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border transition-all duration-500",
              step.status === 'current' ? "border-secondary/30 ring-1 ring-secondary/10 bg-surface-container-high" : "border-white/5 hover:border-primary/20"
            )}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-xl md:text-2xl font-bold text-on-surface">{step.title}</h3>
                    <span className="w-fit text-[10px] font-black uppercase tracking-widest text-outline bg-surface-container-highest px-2 py-1 rounded">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    {step.milestones?.map((milestone: string, j: number) => (
                      <div key={j} className="flex items-center gap-2 bg-surface-container-highest/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", step.status === 'completed' ? "bg-primary" : "bg-outline")}></div>
                        <span className="text-xs font-medium text-on-surface-variant">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end min-w-[140px]">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Reward</p>
                    <p className="text-lg font-black text-secondary">+{step.points || step.point_score} XP</p>
                  </div>
                  
                  {step.status === 'current' ? (
                    <button 
                      onClick={() => handleStart(step.id)}
                      className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-bold py-3 rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Start Learning <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : step.status === 'completed' ? (
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Award className="w-5 h-5" /> Mastery Achieved
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-outline font-bold text-sm">
                      <Lock className="w-5 h-5" /> Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificate Section */}
      {allCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-[3rem] p-12 border-2 border-secondary/30 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-secondary/40">
              <Award className="w-12 h-12 text-on-secondary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-on-surface tracking-tight">Roadmap Mastered</h2>
              <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
                Congratulations! You have successfully completed all neural-optimized learning modules for the <span className="text-secondary font-bold">{profile?.targetRole}</span> trajectory.
              </p>
            </div>
            
            <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">Certificate ID</p>
                  <p className="text-xs font-mono text-on-surface">TG-2026-X9A2-B4C1</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">Issue Date</p>
                  <p className="text-xs font-bold text-on-surface">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="py-4">
                <p className="text-sm font-black text-on-surface uppercase tracking-[0.3em]">Official Career Mastery Certificate</p>
                <p className="text-2xl font-bold text-primary mt-2">{profile?.fullName}</p>
              </div>
              <button className="w-full py-4 bg-secondary text-on-secondary font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Download Official Certificate <Rocket className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Career Milestone Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-surface-container-high to-surface-container-low rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-tertiary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-surface-container-highest rounded-3xl flex items-center justify-center shadow-2xl border border-white/5">
            <Target className="w-12 h-12 text-tertiary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">Next Career Milestone</h3>
            <p className="text-on-surface-variant mt-2 max-w-xl">You are 4,200 XP away from unlocking the <span className="text-tertiary font-bold">Principal Architect</span> track. This will increase your visibility to Tier-1 tech recruiters by 310%.</p>
          </div>
          <button className="bg-surface-container-highest hover:bg-surface-container-highest/80 text-white font-bold px-8 py-4 rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
            View Career Path <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

