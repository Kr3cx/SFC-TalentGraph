import React, { useState } from 'react';
import { 
  Dna, 
  Sparkles, 
  Loader2, 
  Target, 
  Award, 
  Zap, 
  ChevronRight,
  BrainCircuit,
  Lightbulb,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';

import { useStore } from '../store/useStore';

interface DNAData {
  softDimensions: { name: string; score: number }[];
  hardDimensions: { name: string; score: number }[];
  archetype: string;
  career_paths: string[];
  strengths: string[];
  summary: string;
}

export const CareerDNA: React.FC = () => {
  const { profile } = useStore();
  const [dna, setDna] = useState<DNAData | null>(null);
  const [loading, setLoading] = useState(false);

  // Get actual skill scores from profile
  const softSkills = profile?.skills.filter(s => s.type === 'Soft') || [];
  const hardSkills = profile?.skills.filter(s => s.type === 'Hard') || [];

  const softDimensions = [
    { name: 'Communication', score: softSkills.find(s => s.name === 'Communication')?.score || 0 },
    { name: 'Problem Solving', score: softSkills.find(s => s.name === 'Problem Solving')?.score || 0 },
    { name: 'Leadership', score: softSkills.find(s => s.name === 'Leadership')?.score || 0 },
    { name: 'Critical Thinking', score: softSkills.find(s => s.name === 'Critical Thinking')?.score || 0 },
    { name: 'Adaptability', score: softSkills.find(s => s.name === 'Adaptability')?.score || 0 },
  ];

  const hardDimensions = [
    ...hardSkills.slice(0, 5).map(s => ({ name: s.name, score: s.score })),
    ...[
      { name: 'System Design', score: 0 },
      { name: 'Architecture', score: 0 },
      { name: 'Development', score: 0 },
      { name: 'Security', score: 0 },
      { name: 'Optimization', score: 0 }
    ].slice(hardSkills.length)
  ].slice(0, 5);

  async function analyze() {
    if (!profile) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this person's career DNA based on their profile and actual skill scores:

Name: ${profile.fullName}
Target Role: ${profile.targetRole}
Soft Skills: ${softDimensions.map(d => `${d.name}: ${d.score}/100`).join(", ")}
Hard Skills: ${hardDimensions.map(d => `${d.name}: ${d.score}/100`).join(", ")}
Experience: ${profile.summary}
Goals: ${profile.careerGoals}

Generate a Career DNA analysis with:
1. Career archetype (e.g., "The Innovator", "The Strategist")
2. Top 3 career paths that match their DNA
3. 3 unique strengths
4. A brief career DNA summary (2-3 sentences)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              archetype: { type: Type.STRING },
              career_paths: { type: Type.ARRAY, items: { type: Type.STRING } },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
            },
            required: ["archetype", "career_paths", "strengths", "summary"]
          },
        },
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setDna({
          ...result,
          softDimensions,
          hardDimensions
        });
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback if AI fails
      setDna({
        archetype: "The Emerging Talent",
        career_paths: ["Junior Developer", "Technical Analyst", "Product Associate"],
        strengths: ["Fast Learner", "Adaptable", "Collaborative"],
        summary: "Your career DNA shows a strong foundation in technical skills with growing potential in leadership and strategic thinking.",
        softDimensions,
        hardDimensions
      });
    } finally {
      setLoading(false);
    }
  }

  if (!dna) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10">
            <Dna className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl space-y-6"
        >
          <h2 className="text-4xl font-black tracking-tighter text-on-surface">Neural Career DNA</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Our AI engine will analyze your entire professional history, skill set, and latent potential to map your unique Career DNA.
          </p>
          
          <button 
            onClick={analyze} 
            disabled={loading}
            className="group relative px-10 py-4 bg-primary text-on-primary font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="flex items-center gap-3 relative z-10">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Decoding DNA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My DNA
                </>
              )}
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Archetype */}
      <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="relative z-10 space-y-4">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Neural Archetype</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface luminary-text-gradient">{dna.archetype}</h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {dna.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Soft Skill Radar Chart */}
        <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              Dimension Mapping: Soft Skills
            </h3>
            <button onClick={analyze} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors text-outline">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dna.softDimensions}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={false}
                  axisLine={false}
                />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#c0c1ff" 
                  fill="#c0c1ff" 
                  fillOpacity={0.3} 
                  strokeWidth={3}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hard Skill Radar Chart */}
        <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-secondary" />
              </div>
              Dimension Mapping: Hard Skills
            </h3>
            <button onClick={analyze} className="p-2 hover:bg-surface-container-high rounded-xl transition-colors text-outline">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dna.hardDimensions}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={false}
                  axisLine={false}
                />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#c0c1ff" 
                  fill="#c0c1ff" 
                  fillOpacity={0.3} 
                  strokeWidth={3}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Career Paths */}
        <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10">
          <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-secondary" />
            </div>
            Optimal Trajectories
          </h3>
          <div className="space-y-4">
            {dna.career_paths.map((path, i) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container-high border border-white/5 group hover:border-secondary/30 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary font-black">
                  {i + 1}
                </div>
                <span className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">{path}</span>
                <ChevronRight className="ml-auto w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-10">
          <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-tertiary" />
            </div>
            Core Strengths
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {dna.strengths.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                  {s}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
