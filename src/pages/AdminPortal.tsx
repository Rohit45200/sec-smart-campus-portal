import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  TrendingUp,
  CreditCard,
  Server,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText,
  Printer,
  Sparkles,
  Database,
  Radio,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();

  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('Exam Cell');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const departments = [
    { name: 'Computer Science & Engineering', students: 420, faculty: 28, attendance: '91.8%', placement: '86%' },
    { name: 'Artificial Intelligence & Data Science', students: 240, faculty: 18, attendance: '88.4%', placement: '82%' },
    { name: 'Electronics & Communication Engg', students: 380, faculty: 26, attendance: '89.1%', placement: '79%' },
    { name: 'Mechanical Engineering', students: 210, faculty: 19, attendance: '86.5%', placement: '74%' },
    { name: 'Civil Engineering', students: 180, faculty: 15, attendance: '89.0%', placement: '71%' },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setAnnouncementText('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Institutional Central ERP Controller • Sengunthar Engineering College</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Er. K. Duraisamy
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Chief ERP Administrator & Director of Systems • Office of the Principal & COE
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Total Students</span>
              <span className="text-xl font-black text-white">2,450</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Total Faculty</span>
              <span className="text-xl font-black text-amber-300">184</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Fee Realized</span>
              <span className="text-xl font-black text-emerald-400">93.2%</span>
            </div>
          </div>
        </div>

        {/* 4 PRIMARY INSTITUTIONAL METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Enrolled Strength</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">2,450</div>
            <div className="text-[11px] text-slate-400">Across 9 UG & 5 PG Autonomous Courses</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Campus Attendance Average</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">89.4%</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Regulation 2024 Compliant</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Semester Fee Collection</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-700">₹2.14 Cr</div>
            <div className="text-[11px] text-slate-400">Billed: ₹2.30 Cr (Pending: ₹16 Lakhs)</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Central Infrastructure</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Up</span>
            </div>
            <div className="text-[11px] text-slate-400">12 IoT Terminals & MongoDB Online</div>
          </div>
        </div>

        {/* DEPARTMENT-WISE PERFORMANCE MATRIX */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Department-Wise Enrollment & Attendance Summary</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Live biometric roll feeds synced across all academic blocks
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Even Semester 2026
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Department / Branch</th>
                  <th className="py-3 px-4">Enrolled Students</th>
                  <th className="py-3 px-4">Teaching Faculty</th>
                  <th className="py-3 px-4">Avg. Attendance</th>
                  <th className="py-3 px-4">Placement Rate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{dept.name}</td>
                    <td className="py-3.5 px-4 font-black text-slate-800">{dept.students}</td>
                    <td className="py-3.5 px-4 text-slate-600">{dept.faculty}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">{dept.attendance}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">{dept.placement}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BROADCAST ANNOUNCEMENT TO CAMPUS PORTAL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              <span>Broadcast Official Campus Circular / Notice</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly pushes circular notifications to all Student and Faculty dashboards
            </p>
          </div>

          {broadcastSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Official Circular successfully published and broadcast to 2,450 students!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Authority</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option>Office of Principal</option>
                  <option>Office of Controller of Examinations</option>
                  <option>Career Development Centre (Placement)</option>
                  <option>Dean of Student Affairs</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Circular Content</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. End-Semester Practical Examination fees deadline extended to Aug 28..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Notice</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminPortal;
