import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Zap, 
  Moon, 
  LogOut,
  ChevronRight,
  Sparkles,
  Key,
  Database,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

import { useStore } from '../store/useStore';

export const Settings: React.FC = () => {
  const { logout, profile, setProfile } = useStore();
  const sections = [
    {
      title: 'Neural Profile',
      icon: User,
      description: 'Manage your personal identity and career focus.',
      items: [
        { label: 'Personal Information', field: 'fullName' },
        { label: 'Location', field: 'location' },
        { label: 'Career Goals', field: 'careerGoals' }
      ]
    },
    {
      title: 'AI Intelligence',
      icon: Cpu,
      description: 'Configure how the AI analyzes your profile and market trends.',
      items: [
        { label: 'Analysis Depth', field: 'depth' },
        { label: 'Model Preferences', field: 'model' },
        { label: 'Data Sources', field: 'sources' }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Control your data visibility and account security.',
      items: [
        { label: 'Two-Factor Auth', field: '2fa' },
        { label: 'Data Export', field: 'export' },
        { label: 'Visibility Settings', field: 'visibility' }
      ]
    }
  ];

  const handleUpdate = (field: string) => {
    const newVal = prompt(`Enter new value for ${field}:`, (profile as any)[field] || '');
    if (newVal !== null) {
      setProfile({ [field]: newVal });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">System Settings</h2>
        <p className="text-base md:text-lg text-on-surface-variant">Configure your personal career strategist</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, i) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-surface-container-high rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors shrink-0">
                <section.icon className="w-5 h-5 md:w-6 md:h-6 text-outline group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-on-surface">{section.title}</h3>
                    <p className="text-on-surface-variant text-sm mt-1">{section.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-all group-hover:translate-x-1 sm:block hidden" />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {section.items.map(item => (
                    <button 
                      key={item.label} 
                      onClick={() => handleUpdate(item.field)}
                      className="px-3 md:px-4 py-2 bg-surface-container-highest/50 hover:bg-surface-container-highest rounded-xl text-[10px] md:text-xs font-bold text-on-surface-variant border border-white/5 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <img 
            src="/logo.png" 
            alt="Talent Graph Logo" 
            className="w-24 h-24 object-contain rotate-12"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/seed/talentgraph/100/100';
            }}
          />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Talent Graph Pro</h3>
            <p className="text-on-surface-variant max-w-md text-sm leading-relaxed">
              Unlock real-time market intelligence, priority AI analysis, and direct referrals to Tier-1 companies.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
              Upgrade Now
            </button>
            <p className="text-xs font-bold text-outline">Starting at $1.99/mo</p>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/5 flex items-center justify-center">
            <Database className="w-4 h-4 text-outline" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Data Usage</p>
            <p className="text-[10px] text-outline uppercase font-black">1.2 GB / 5.0 GB</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};
