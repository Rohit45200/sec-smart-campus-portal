import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  BookOpen,
  User,
  Shield,
  Award,
  Database,
  Cpu,
  Calculator,
  Bell,
  CheckCircle2,
  Calendar,
  Briefcase,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  Clock,
  FileText,
  AlertCircle,
  TrendingUp,
  MapPin,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const studentName = profile?.name || user?.name || 'Rohit Kumar';
  const rollNumber = profile?.rollNumber || user?.rollNumber || '22CSE045';
  const department = profile?.department || 'Computer Science & Engineering';

  const sampleQuestions = [
    {
      q: 'How many classes can I safely bunk in Cloud Computing?',
      agent: 'Attendance Guardian',
      tag: '75% Rule',
    },
    {
      q: 'Am I eligible for Zoho Corporation 8.5 LPA drive?',
      agent: 'Career Navigator',
      tag: 'Placement',
    },
    {
      q: 'What is the condonation rule for 65% to 74% attendance?',
      agent: 'Campus Copilot',
      tag: 'Regulation R2024',
    },
    {
      q: 'Draft an official On-Duty (OD) application for SIH Hackathon',
      agent: 'Attendance Guardian',
      tag: 'OD Permit',
    },
  ];

  const circulars = [
    {
      title: 'Zoho Corporation Campus Recruitment Drive 2026 (8.5 LPA Package)',
      category: 'Placement Drive',
      date: 'Aug 24, 2026',
      badge: 'Urgent',
    },
    {
      title: 'End-Semester Autonomous Examinations Timetable (Theory & Practical)',
      category: 'Exam Cell',
      date: 'Aug 18, 2026',
      badge: 'Academic',
    },
    {
      title: 'Smart India Hackathon 2026 - College Internal Selection Round',
      category: 'Research & Innovation',
      date: 'Aug 14, 2026',
      badge: 'Hackathon',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      {/* 1. OFFICIAL ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white text-xs py-2.5 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs">
              <Bell className="w-3 h-3" />
              Latest Circular
            </span>
            <div className="text-indigo-100 truncate text-xs font-medium">
              Zoho Campus Recruitment on Aug 24 (8.5 LPA) • End-Sem Exam Timetable Released • Strict 75% Attendance Compliance (Regulation 2024).
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-xs text-indigo-200 shrink-0">
            <span>Tiruchengode - 637205, Tamil Nadu</span>
            <span>•</span>
            <Link to="/notices" className="text-amber-300 hover:underline font-bold flex items-center gap-1">
              <span>View All Circulars</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. GRAND HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Cols: Greeting & Introduction */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-1.5 px-3 bg-white rounded-xl shadow-md border border-white/30 flex items-center justify-center">
                  <img
                    src="/images/sect-logo.png"
                    alt="Sengunthar Engineering College"
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
                    }}
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span>Autonomous Student Portal & ERP</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  Welcome to Smart Campus, {studentName} 👋
                </h1>
                <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
                  Roll No: <span className="text-white font-bold">{rollNumber}</span> • {department} • Semester 8
                </p>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                Unified institutional portal for biometric attendance tracking, university examinations, SGPA transcripts, and autonomous placement preparation powered by Gemini 3.8 Flash and Vector RAG.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/dashboard"
                  className="px-5 py-3 rounded-2xl bg-white text-indigo-950 text-xs font-black shadow-lg hover:bg-indigo-50 transition flex items-center gap-2"
                >
                  <span>Open Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
                </Link>

                <Link
                  to="/agent"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch AI Copilot</span>
                </Link>

                <Link
                  to="/tools"
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Safe-Bunk Calc</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Student Status & Live Metrics Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                    {studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{studentName}</div>
                    <div className="text-[11px] text-indigo-200">B.E. CSE • Final Year (2022-2026)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Student
                </span>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Attendance</span>
                  <div className="text-xl font-black text-emerald-300">91.8%</div>
                  <span className="text-[9px] text-emerald-400 font-semibold block">Exam Eligible</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">CGPA</span>
                  <div className="text-xl font-black text-amber-300">8.84</div>
                  <span className="text-[9px] text-amber-300 font-semibold block">Super Dream</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Backlogs</span>
                  <div className="text-xl font-black text-white">0</div>
                  <span className="text-[9px] text-slate-300 font-semibold block">All Cleared</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Faculty Mentor: Dr. M. Senthilkumar</span>
                <span className="text-emerald-400 font-bold">Day Scholar (Route #12)</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. PRIMARY CAMPUS MODULES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Campus Services & Intelligence Modules</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your academic records, attendance trackers, and AI assistant tools
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 hidden sm:inline">
            SEC Autonomous ERP v4.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AI Campus Copilot */}
          <Link
            to="/agent"
            className="bg-white rounded-3xl p-6 border-2 border-indigo-200/90 shadow-sm hover:shadow-xl hover:border-indigo-600 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider border border-indigo-200">
                  Agentic AI
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Autonomous Campus AI Copilot
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Multi-agent cognitive orchestrator with ReAct reasoning. Calculates safe-bunk lecture limits, simulates 8th sem CGPA, and drafts official OD passes.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Launch AI Workspace</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Attendance Tracking */}
          <Link
            to="/attendance"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  91.8% Overall
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Attendance Tracker & Safe-Bunk
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Period-by-period biometric logs, Anna University 75% minimum threshold monitoring, and missed classes impact simulator.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>View Attendance Log</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Academic Records */}
          <Link
            to="/academics"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  8.84 CGPA
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Academic Records & Marksheets
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Continuous internal assessments (CIA), autonomous end-semester marks, SGPA transcripts across 7 semesters, and credit audits.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Check Grade Sheets</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: RAG Vector Knowledge Base */}
          <Link
            to="/rag-explorer"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                  <Database className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                  RAG & Vectors
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Autonomous Regulations RAG Hub
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Real-time semantic vector search over SEC Regulation 2024 bylaws (attendance condonation, 10-point scale, revaluation rules).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Search Regulation Chunks</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Placement & Recruiter Matcher */}
          <Link
            to="/tools"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  Zoho 8.5 LPA
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Placement Eligibility & OD Tools
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Instant eligibility checking for Zoho, TCS Digital, and Amazon drives. Draft printable On-Duty (OD) slips with mentor details.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Open Tool Workbench</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Student Profile & Mentor Info */}
          <Link
            to="/profile"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-400 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-slate-800 group-hover:text-white transition-colors shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  Verified ID
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-slate-800 transition-colors">
                  Student Profile & Mentor Details
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Institutional registration number, assigned mentor contact, emergency guardian numbers, hostel allocation, and transport bus route.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>View Profile Details</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* 4. INTERACTIVE "ASK CAMPUS AI" PROMPT TESTBENCH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Instant Agentic AI Prompt Shortcuts</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Common Student Questions Solved Autonomously
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any prompt to launch the Multi-Agent Copilot with live ReAct tool execution:
              </p>
            </div>

            <Link
              to="/agent"
              className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Custom Chat Query</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {sampleQuestions.map((item, idx) => (
              <Link
                key={idx}
                to="/agent"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.agent}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 leading-snug">
                    "{item.q}"
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 pt-2 border-t border-slate-200/60 group-hover:translate-x-0.5 transition-transform">
                  <span>Ask Copilot</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. CAMPUS CIRCULARS & NOTICES STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Recent College Notices & Circulars</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official notifications published by Sengunthar Engineering College Examination & Placement Cell
              </p>
            </div>
            <Link to="/notices" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <span>View All Circulars</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {circulars.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50/50 hover:border-indigo-200 transition space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-indigo-600">{item.category}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px]">
                    {item.badge}
                  </span>
                  <Link to="/notices" className="text-indigo-600 font-bold hover:underline">
                    Read Notice →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
