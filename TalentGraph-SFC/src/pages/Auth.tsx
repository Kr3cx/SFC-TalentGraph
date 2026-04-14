import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, ArrowRight, Rocket, ShieldCheck, Globe, Loader2, ChevronDown, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const locations = {
  '+62': [
    'Surabaya, East Java',
    'Malang, East Java',
    'Sidoarjo, East Java',
    'Gresik, East Java',
    'Pasuruan, East Java',
    'Mojokerto, East Java',
    'Probolinggo, East Java',
    'Jember, East Java',
    'Banyuwangi, East Java',
    'Kediri, East Java',
    'Madiun, East Java',
    'Blitar, East Java',
    'Batu, East Java'
  ],
  '+1': [
    'Seattle, WA',
    'Spokane, WA',
    'Tacoma, WA',
    'Vancouver, WA',
    'Bellevue, WA',
    'Kent, WA',
    'Everett, WA',
    'Renton, WA',
    'Federal Way, WA',
    'Yakima, WA'
  ]
};

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobRoles, setJobRoles] = useState<{ id: string, name: string }[]>([]);
  const { setUser } = useStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
    targetRole: '',
    countryCode: '+62'
  });

  useEffect(() => {
    const fetchJobRoles = async () => {
      const { data, error } = await supabase
        .from('job_roles')
        .select('id, name')
        .order('name');
      
      if (data) {
        setJobRoles(data);
      }
    };

    fetchJobRoles();
  }, []);

  useEffect(() => {
    // Set default location when country code changes if current location is not in the new list
    const availableLocations = locations[formData.countryCode as keyof typeof locations] || [];
    if (!availableLocations.includes(formData.location)) {
      setFormData(prev => ({ ...prev, location: availableLocations[0] || '' }));
    }
  }, [formData.countryCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) {
          if (loginError.message === 'Invalid login credentials') {
            throw new Error('Email atau password salah. Silakan coba lagi.');
          }
          if (loginError.message === 'Email not confirmed') {
            throw new Error('Email belum dikonfirmasi. Silakan cek inbox email Anda atau konfirmasi manual di dashboard Supabase.');
          }
          throw loginError;
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*, job_roles(name)')
            .eq('id', data.user.id)
            .single();

          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: profile?.full_name || '',
            targetRole: profile?.job_roles?.name || '',
          });
        }
      } else {
        if (step === 1) {
          if (formData.password.length < 6) {
            throw new Error('Password harus minimal 6 karakter.');
          }
          setStep(2);
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              target_role: formData.targetRole,
            }
          }
        });


        if (signUpError) throw signUpError;

        if (data.user) {
          // Find the job role ID for the selected target role name
          const selectedRole = jobRoles.find(r => r.name === formData.targetRole);

          // Create profile in users table
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                full_name: formData.fullName,
                job_role_id: selectedRole?.id,
                location: formData.location,
              }
            ]);

          if (profileError) throw profileError;

          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: formData.fullName,
            targetRole: formData.targetRole,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface-container-low rounded-[3rem] border border-white/5 p-10 shadow-2xl space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
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
            <h1 className="text-3xl font-black text-on-surface tracking-tighter">
              {isLogin ? 'Welcome Back' : 'Join Talent Graph'}
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              {isLogin ? 'Continue your AI-powered career journey' : 'Start your neural-optimized career trajectory'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
              >
                <p className="text-red-400 text-xs font-bold text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div 
                  key="login-fields"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key={`register-step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Phone Number</label>
                        <div className="flex gap-2">
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                              <img 
                                src={formData.countryCode === '+62' ? 'https://flagcdn.com/w20/id.png' : 'https://flagcdn.com/w20/us.png'} 
                                alt="flag"
                                className="w-4 h-3 object-cover rounded-sm"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <select 
                              value={formData.countryCode}
                              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                              className="bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-9 pr-8 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                            >
                              <option value="+62">+62</option>
                              <option value="+1">+1</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-outline pointer-events-none" />
                          </div>
                          <input 
                            type="tel" 
                            required
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              // Limit based on region
                              if (formData.countryCode === '+1' && val.length > 10) return;
                              if (formData.countryCode === '+62' && val.length > 12) return;
                              setFormData({ ...formData, phone: val });
                            }}
                            placeholder={formData.countryCode === '+62' ? '81234567890' : '5550123456'}
                            className="flex-1 bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-outline px-2 flex justify-between">
                          <span>{formData.countryCode === '+62' ? 'Indonesia: 10-12 digits' : 'USA: 10 digits'}</span>
                          <span className={cn(
                            "font-bold",
                            formData.countryCode === '+1' 
                              ? (formData.phone.length === 10 ? "text-primary" : "text-error")
                              : (formData.phone.length >= 10 && formData.phone.length <= 12 ? "text-primary" : "text-error")
                          )}>
                            {formData.phone.length} digits
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Location</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors z-10" />
                          <select 
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select Location</option>
                            {(locations[formData.countryCode as keyof typeof locations] || []).map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline px-2">Target Role</label>
                        <div className="relative group">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors z-10" />
                          <select 
                            required
                            value={formData.targetRole}
                            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                            className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select Target Role</option>
                            {jobRoles.map(role => (
                              <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              {!isLogin && step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg border border-white/5"
                >
                  Back
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-on-primary font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg",
                  isLogin || step === 1 ? "w-full" : "flex-[2]"
                )}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : (step === 1 ? 'Next Step' : 'Create Account')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setStep(1);
              }}
              className="text-sm font-bold text-outline hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-center gap-6 opacity-50 grayscale">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-outline">
            <ShieldCheck className="w-3 h-3" /> Secure
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-outline">
            <Globe className="w-3 h-3" /> Global
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-outline">
            <Rocket className="w-3 h-3" /> Fast
          </div>
        </div>
      </motion.div>
    </div>
  );
};
