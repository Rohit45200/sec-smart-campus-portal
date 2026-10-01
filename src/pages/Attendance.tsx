import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen,
  Filter,
  Calculator,
  UserCheck,
  Award
} from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import { AttendanceSubject, AttendanceDailyLog } from '../types';

export const Attendance: React.FC = () => {
  const [subjects, setSubjects] = useState<AttendanceSubject[]>([]);
  const [dailyLogs, setDailyLogs] = useState<AttendanceDailyLog[]>([]);
  const [overallPercentage, setOverallPercentage] = useState(92.5);
  const [totalClasses, setTotalClasses] = useState(232);
  const [totalAttended, setTotalAttended] = useState(216);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'subject' | 'logs'>('subject');
  const [targetPercentage, setTargetPercentage] = useState<number>(90);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [attRes, logsRes] = await Promise.all([
          attendanceService.getAttendance(),
          attendanceService.getAttendanceLogs(),
        ]);
        setSubjects(attRes.subjects);
        setOverallPercentage(attRes.overallPercentage);
        setTotalClasses(attRes.totalClasses);
        setTotalAttended(attRes.totalAttended);
        setDailyLogs(logsRes);
      } catch {
        // Fallbacks
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Calculate classes needed to achieve target percentage
  const calculateNeededClasses = (target: number) => {
    if (overallPercentage >= target) return 0;
    // (Attended + X) / (Total + X) >= target / 100
    // Attended + X >= (target/100) * Total + (target/100) * X
    // X * (1 - target/100) >= (target/100) * Total - Attended
    const targetDecimal = target / 100;
    const numerator = targetDecimal * totalClasses - totalAttended;
    const denominator = 1 - targetDecimal;
    if (denominator <= 0) return 0;
    const needed = Math.ceil(numerator / denominator);
    return needed > 0 ? needed : 0;
  };

  const classesNeededForTarget = calculateNeededClasses(targetPercentage);

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-emerald-600" />
              <span>Student Attendance Tracking</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Sengunthar Engineering College • Department of Computer Science & Engineering • Semester VIII
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex p-1 bg-slate-200/80 rounded-2xl border border-slate-300/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('subject')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'subject'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Subject-wise Attendance
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Attendance Logs
            </button>
          </div>
        </div>


        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stat 1: Overall Percentage */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Percentage</span>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">{overallPercentage}%</div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Above Anna University 75% Threshold</span>
            </div>
          </div>

          {/* Stat 2: Total Classes Held */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Classes Held</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalClasses}</div>
            <div className="text-[11px] font-medium text-slate-500 pt-1">
              Lectures, Labs & Project Hours
            </div>
          </div>

          {/* Stat 3: Total Classes Attended */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classes Attended</span>
            <div className="text-3xl font-black text-indigo-600 tracking-tight">{totalAttended}</div>
            <div className="text-[11px] font-medium text-slate-500 pt-1">
              Includes OD & Official On-Duty
            </div>
          </div>

          {/* Stat 4: Exam Eligibility Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Examination Status</span>
            <div className="text-xl font-black text-emerald-600 tracking-tight flex items-center gap-1.5 pt-1">
              <span>EXAM ELIGIBLE</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              No Attendance Condonation Fee Required
            </div>
          </div>

        </div>


        {/* Target Attendance Estimator Calculator Widget */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Attendance Calculator & Goal Planner</span>
              </div>
              <h3 className="text-xl font-bold">Calculate Classes Needed for Target Percentage</h3>
              <p className="text-xs text-indigo-200/80 leading-relaxed max-w-xl">
                Check how many consecutive upcoming classes you must attend to achieve or maintain your desired overall attendance rate.
              </p>
            </div>

            <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-100">Target Attendance %:</span>
                <div className="flex gap-1">
                  {[85, 90, 95].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTargetPercentage(pct)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                        targetPercentage === pct
                          ? 'bg-amber-400 text-indigo-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl text-center">
                {classesNeededForTarget === 0 ? (
                  <div className="text-xs font-bold text-emerald-300">
                    🎉 You have already achieved or surpassed {targetPercentage}% overall attendance!
                  </div>
                ) : (
                  <div className="text-xs text-amber-200">
                    You need to attend <span className="font-black text-amber-300 text-base">{classesNeededForTarget}</span> more consecutive classes.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* MAIN ATTENDANCE TAB CONTENT */}
        {activeTab === 'subject' ? (
          
          /* Subject-wise Attendance Progress Bars */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Subject-wise Attendance Progress</h3>
                <p className="text-xs text-slate-500">Biometric & Manual Attendance Logs verified by Faculty</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                5 Enrolled Subjects
              </span>
            </div>

            <div className="space-y-6">
              {subjects.map((sub) => {
                const isHigh = sub.percentage >= 85;
                const isWarning = sub.percentage < 75;

                return (
                  <div key={sub.id} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-3 hover:border-indigo-200 transition-colors">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-extrabold text-xs">
                            {sub.code}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Faculty: {sub.faculty}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="text-right">
                          <span className="text-slate-500 font-normal">Attended: </span>
                          <span className="text-slate-900 font-bold">{sub.attendedClasses}</span> / {sub.totalClasses}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          isHigh ? 'bg-emerald-100 text-emerald-800' : isWarning ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.percentage}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            sub.percentage >= 90
                              ? 'bg-emerald-500'
                              : sub.percentage >= 80
                              ? 'bg-blue-600'
                              : sub.percentage >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>0%</span>
                        <span className="text-amber-600 font-bold">75% Min Required</span>
                        <span>100%</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /* Daily Attendance Logs Table */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Class Attendance Log</h3>
              <p className="text-xs text-slate-500">Period-wise entry records submitted by class handling faculty</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Time Slot</th>
                    <th className="p-3.5">Subject Code & Name</th>
                    <th className="p-3.5 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800">{log.date}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{log.timeSlot}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-indigo-600 mr-1.5">{log.subjectCode}</span>
                        <span className="text-slate-800 font-medium">{log.subjectName}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          log.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'On-Duty'
                            ? 'bg-blue-100 text-blue-800'
                            : log.status === 'Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        )}

      </div>
    </div>
  );
};

export default Attendance;
