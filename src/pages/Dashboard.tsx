import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  ClipboardCheck,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Award,
  Sparkles,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { noticeService } from '../services/noticeService';
import { academicService } from '../services/academicService';
import { AttendanceSubject, Notice, SemesterRecord } from '../types';
import FacultyPortal from './FacultyPortal';
import AdminPortal from './AdminPortal';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();

  // If logged in as Faculty, automatically show Faculty Management Portal
  if (user?.role === 'faculty') {
    return <FacultyPortal />;
  }

  // If logged in as Admin, automatically show Central ERP Administrator Portal
  if (user?.role === 'admin') {
    return <AdminPortal />;
  }

  const [attendanceData, setAttendanceData] = useState<{
    subjects: AttendanceSubject[];
    overallPercentage: number;
  }>({ subjects: [], overallPercentage: 92.5 });

  const [notices, setNotices] = useState<Notice[]>([]);
  const [recentAcademic, setRecentAcademic] = useState<SemesterRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attRes, notRes, acadRes] = await Promise.all([
          attendanceService.getAttendance(),
          noticeService.getNotices(),
          academicService.getAcademicRecords()
        ]);
        setAttendanceData(attRes);
        setNotices(notRes);
        if (acadRes.records && acadRes.records.length > 0) {
          setRecentAcademic(acadRes.records[0]);
        }
      } catch {
        // Handled via defaults
      } finally {
        setLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  const studentName = profile?.name || user?.name || 'Karthik S';
  const rollNumber = profile?.rollNumber || user?.rollNumber || '22CSE104';
  const department = profile?.department || user?.department || 'Computer Science & Engineering';
  const semester = profile?.semester || user?.semester || 8;
  const overallAttendance = attendanceData.overallPercentage || 92.5;

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1.5 bg-white rounded-xl shadow-md border border-white/40 flex items-center justify-center">
                  <img
                    src="/images/sect-logo.png"
                    alt="Sengunthar Engineering College"
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
                    }}
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Autonomous ERP & AI Copilot</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {studentName} 👋
                </h1>
                <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
                  Roll No: <span className="font-bold text-white">{rollNumber}</span> • {department} • Semester {semester}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/hall-ticket"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-all"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Hall Ticket</span>
              </Link>
              <Link
                to="/timetable"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <span>Timetable</span>
              </Link>
              <Link
                to="/fees"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <span>Fee Slip</span>
              </Link>
              <Link
                to="/academics"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow-md hover:bg-indigo-50 transition-all"
              >
                <span>Gradesheet</span>
              </Link>
            </div>
          </div>
        </motion.div>


        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric 1: Attendance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                <span className="text-emerald-600">{overallAttendance}%</span>
                <span className="text-xs text-slate-500 font-medium">Overall</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Eligible for University Exams</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/attendance" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/tools" className="text-[11px] font-bold text-emerald-700 hover:underline">
                Safe-Bunk Calc →
              </Link>
            </div>
          </div>

          {/* Metric 2: Profile Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Status</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Verified</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs text-slate-500 font-medium pt-1">
                Reg No: <span className="font-bold text-slate-700">{profile?.registerNumber || '732922104045'}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/profile" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between">
                <span>Edit Profile Info</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Metric 3: Semester */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {profile?.cgpa || 8.84} <span className="text-xs font-bold text-purple-700">CGPA</span>
              </div>
              <div className="text-xs text-purple-700 font-semibold pt-1">
                Super Dream & Tier 1 Qualified
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/academics" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>Gradesheet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/tools" className="text-[11px] font-bold text-purple-700 hover:underline">
                Simulate CGPA →
              </Link>
            </div>
          </div>

          {/* Metric 4: Latest Notice */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Notice</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 line-clamp-2">
                {notices.length > 0 ? notices[0].title : 'Zoho Campus Drive 2026 - 8.5 LPA Package'}
              </div>
              <div className="text-[11px] text-amber-600 font-medium pt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Urgent Circular</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link to="/notices" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between">
                <span>Read Circulars</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* AI Copilot & Vector RAG Showcase Banner */}
        <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-lg border border-indigo-900/50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Autonomous Multi-Agent Copilot Active</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Ask SEC Smart Campus AI Advisor
              </h2>
              <p className="text-slate-300 text-xs max-w-xl">
                Powered by Gemini 3.8 Flash tool calling, ReAct multi-step reasoning, and Vector RAG grounding over Autonomous Regulations 2024.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/agent"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition flex items-center gap-1.5"
              >
                <span>Open Agent Studio</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/rag-explorer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
              >
                <span>Vector Explorer</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-indigo-900/60">
            <Link
              to="/agent"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/10 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">
                  Safe-Bunk Formula
                </div>
                <div className="text-[10px] text-slate-400">Can I miss Cloud Computing Friday?</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </Link>

            <Link
              to="/tools"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/10 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">
                  CGPA What-If
                </div>
                <div className="text-[10px] text-slate-400">Simulate 8th Sem SGPA</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </Link>

            <Link
              to="/tools"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/10 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">
                  Zoho Eligibility
                </div>
                <div className="text-[10px] text-slate-400">8.5 LPA Criteria & Backlog rule</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </Link>

            <Link
              to="/tools"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/10 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-300">
                  Formal OD Generator
                </div>
                <div className="text-[10px] text-slate-400">Hackathon On-Duty permission</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </Link>
          </div>
        </div>


        {/* Navigation Shortcut Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Campus Services Navigation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              to="/profile"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Student Profile</div>
                  <div className="text-xs text-slate-500">Credentials & Mentor</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </Link>

            <Link
              to="/attendance"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Attendance Logs</div>
                  <div className="text-xs text-slate-500">Subject-wise % & Stats</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              to="/notices"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">College Notices</div>
                  <div className="text-xs text-slate-500">Circulars & Placements</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </Link>

            <Link
              to="/academics"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Academic Records</div>
                  <div className="text-xs text-slate-500">CGPA & Semester Marks</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>

          </div>
        </div>


        {/* Two Column Layout: Subject Attendance Preview & Urgent Notice Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Subject Attendance Progress Summary */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Current Semester Attendance Breakdown</h3>
                <p className="text-xs text-slate-500">Semester VIII • Computer Science & Engineering</p>
              </div>
              <Link to="/attendance" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <span>View All Subjects</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-5">
              {attendanceData.subjects.slice(0, 4).map((subject, idx) => (
                <div key={subject.id || subject._id || subject.code || `subj-${idx}`} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 font-semibold">
                      <span className="text-indigo-600 font-bold">{subject.code}</span> - {subject.name}
                    </span>
                    <span className={subject.percentage >= 85 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {subject.attendedClasses}/{subject.totalClasses} classes ({subject.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subject.percentage >= 90
                          ? 'bg-emerald-500'
                          : subject.percentage >= 80
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (4 cols): Important Circulars Panel */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notice Bulletin</span>
              </h3>
              <Link to="/notices" className="text-xs font-bold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {notices.slice(0, 3).map((notice, idx) => (
                <div key={notice.id || notice._id || `notice-${idx}`} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
