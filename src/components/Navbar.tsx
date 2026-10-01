import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  Bell,
  BookOpen,
  Home as HomeIcon,
  ChevronRight,
  Sparkles,
  Database,
  Cpu,
  RefreshCw,
  Users,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  FileText,
  Briefcase,
  ShieldCheck,
  ExternalLink,
  Clock,
  Receipt,
  FileCheck,
  ArrowUp,
  ArrowDown,
  Search,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'erp' | 'exams' | 'tools' | 'staff'>('all');
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const navMenuRef = useRef<HTMLDivElement>(null);
  const demoSwitchRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const userRole = user?.role || 'student';

  const campusModules: {
    name: string;
    path: string;
    icon: any;
    desc: string;
    color: string;
    tag: string;
    category: 'erp' | 'exams' | 'tools' | 'staff';
    highlight?: boolean;
    roles?: ('student' | 'faculty' | 'admin')[];
  }[] = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      desc: 'Official SEC Gateway & Welcome',
      color: 'from-blue-600 to-indigo-600',
      tag: 'Main',
      category: 'erp',
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      desc: 'Student Overview & Live Status',
      color: 'from-indigo-600 to-blue-700',
      tag: 'ERP',
      category: 'erp',
      roles: ['student', 'admin'],
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: Calendar,
      desc: 'Biometric Logs & 75% Compliance',
      color: 'from-emerald-600 to-teal-700',
      tag: '91.8%',
      category: 'erp',
      roles: ['student', 'admin'],
    },
    {
      name: 'Academics',
      path: '/academics',
      icon: BookOpen,
      desc: 'End-Sem Results & SGPA Transcripts',
      color: 'from-sky-600 to-blue-700',
      tag: '8.84 CGPA',
      category: 'exams',
      roles: ['student', 'admin'],
    },
    {
      name: 'Notices & Circulars',
      path: '/notices',
      icon: Bell,
      desc: 'Exam Cell & Placement Alerts',
      color: 'from-amber-600 to-orange-700',
      tag: 'Circulars',
      category: 'erp',
    },
    {
      name: 'Campus Tools',
      path: '/tools',
      icon: Cpu,
      desc: 'Safe-Bunk Calc, CGPA What-If & OD Pass',
      color: 'from-violet-600 to-indigo-700',
      tag: 'Tools Lab',
      category: 'tools',
    },
    {
      name: 'RAG Knowledge Hub',
      path: '/rag-explorer',
      icon: Database,
      desc: 'Autonomous Regulations 2024 Vectors',
      color: 'from-purple-600 to-pink-700',
      tag: 'Vector DB',
      category: 'tools',
    },
    {
      name: 'AI Campus Copilot',
      path: '/agent',
      icon: Sparkles,
      desc: 'Multi-Agent Autonomous Advisor (ReAct)',
      color: 'from-fuchsia-600 to-purple-800',
      tag: 'Agentic AI',
      highlight: true,
      category: 'tools',
    },
    {
      name: 'Timetable',
      path: '/timetable',
      icon: Clock,
      desc: 'Weekly Class Routine & Lab Schedule',
      color: 'from-cyan-600 to-blue-700',
      tag: 'Schedule',
      category: 'erp',
      roles: ['student', 'admin'],
    },
    {
      name: 'Fees & Receipts',
      path: '/fees',
      icon: Receipt,
      desc: 'Tuition Fees, Dues & E-Receipts',
      color: 'from-emerald-700 to-teal-800',
      tag: 'No Dues',
      category: 'exams',
      roles: ['student', 'admin'],
    },
    {
      name: 'Exam Hall Ticket',
      path: '/hall-ticket',
      icon: FileCheck,
      desc: 'Autonomous End-Sem Admit Card',
      color: 'from-amber-600 to-yellow-700',
      tag: 'COE Card',
      category: 'exams',
      roles: ['student', 'admin'],
    },
    {
      name: 'Faculty & HOD',
      path: '/faculty',
      icon: ShieldCheck,
      desc: 'OD Approvals & Attendance Marker',
      color: 'from-rose-600 to-red-800',
      tag: 'HOD Portal',
      category: 'staff',
      roles: ['faculty', 'admin'],
    },
    {
      name: 'Admin ERP Portal',
      path: '/admin',
      icon: Briefcase,
      desc: 'System Configuration & Student Management',
      color: 'from-slate-800 to-indigo-950',
      tag: 'Admin',
      category: 'staff',
      roles: ['admin'],
    },
    {
      name: 'Student Profile',
      path: '/profile',
      icon: User,
      desc: 'Credentials, Guardian & Mentor Info',
      color: 'from-slate-700 to-slate-900',
      tag: 'Profile',
      category: 'erp',
      roles: ['student', 'admin'],
    },
  ];

  // Filter modules strictly based on authenticated role
  const roleAllowedModules = campusModules.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  const filteredModules = roleAllowedModules.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setCanScrollUp(scrollTop > 15);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 15);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (navMenuOpen) {
      setTimeout(checkScrollState, 150);
    }
  }, [navMenuOpen, searchQuery, selectedCategory]);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setNavMenuOpen(false);
      }
      if (demoSwitchRef.current && !demoSwitchRef.current.contains(e.target as Node)) {
        setDemoSwitchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavMenuOpen(false);
        setDemoSwitchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNavMenuOpen(false);
  };

  const switchAccount = async (email: string, role: 'student' | 'faculty' | 'admin' = 'student') => {
    await login(email, 'sec2026pass', role);
    setDemoSwitchOpen(false);
    setNavMenuOpen(false);
    setSelectedCategory('all');
    if (role === 'faculty') {
      navigate('/faculty');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-xs">
      
      {/* Top Official Strip */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">Sengunthar Engineering College (Autonomous)</span>
            <span>•</span>
            <span className="text-slate-400">Approved by AICTE & Affiliated to Anna University</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">NAAC 'A' Grade</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Autonomous Student Portal & Agentic AI</span>
            <span>•</span>
            <a
              href="https://sect.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-white transition font-medium flex items-center gap-1"
            >
              <span>sect.edu.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: SEC Official College Logo & Title */}
          <Link to="/" className="flex items-center gap-3.5 shrink-0 group py-1">
            <img
              src="/images/sect-logo.png"
              alt="Sengunthar Engineering College Logo"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-102 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
              }}
            />
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
              <span className="font-black text-slate-900 tracking-tight text-sm uppercase">
                Smart Campus Portal
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Autonomous ERP & AI System
              </span>
            </div>
          </Link>

          {/* Center: THE MAIN "CAMPUS MENU" ICON BUTTON THAT HOLDS ALL OPTIONS */}
          <div className="relative" ref={navMenuRef}>
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                navMenuOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                  : 'bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border-slate-200/80 shadow-xs'
              }`}
              aria-label="Open Campus Menu"
              aria-expanded={navMenuOpen}
            >
              <LayoutGrid className={`w-4 h-4 ${navMenuOpen ? 'text-white' : 'text-indigo-600'}`} />
              <span className="text-xs uppercase tracking-wider">Campus Menu</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  navMenuOpen ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
              />
            </button>

            {/* THE POPUP MEGA MENU SHOWCASING ALL CAMPUS MODULES */}
            <AnimatePresence>
              {navMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-3 w-[94vw] sm:w-[620px] lg:w-[740px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 z-50 flex flex-col overflow-hidden"
                >
                  {/* Mega Menu Sticky Header */}
                  <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Sengunthar Engineering College Portals
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {filteredModules.length} Modules Available • Use Up/Down buttons or scrollbar
                          </div>
                        </div>
                      </div>

                      {/* Header Up/Down Scroll Controls + Close */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={scrollToTop}
                          disabled={!canScrollUp}
                          title="Scroll to Top (Up)"
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition ${
                            canScrollUp
                              ? 'bg-slate-100 hover:bg-indigo-50 text-indigo-700 border-slate-300 shadow-xs'
                              : 'text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[10px]">Up</span>
                        </button>

                        <button
                          type="button"
                          onClick={scrollToBottom}
                          disabled={!canScrollDown}
                          title="Scroll to Bottom (Down)"
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition ${
                            canScrollDown
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-xs'
                              : 'text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[10px]">Down</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNavMenuOpen(false)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition ml-1"
                          title="Close Menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Search & Category Filter Pills */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search module (Fees, Hall Ticket, Faculty, Admin, Tools)..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none shrink-0 text-[10px] font-bold">
                        {[
                          { id: 'all' as const, label: `All (${roleAllowedModules.length})` },
                          ...(userRole === 'student' || userRole === 'admin'
                            ? [
                                { id: 'erp' as const, label: 'Student ERP' },
                                { id: 'exams' as const, label: 'Exams & Fees' },
                              ]
                            : []),
                          { id: 'tools' as const, label: 'AI & Tools' },
                          ...(userRole === 'faculty' || userRole === 'admin'
                            ? [{ id: 'staff' as const, label: userRole === 'admin' ? 'Staff & Admin' : 'Faculty & HOD' }]
                            : []),
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedCategory(tab.id as any)}
                            className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                              selectedCategory === tab.id
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Modules Grid with VISIBLE SCROLLBAR */}
                  <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollState}
                    className="flex-1 overflow-y-auto pr-1.5 py-2 space-y-3 custom-scrollbar"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredModules.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setNavMenuOpen(false)}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between group ${
                              active
                                ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                                : item.highlight
                                ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 hover:border-indigo-400 hover:shadow-md'
                                : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-md'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                    active
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-white text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {item.tag}
                                </span>
                              </div>

                              <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors pt-1">
                                {item.name}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-tight">
                                {item.desc}
                              </p>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                              <span>Open</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Scroll to bottom prompt banner if there are lower modules */}
                    {canScrollDown && filteredModules.length > 6 && (
                      <div
                        onClick={scrollToBottom}
                        className="cursor-pointer bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl p-2.5 text-center text-xs font-bold text-indigo-700 flex items-center justify-center gap-2 transition shadow-xs group"
                      >
                        <span>Scroll down (↓) to see more modules: Faculty, Admin & Profile</span>
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    )}
                  </div>

                  {/* Mega Menu Sticky Footer Strip */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
                    <div className="flex items-center gap-2">
                      <span>Logged in: <strong className="text-slate-800">{user?.name || 'Rohit Kumar'}</strong></span>
                      <span>•</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">{filteredModules.length} of 14</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={scrollToTop}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-indigo-50 transition"
                      >
                        <ArrowUp className="w-3 h-3" />
                        <span>Top</span>
                      </button>

                      <button
                        type="button"
                        onClick={scrollToBottom}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-indigo-50 transition"
                      >
                        <ArrowDown className="w-3 h-3" />
                        <span>Bottom</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: AI Copilot CTA + Profile & Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Standout AI Copilot Direct Button */}
            <Link
              to="/agent"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:brightness-110 text-white text-xs font-black shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Copilot</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-white text-[9px] font-black uppercase">
                New
              </span>
            </Link>

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative" ref={demoSwitchRef}>
              <button
                onClick={() => setDemoSwitchOpen(!demoSwitchOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                title="Switch test student profile"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Switch</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {demoSwitchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 space-y-1"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Select Demo Profile for Testing
                    </div>

                    <button
                      onClick={() => switchAccount('rohit.22cse@sengunthar.ac.in', 'student')}
                      className="w-full p-2.5 rounded-xl hover:bg-indigo-50 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        R
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Rohit Kumar</div>
                        <div className="text-[10px] text-indigo-600 font-semibold">CSE 4th Yr • 8.84 CGPA • 91.8%</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchAccount('karthik.22cse@sengunthar.ac.in', 'student')}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        K
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Karthik S</div>
                        <div className="text-[10px] text-slate-500 font-medium">CSE 4th Yr • 8.92 CGPA</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchAccount('pooja.23ai@sengunthar.ac.in', 'student')}
                      className="w-full p-2.5 rounded-xl hover:bg-rose-50 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                        P
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Pooja R</div>
                        <div className="text-[10px] text-rose-600 font-semibold">AI&DS • 74.2% Attendance (Alert Test)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchAccount('senthilkumar.cse@sengunthar.ac.in', 'faculty')}
                      className="w-full p-2.5 rounded-xl hover:bg-purple-50 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                        S
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Dr. M. Senthilkumar</div>
                        <div className="text-[10px] text-purple-600 font-semibold">Faculty • HOD CSE & Mentor</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchAccount('admin.erp@sengunthar.ac.in', 'admin')}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-100 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Er. K. Duraisamy</div>
                        <div className="text-[10px] text-slate-600 font-semibold">Central ERP Administrator</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Pill or Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center overflow-hidden border border-indigo-200">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {user.rollNumber || 'Student'}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens < 640px) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition ${
              location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            to={userRole === 'faculty' ? '/faculty' : userRole === 'admin' ? '/admin' : '/dashboard'}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition ${
              isActive(userRole === 'faculty' ? '/faculty' : userRole === 'admin' ? '/admin' : '/dashboard')
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>{userRole === 'faculty' ? 'Faculty' : userRole === 'admin' ? 'Admin' : 'Portal'}</span>
          </Link>

          <Link
            to="/agent"
            className="flex flex-col items-center gap-0.5 -mt-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-active:scale-95 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold text-indigo-700">Copilot</span>
          </Link>

          {userRole === 'student' ? (
            <Link
              to="/attendance"
              className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition ${
                isActive('/attendance') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Attend</span>
            </Link>
          ) : (
            <Link
              to="/notices"
              className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition ${
                isActive('/notices') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notices</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition ${
              navMenuOpen ? 'text-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>

    </header>
  );
};

export default Navbar;
