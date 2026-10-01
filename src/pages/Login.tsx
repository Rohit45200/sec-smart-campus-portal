import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ShieldCheck, UserCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [email, setEmail] = useState('rohit.22cse@sengunthar.ac.in');
  const [password, setPassword] = useState('sec2026pass');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to appropriate portal
  React.useEffect(() => {
    if (user) {
      if (user.role === 'faculty') navigate('/faculty', { replace: true });
      else if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Where to redirect after login (default /dashboard)
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password, role);
      if (from && from !== '/' && from !== '/dashboard') {
        navigate(from, { replace: true });
      } else {
        if (role === 'faculty') {
          navigate('/faculty', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials or connection error. Try demo login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (selectedRole: 'student' | 'faculty' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('karthik.22cse@sengunthar.ac.in');
      setPassword('student2026');
    } else if (selectedRole === 'faculty') {
      setEmail('senthilkumar.cse@sengunthar.ac.in');
      setPassword('faculty2026');
    } else {
      setEmail('admin.erp@sengunthar.ac.in');
      setPassword('admin2026');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 mb-1">
            <img
              src="/images/sect-logo.png"
              alt="Sengunthar Engineering College"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Smart Campus Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sengunthar Engineering College (Autonomous) • ERP & Agentic AI Sign In
            </p>
          </div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 space-y-6"
        >
          
          {/* Role Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select User Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('student')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('faculty')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  role === 'faculty'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  role === 'admin'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Alert Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Institutional Email Address / Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. karthik.22cse@sengunthar.ac.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 font-medium">Keep me authenticated</span>
              </label>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-semibold text-center mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Test Accounts (Resume Showcase)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  login('rohit.22cse@sengunthar.ac.in', 'sec2026pass', 'student').then(() => navigate('/dashboard'));
                }}
                className="px-2.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-xl text-[11px] font-bold hover:bg-indigo-100 transition-colors text-left flex flex-col"
              >
                <span className="font-extrabold">Rohit Kumar</span>
                <span className="text-[10px] text-indigo-500 font-normal">CSE 4th Yr • 8.84 CGPA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('karthik.22cse@sengunthar.ac.in', 'sec2026pass', 'student').then(() => navigate('/dashboard'));
                }}
                className="px-2.5 py-2 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-[11px] font-bold hover:bg-slate-100 transition-colors text-left flex flex-col"
              >
                <span className="font-extrabold">Karthik S</span>
                <span className="text-[10px] text-slate-500 font-normal">CSE 4th Yr • 8.92 CGPA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('pooja.23ai@sengunthar.ac.in', 'sec2026pass', 'student').then(() => navigate('/dashboard'));
                }}
                className="px-2.5 py-2 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-[11px] font-bold hover:bg-rose-100 transition-colors text-left flex flex-col"
              >
                <span className="font-extrabold">Pooja R</span>
                <span className="text-[10px] text-rose-500 font-normal">AI&DS • 74.2% (Alert Test)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('senthilkumar.cse@sengunthar.ac.in', 'sec2026pass', 'faculty').then(() => navigate('/faculty'));
                }}
                className="px-2.5 py-2 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-xl text-[11px] font-bold hover:bg-purple-100 transition-colors text-left flex flex-col"
              >
                <span className="font-extrabold">Dr. M. Senthilkumar</span>
                <span className="text-[10px] text-purple-500 font-normal">Faculty • HOD CSE</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px] text-slate-500 font-medium">
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">React 19</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">TypeScript</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">Node.js Express</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">MongoDB Engine</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-md">Agentic AI Core</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-md">Vector RAG</span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded-md">ReAct Framework</span>
            </div>
          </div>

        </motion.div>

        {/* Security Notice Footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured by SEC Center for Information Technology (CIT)</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
