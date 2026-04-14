import React, { useState, useEffect } from 'react';
import { 
  Play, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Star,
  ArrowLeft,
  Loader2,
  Award,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'course';
  difficulty: string;
  rating: number;
  duration: string;
  hard_skill_id?: string;
  soft_skill_id?: string;
  points: number;
}

export const LearningPage: React.FC<{ roadmapStepId: string; onBack: () => void }> = ({ roadmapStepId, onBack }) => {
  const { completeLearning } = useStore();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      // In a real app, we'd fetch resources linked to the roadmap step
      // For now, let's fetch some general learning content
      const { data } = await supabase
        .from('learning')
        .select('*')
        .limit(5);
      
      setResources(data || []);
      setLoading(false);
    };
    fetchResources();
  }, [roadmapStepId]);

  const handleComplete = async (resource: LearningResource) => {
    if (completedIds.includes(resource.id)) return;

    const skillId = resource.hard_skill_id || resource.soft_skill_id;
    const skillType = resource.hard_skill_id ? 'Hard' : 'Soft';
    
    if (skillId) {
      await completeLearning(resource.id, skillId, skillType, resource.points || 10);
      setCompletedIds([...completedIds, resource.id]);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">Learning Resources</h2>
      </div>

      <div className="grid gap-6">
        {resources.map((resource) => (
          <motion.div 
            key={resource.id}
            whileHover={{ y: -4 }}
            className="bg-surface-container-low border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
              resource.type === 'video' ? "bg-primary/10 text-primary" : 
              resource.type === 'article' ? "bg-secondary/10 text-secondary" : 
              "bg-tertiary/10 text-tertiary"
            )}>
              {resource.type === 'video' ? <Play className="w-8 h-8" /> : 
               resource.type === 'article' ? <FileText className="w-8 h-8" /> : 
               <Award className="w-8 h-8" />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-outline px-2 py-0.5 bg-surface-container-high rounded-full">
                  {resource.type}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-outline px-2 py-0.5 bg-surface-container-high rounded-full">
                  {resource.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{resource.title}</h3>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resource.duration}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-tertiary fill-tertiary" /> {resource.rating}</span>
                <span className="text-primary font-bold">+{resource.points || 10} XP</span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 md:flex-none px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl border border-white/5 hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
              >
                Launch <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={() => handleComplete(resource)}
                disabled={completedIds.includes(resource.id)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                  completedIds.includes(resource.id) 
                    ? "bg-secondary/20 text-secondary cursor-default" 
                    : "bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                )}
              >
                {completedIds.includes(resource.id) ? (
                  <><CheckCircle2 className="w-4 h-4" /> Completed</>
                ) : (
                  'Mark Complete'
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {celebrating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-secondary text-on-secondary px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black"
          >
            <Sparkles className="w-6 h-6 animate-bounce" />
            Skill Level Up! +10 XP earned
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
