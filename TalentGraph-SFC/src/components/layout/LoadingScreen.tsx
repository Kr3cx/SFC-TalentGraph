import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-surface z-[9999] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-surface-container-low border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <img 
              src="/logo.png" 
              alt="Talent Graph" 
              className="w-16 h-16 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/seed/talentgraph/100/100';
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-4">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-on-surface tracking-tighter"
          >
            Initializing Neural Engine
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.4, duration: 1.5 }}
            className="h-1 bg-surface-container-highest rounded-full overflow-hidden mx-auto"
          >
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/2 h-full bg-primary"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-outline"
          >
            Optimizing your career trajectory
          </motion.p>
        </div>

        <div className="flex items-center gap-3 text-on-surface-variant/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-medium">Connecting to Supabase...</span>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};
