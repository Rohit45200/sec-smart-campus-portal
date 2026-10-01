import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Send,
  Search,
  Check,
  Award,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ODApplication {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  eventName: string;
  venue: string;
  dates: string;
  daysCount: number;
  currentAttendance: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  appliedDate: string;
}

interface StudentAttendanceRecord {
  rollNo: string;
  name: string;
  attendancePercent: number;
  status: 'P' | 'A' | 'OD';
}

export const FacultyPortal: React.FC = () => {
  const { user } = useAuth();

  // OD Applications State
  const [odList, setOdList] = useState<ODApplication[]>([
    {
      id: 'OD-2026-081',
      studentName: 'Rohit Kumar',
      rollNumber: '22CSE045',
      department: 'CSE - Final Year',
      eventName: 'Smart India Hackathon 2026 Internal Round',
      venue: 'Sengunthar Innovation & Incubation Cell',
      dates: 'Aug 21 - Aug 23, 2026',
      daysCount: 3,
      currentAttendance: 91.8,
      status: 'pending',
      appliedDate: 'Aug 14, 2026',
    },
    {
      id: 'OD-2026-082',
      studentName: 'Karthik S',
      rollNumber: '22CSE104',
      department: 'CSE - Final Year',
      eventName: 'Anna University Zonal Cricket Tournament',
      venue: 'Anna University Regional Campus, Coimbatore',
      dates: 'Aug 25 - Aug 26, 2026',
      daysCount: 2,
      currentAttendance: 89.2,
      status: 'approved',
      appliedDate: 'Aug 12, 2026',
    },
    {
      id: 'OD-2026-083',
      studentName: 'Pooja R',
      rollNumber: '23AI089',
      department: 'AI & Data Science',
      eventName: 'National Level Technical Symposium Paper Presentation',
      venue: 'PSG College of Technology',
      dates: 'Aug 28, 2026',
      daysCount: 1,
      currentAttendance: 74.2,
      status: 'pending',
      appliedDate: 'Aug 15, 2026',
    },
  ]);

  // Attendance Sheet State for CSE-IV
  const [selectedSubject, setSelectedSubject] = useState('CS8075 - Cloud Computing');
  const [selectedPeriod, setSelectedPeriod] = useState('Period 3 (11:15 AM - 12:05 PM)');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const [classStudents, setClassStudents] = useState<StudentAttendanceRecord[]>([
    { rollNo: '22CSE045', name: 'Rohit Kumar', attendancePercent: 91.8, status: 'P' },
    { rollNo: '22CSE104', name: 'Karthik S', attendancePercent: 89.2, status: 'P' },
    { rollNo: '22CSE088', name: 'Praveen K', attendancePercent: 78.5, status: 'P' },
    { rollNo: '22CSE092', name: 'Deepika M', attendancePercent: 85.0, status: 'P' },
    { rollNo: '22CSE110', name: 'Suresh Babu', attendancePercent: 72.4, status: 'A' },
    { rollNo: '22CSE125', name: 'Vigneshwaran S', attendancePercent: 88.0, status: 'OD' },
  ]);

  const handleApproveOD = (id: string) => {
    setOdList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleRejectOD = (id: string) => {
    setOdList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'rejected', rejectionReason: 'Attendance below 75% cutoff limit' }
          : item
      )
    );
  };

  const handleToggleAttendance = (rollNo: string, newStatus: 'P' | 'A' | 'OD') => {
    setClassStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = () => {
    setSubmittedMessage(
      `Biometric Attendance for ${selectedSubject} (${selectedPeriod}) successfully submitted and committed to Sengunthar Central ERP database!`
    );
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Faculty Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sengunthar Engineering College • Faculty & HOD Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dr. M. Senthilkumar, Ph.D.
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium">
              Professor & Head of Department • Computer Science & Engineering • Research Coordinator
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Pending ODs</span>
              <span className="text-xl font-black text-amber-300">
                {odList.filter((x) => x.status === 'pending').length}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">CSE-IV Strength</span>
              <span className="text-xl font-black text-white">64</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Class Average</span>
              <span className="text-xl font-black text-emerald-300">88.4%</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ON-DUTY (OD) APPROVAL WORKFLOW */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Student On-Duty (OD) Permission Requests</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review, verify regulation compliance, and approve/reject college event attendance exemptions.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Regulation 2024 Bylaw 6.2
            </span>
          </div>

          <div className="space-y-4">
            {odList.map((od) => (
              <div
                key={od.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-slate-900 text-sm">{od.studentName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-extrabold">
                        {od.rollNumber}
                      </span>
                      <span className="text-xs text-slate-500">{od.department}</span>
                      {od.currentAttendance < 75 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Low Attendance ({od.currentAttendance}%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Attendance: {od.currentAttendance}%
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      Event: <span className="text-indigo-700">{od.eventName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Venue: <strong>{od.venue}</strong></span>
                      <span>•</span>
                      <span>Dates: <strong>{od.dates}</strong> ({od.daysCount} days)</span>
                      <span>•</span>
                      <span>Applied on: {od.appliedDate}</span>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    {od.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveOD(od.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve OD</span>
                        </button>
                        <button
                          onClick={() => handleRejectOD(od.id)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : od.status === 'approved' ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Approved by HOD</span>
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-black border border-rose-300 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Rejected (Below 75%)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: BIOMETRIC PERIOD ATTENDANCE MARKER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Class Attendance Marker (CSE Final Year)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mark period attendance directly into Sengunthar Central ERP database
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option>CS8075 - Cloud Computing</option>
                <option>CS8080 - Information Security</option>
                <option>CS8811 - Project Work Phase II</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option>Period 1 (09:00 AM - 09:50 AM)</option>
                <option>Period 2 (09:50 AM - 10:40 AM)</option>
                <option>Period 3 (11:15 AM - 12:05 PM)</option>
                <option>Period 4 (12:05 PM - 12:55 PM)</option>
              </select>
            </div>
          </div>

          {submittedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submittedMessage}</span>
            </motion.div>
          )}

          {/* Student List Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Cumulative %</th>
                  <th className="py-3 px-4 text-center">Present (P)</th>
                  <th className="py-3 px-4 text-center">Absent (A)</th>
                  <th className="py-3 px-4 text-center">On-Duty (OD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st) => (
                  <tr key={st.rollNo} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{st.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{st.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-black ${
                          st.attendancePercent >= 75 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {st.attendancePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAttendance(st.rollNo, 'P')}
                        className={`w-8 h-8 rounded-xl font-black text-xs transition ${
                          st.status === 'P'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        P
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAttendance(st.rollNo, 'A')}
                        className={`w-8 h-8 rounded-xl font-black text-xs transition ${
                          st.status === 'A'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        A
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAttendance(st.rollNo, 'OD')}
                        className={`w-8 h-8 rounded-xl font-black text-xs transition ${
                          st.status === 'OD'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        OD
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Auto-syncs with SEC BioMetric Terminal #4 (CSE Lab Block)
            </span>
            <button
              onClick={handleSaveAttendance}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Commit Attendance to ERP</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyPortal;
