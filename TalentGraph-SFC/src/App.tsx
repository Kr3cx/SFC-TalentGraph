import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './pages/Dashboard';
import { CVBuilder } from './pages/CVBuilder';
import { JobMatching } from './pages/JobMatching';
import { CareerIntelligence } from './pages/CareerIntelligence';
import { Roadmap } from './pages/Roadmap';
import { OneClickCareer } from './pages/OneClickCareer';
import { Settings } from './pages/Settings';
import { CareerDNA } from './pages/CareerDNA';
import { GapAnalysis } from './pages/GapAnalysis';
import { Auth } from './pages/Auth';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { useStore } from './store/useStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading, initializeAuth } = useStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'cv-builder': return <CVBuilder />;
      case 'job-matching': return <JobMatching />;
      case 'intelligence': return <CareerIntelligence />;
      case 'roadmap': return <Roadmap setActiveTab={setActiveTab} />;
      case 'career-dna': return <CareerDNA />;
      case 'gap-analysis': return <GapAnalysis setActiveTab={setActiveTab} />;
      case 'one-click': return <OneClickCareer setActiveTab={setActiveTab} />;
      case 'settings': return <Settings />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="h-screen w-full bg-surface text-on-surface font-sans selection:bg-primary/30 selection:text-primary flex overflow-hidden relative">
      {/* Background Decorative Elements for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[25%] h-[25%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative bg-surface">
        <Topbar setActiveTab={setActiveTab} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 bg-surface-container-low/60 backdrop-blur-3xl lg:rounded-tl-[3.5rem] border-t border-l border-white/5 relative z-10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
