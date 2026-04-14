import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Sparkles, X, ArrowRight, MessageSquare, Info, AlertTriangle, Check, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface TopbarProps {
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
}

const searchItems = [
  { id: 'dashboard', label: 'Dashboard', keywords: ['home', 'overview', 'stats'] },
  { id: 'one-click', label: 'One-Click Career', keywords: ['launch', 'engine', 'transformation', 'apply'] },
  { id: 'roadmap', label: 'Roadmap', keywords: ['path', 'trajectory', 'steps', 'plan'] },
  { id: 'cv-builder', label: 'CV Builder', keywords: ['resume', 'template', 'modern', 'ats', 'creative'] },
  { id: 'job-matching', label: 'Job Matching', keywords: ['hiring', 'opportunities', 'roles'] },
  { id: 'intelligence', label: 'Market Intelligence', keywords: ['trends', 'salary', 'demand'] },
  { id: 'career-dna', label: 'Career DNA', keywords: ['personality', 'traits', 'profile'] },
  { id: 'gap-analysis', label: 'Gap Analysis', keywords: ['career gap', 'missing skills', 'improvement'] },
  { id: 'settings', label: 'Settings', keywords: ['account', 'profile', 'preferences'] },
];

const mockNotifications = [
  { id: 1, title: 'New Job Match', desc: 'Senior AI Architect at Google aligns 98% with your profile.', time: '2m ago', type: 'match' },
  { id: 2, title: 'Roadmap Update', desc: 'New certifications added to your trajectory.', time: '1h ago', type: 'update' },
  { id: 3, title: 'Market Alert', desc: 'AI Engineer salaries increased by 12% in San Francisco.', time: '3h ago', type: 'alert' },
];

const mockFAQs = [
  { q: 'How does the Career Engine work?', a: 'Our AI analyzes millions of job descriptions and matches them with your unique skill set.' },
  { q: 'Is my data secure?', a: 'Yes, we use enterprise-grade encryption to protect your professional profile.' },
  { q: 'How do I export my CV?', a: 'Go to CV Builder, select a template, and click the Download button.' },
];

import { useStore } from '../../store/useStore';

export const Topbar: React.FC<TopbarProps> = ({ setActiveTab, toggleSidebar }) => {
  const { user, toast, setToast, notifications, removeNotification } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-hide notifications badge when opened
  useEffect(() => {
    if (showNotifications) {
      // Logic to mark as read could go here
    }
  }, [showNotifications]);

  const filteredResults = searchItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 w-full bg-surface flex items-center justify-between px-4 md:px-10 shrink-0 relative z-30">
      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={cn(
              "fixed top-6 right-6 z-[100] flex items-center gap-4 p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl min-w-[280px] md:min-w-[320px] max-w-md",
              toast.type === 'error' ? "bg-error/90 text-on-error" : 
              toast.type === 'success' ? "bg-secondary/90 text-on-secondary" : 
              "bg-primary/90 text-on-primary"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : 
               toast.type === 'success' ? <Check className="w-5 h-5" /> : 
               <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-0.5">System Alert</p>
              <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 flex-1 max-w-xl relative" ref={searchRef}>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-white/5 lg:hidden transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search analytics, jobs..." 
            className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {/* Mobile Search Button */}
        <button className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-white/5 sm:hidden transition-all">
          <Search className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showSearchResults && searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full mt-2 bg-surface-container-high border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-2">
                {filteredResults.length > 0 ? (
                  filteredResults.map(result => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setActiveTab(result.id);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-surface-container-highest rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Search className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-on-surface">{result.label}</p>
                          <p className="text-[10px] text-outline uppercase tracking-widest">Navigate to Menu</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <Search className="w-8 h-8 text-outline mx-auto opacity-20" />
                    <p className="text-sm text-outline">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowHelp(false);
              }}
              className={cn(
                "p-2 rounded-xl transition-all relative",
                showNotifications ? "bg-primary/10 text-primary" : "text-outline hover:text-white hover:bg-white/5"
              )}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface animate-pulse"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-surface-container-high border border-white/5 rounded-3xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest">Notifications</h4>
                    <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">{notifications.length} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 relative group"
                          onClick={() => removeNotification(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              notif.type === 'match' ? "bg-primary/10 text-primary" :
                              notif.type === 'update' ? "bg-secondary/10 text-secondary" :
                              "bg-tertiary/10 text-tertiary"
                            )}>
                              {notif.type === 'match' ? <Sparkles className="w-4 h-4" /> :
                               notif.type === 'update' ? <ArrowRight className="w-4 h-4" /> :
                               <Info className="w-4 h-4" />}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-on-surface">{notif.title}</p>
                              <p className="text-[10px] text-outline leading-relaxed">{notif.desc}</p>
                              <p className="text-[9px] text-outline-variant font-bold">{notif.time}</p>
                            </div>
                          </div>
                          <button 
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notif.id);
                            }}
                          >
                            <X className="w-3 h-3 text-outline" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center space-y-2">
                        <Bell className="w-8 h-8 text-outline mx-auto opacity-20" />
                        <p className="text-sm text-outline">All caught up!</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors">
                    View All Activity
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowHelp(!showHelp);
                setShowNotifications(false);
              }}
              className={cn(
                "p-2 rounded-xl transition-all relative",
                showHelp ? "bg-primary/10 text-primary" : "text-outline hover:text-white hover:bg-white/5"
              )}
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showHelp && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-surface-container-high border border-white/5 rounded-3xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/5">
                    <h4 className="text-sm font-black uppercase tracking-widest">Support Center</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Frequently Asked</p>
                      {mockFAQs.map((faq, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl space-y-1">
                          <p className="text-[11px] font-bold text-on-surface">{faq.q}</p>
                          <p className="text-[10px] text-outline leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-on-primary rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                      <MessageSquare className="w-4 h-4" /> Chat with Support
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="h-8 w-[1px] bg-outline-variant/20"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold text-on-surface">{user?.fullName || 'Guest User'}</p>
            <p className="text-[10px] text-primary uppercase tracking-tighter font-bold">{user?.targetRole || 'Professional'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden p-0.5 border border-primary/20">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD47V5feHHNqQd4BuBMSV5EZcRawkmGeLYqGIG_RRt0HlU_EDcRu9jhX_OBpd4GKHmrOyKfC-Xc6uR5mi5QnpX1spNX7TsnDG2rfY9_XdEP4CRhNH9rYk5Vm5MFUfFUp1hXMkIhrHvFpw_ojVN03S0L3ogTcTbcwOrKV3jtP2aHydFgMJz1RvvgYTjZCWP48wU_2iX-hTsUJwjrb7WWD-_v5Vw6wGKeh1Y2ZJCwPt-HdTM6TTtRkskHdSiuxJQryvf7quWRwEa6Q1EL" 
              alt="User Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
