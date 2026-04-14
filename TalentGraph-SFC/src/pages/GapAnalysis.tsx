import React, { useState } from 'react';
import { 
  Target, 
  AlertTriangle, 
  Loader2, 
  ChevronRight, 
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Sparkles,
  RefreshCw,
  BookOpen,
  BarChart3,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';

import { useStore } from '../store/useStore';

interface SkillComparison {
  skill: string;
  current: number;
  required: number;
  priority: 'high' | 'medium' | 'low';
}

interface GapData {
  overall_gap: number;
  skills_comparison: SkillComparison[];
  missing_skills: string[];
  learning_path: string[];
}

export const GapAnalysis: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { profile, isEngineLaunched } = useStore();
  const [data, setData] = useState<GapData | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!profile) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a career gap analysis for:

Target Role: ${profile.targetRole}
Current Skills: ${profile.skills.map(s => `${s.name} (${s.score}%)`).join(", ")}
Location: ${profile.location}

Compare their current skills against market demand for their target role.
Provide:
1. Overall gap percentage (0-100, where 0 = no gap, 100 = all skills missing)
2. 6 skills comparison: skill name, current level (0-100), required level (0-100), priority (high/medium/low)
3. Missing skills (skills they don't have but need)
4. Priority learning path: ordered list of what to learn first`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overall_gap: { type: Type.NUMBER },
              skills_comparison: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    skill: { type: Type.STRING }, 
                    current: { type: Type.NUMBER }, 
                    required: { type: Type.NUMBER }, 
                    priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] } 
                  },
                  required: ["skill", "current", "required", "priority"]
                } 
              },
              missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              learning_path: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["overall_gap", "skills_comparison", "missing_skills", "learning_path"]
          },
        },
      });

      if (response.text) {
        setData(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Gap analysis failed:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!isEngineLaunched) {
    return (
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-error/20 blur-[100px] rounded-full"></div>
          <div className="relative w-32 h-32 bg-surface-container-low rounded-[2.5rem] border border-white/5 flex items-center justify-center shadow-2xl">
            <Lock className="w-12 h-12 text-outline" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg">
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Gap Analysis Locked</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Your neural gap analysis requires an active career trajectory. Launch the Career Engine to identify your skill deficits.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('one-click')}
          className="group bg-primary hover:bg-primary/90 text-on-primary font-black px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
        >
          Launch Career Engine
          <Zap className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        <div className="grid grid-cols-3 gap-6 pt-12 w-full opacity-50 grayscale">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-low rounded-2xl border border-white/5 border-dashed"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-error/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10">
            <AlertTriangle className="w-12 h-12 text-error" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl space-y-6"
        >
          <h2 className="text-4xl font-black tracking-tighter text-on-surface">Career Gap Analysis</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Identify the critical skill deficits between your current profile and the requirements of your target role.
          </p>
          
          <button 
            onClick={analyze} 
            disabled={loading}
            className="group relative px-10 py-4 bg-surface-container-highest text-on-surface font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="flex items-center gap-3 relative z-10">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Gaps...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 text-error" />
                  Analyze Gaps
                </>
              )}
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  const getGapColor = (gap: number) => {
    if (gap <= 30) return "text-secondary";
    if (gap <= 60) return "text-primary";
    return "text-error";
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-error/20 text-error border-error/20";
      case 'medium': return "bg-primary/20 text-primary border-primary/20";
      default: return "bg-secondary/20 text-secondary border-secondary/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Overall Gap Score */}
      <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-error/5 to-transparent"></div>
        <div className="relative z-10 space-y-4">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-outline">Overall Skill Gap</p>
          <div className="flex flex-col items-center">
            <h2 className={cn("text-6xl md:text-8xl font-black tracking-tighter", getGapColor(data.overall_gap))}>
              {data.overall_gap}%
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg mt-4 font-bold">
              {data.overall_gap <= 30 ? "You're almost there!" : data.overall_gap <= 60 ? "Some gaps to fill" : "Significant gaps to address"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skills Comparison List */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              Skills Comparison
            </h3>
            <button onClick={analyze} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors text-outline">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-8">
            {data.skills_comparison.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-on-surface uppercase tracking-wider">{s.skill}</span>
                  <span className={cn("text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest", getPriorityStyles(s.priority))}>
                    {s.priority} Priority
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-outline uppercase">
                      <span>Current Level</span>
                      <span>{s.current}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.current}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="h-full bg-outline/40 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-secondary uppercase">
                      <span>Required Level</span>
                      <span>{s.required}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.required}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="h-full bg-secondary rounded-full shadow-[0_0_8px_rgba(76,215,246,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Missing Skills & Learning Path */}
        <div className="lg:col-span-5 space-y-8">
          {/* Missing Skills */}
          <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10">
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-error" />
              </div>
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.missing_skills.map((s, i) => (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-error/10 text-error border border-error/20 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10">
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              Priority Learning Path
            </h3>
            <div className="space-y-4">
              {data.learning_path.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high border border-white/5 group hover:border-primary/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-on-surface leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
