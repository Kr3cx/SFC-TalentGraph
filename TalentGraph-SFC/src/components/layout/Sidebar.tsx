import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Handshake, 
  TrendingUp, 
  Map, 
  Settings,
  Zap,
  Sparkles,
  Dna,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { 
    icon: Zap, 
    label: 'One-Click Career', 
    id: 'one-click',
    children: [
      { icon: Zap, label: 'Neural Engine', id: 'one-click' },
      { icon: Handshake, label: 'Job Matching', id: 'job-matching' },
      { icon: Map, label: 'Roadmap', id: 'roadmap' },
      { icon: Dna, label: 'Career DNA', id: 'career-dna' },
      { icon: AlertTriangle, label: 'Gap Analysis', id: 'gap-analysis' },
    ]
  },
  { icon: FileText, label: 'CV Builder', id: 'cv-builder' },
  { icon: TrendingUp, label: 'Intelligence', id: 'intelligence', highlight: true },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

import { useStore } from '../../store/useStore';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout, isProfileComplete, isEngineLaunched, setToast } = useStore();
  const [openMenus, setOpenMenus] = useState<string[]>(['one-click']);
  const isComplete = isProfileComplete();

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isLocked = (id: string) => {
    if ((id === 'roadmap' || id === 'gap-analysis' || id === 'job-matching' || id === 'career-dna') && !isEngineLaunched) return true;
    return false;
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col py-10 shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-20",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-10 mb-16">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img 
              src="/logo.png" 
              alt="Talent Graph Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/seed/talentgraph/100/100';
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-on-surface font-headline leading-none">Talent Graph</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mt-1">Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar py-4">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus.includes(item.id);
          const isActive = activeTab === item.id || item.children?.some(c => c.id === activeTab);

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.id);
                    if (item.id === 'one-click') {
                      setActiveTab(item.id);
                    }
                  } else {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-500 relative group overflow-hidden",
                  activeTab === item.id 
                    ? "text-primary bg-surface-container-high shadow-lg shadow-black/20" 
                    : "text-outline hover:text-on-surface hover:bg-surface-container-highest/50"
                )}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 top-0 w-1.5 h-full bg-primary"
                  />
                )}
                <item.icon className={cn("w-5 h-5 transition-colors duration-500", activeTab === item.id ? "text-primary" : "text-outline group-hover:text-on-surface")} />
                <span className="uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                
                {item.id === 'one-click' && !isComplete && (
                  <AlertTriangle className="w-3 h-3 text-secondary ml-2 animate-pulse" />
                )}

                {hasChildren && (
                  <div className="ml-auto">
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                )}

                {item.highlight && activeTab !== item.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-secondary shadow-lg shadow-secondary/50 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {hasChildren && isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-10 space-y-1"
                  >
                    {item.children?.map((child) => {
                      const locked = isLocked(child.id);
                      return (
                        <button
                          key={child.id}
                          onClick={() => {
                            if (locked) {
                              setToast({ 
                                message: "Neural Engine Access Required. Please complete your profile and launch the engine first.", 
                                type: 'error' 
                              });
                            } else {
                              setActiveTab(child.id);
                              if (window.innerWidth < 1024) setIsOpen(false);
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative group/child",
                            activeTab === child.id 
                              ? "text-primary bg-primary/10" 
                              : "text-outline hover:text-on-surface hover:bg-surface-container-highest/30"
                          )}
                        >
                          <child.icon className={cn("w-3 h-3", locked ? "opacity-60" : "")} />
                          <span className={cn(locked ? "opacity-60" : "")}>{child.label}</span>
                          {locked && (
                            <Lock className="w-2.5 h-2.5 ml-auto text-outline/60" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div 
          onClick={logout}
          className="bg-surface-container-high rounded-[2rem] p-6 flex items-center gap-4 border border-white/5 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface font-black shadow-inner border border-white/5 relative z-10">
            {user?.fullName.split(' ').map(n => n[0]).join('') || 'GU'}
          </div>
          <div className="overflow-hidden relative z-10">
            <p className="text-sm font-black text-on-surface truncate">{user?.fullName || 'Guest User'}</p>
            <p className="text-[10px] text-secondary uppercase tracking-widest font-black">{user?.targetRole || 'Professional'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};


