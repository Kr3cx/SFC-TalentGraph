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
  const { profile } = useStore();
  
  const hardcodedRoadmap = [
    {
      id: '1',
      title: 'Advanced Neural Architectures',
      duration: '4 WEEKS',
      description: 'Master transformer optimization and attention mechanisms for large-scale models.',
      points: 1200,
      status: 'completed',
      milestones: ['Attention Mechanisms', 'Transformer Blocks', 'Model Scaling']
    },
    {
      id: '2',
      title: 'MLOps & Infrastructure',
      duration: '4 WEEKS',
      description: 'Building scalable training pipelines and deploying models with Kubernetes.',
      points: 2500,
      status: 'current',
      milestones: ['Dockerization', 'Kubernetes Clusters', 'CI/CD for ML']
    },
    {
      id: '3',
      title: 'Generative AI Strategy',
      duration: '3 WEEKS',
      description: 'Business applications and ethical considerations of generative systems.',
      points: 1800,
      status: 'locked',
      milestones: ['Ethical AI', 'Business Integration', 'Future Trends']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] uppercase font-black tracking-widest">Active Path</span>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-tighter">Updated 2h ago</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">Neural Engineering Roadmap</h2>
          <p className="text-base md:text-lg text-on-surface-variant">Your personalized trajectory to {profile?.targetRole || 'Fullstack Developer'}</p>
        </div>
        <div className="w-full md:w-auto bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-around md:justify-start gap-6 shadow-xl shadow-primary/5">
          <div className="text-center">
            <p className="text-[10px] uppercase font-black text-outline mb-1">Total XP</p>
            <p className="text-lg md:text-xl font-black text-primary">1,200</p>
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
        {hardcodedRoadmap.map((step, i) => (
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
              step.status === 'current' ? "border-secondary/30 ring-1 ring-secondary/10 bg-surface-container-high shadow-[0_0_40px_rgba(0,255,255,0.05)]" : "border-white/5 hover:border-primary/20"
            )}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-xl md:text-2xl font-bold text-on-surface">{step.title}</h3>
                    <span className="w-fit text-[8px] font-black uppercase tracking-widest text-outline bg-surface-container-highest px-2 py-1 rounded border border-white/5">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    {step.milestones?.map((milestone: string, j: number) => (
                      <div key={j} className="flex items-center gap-2 bg-surface-container-highest/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", step.status === 'completed' ? "bg-primary" : "bg-outline")}></div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end min-w-[140px]">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Reward</p>
                    <p className="text-lg font-black text-secondary">+{step.points} XP</p>
                  </div>
                  
                  {step.status === 'current' ? (
                    <button 
                      className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-black py-3 px-6 rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                      Start learning <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : step.status === 'completed' ? (
                    <div className="flex items-center gap-2 text-outline font-bold text-xs uppercase tracking-widest">
                      <Award className="w-4 h-4" /> Mastery Achieved
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-outline font-bold text-xs uppercase tracking-widest opacity-50">
                      <Lock className="w-4 h-4" /> Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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

