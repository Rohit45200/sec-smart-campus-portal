import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Download,
  Copy,
  Check,
  X,
} from 'lucide-react';

interface PeriodItem {
  periodNum: number;
  time: string;
  code: string;
  title: string;
  faculty: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Training' | 'Break';
}

export const Timetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<boolean>(false);
  const [copiedSchedule, setCopiedSchedule] = useState<boolean>(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule: Record<string, PeriodItem[]> = {
    Monday: [
      { periodNum: 1, time: '09:00 AM - 09:50 AM', code: 'CS8075', title: 'Cloud Computing', faculty: 'Dr. M. Senthilkumar', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 2, time: '09:50 AM - 10:40 AM', code: 'CS8080', title: 'Information Security', faculty: 'Prof. Priya N', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 3, time: '11:00 AM - 11:50 AM', code: 'CS8811', title: 'Project Work Phase II', faculty: 'Dr. M. Senthilkumar & Team', room: 'Turing Lab 4', type: 'Lab' },
      { periodNum: 4, time: '11:50 AM - 12:40 PM', code: 'GE8076', title: 'Professional Ethics in Engineering', faculty: 'Dr. K. Ramesh', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 5, time: '01:30 PM - 02:20 PM', code: 'CS8084', title: 'Natural Language Processing', faculty: 'Dr. S. Anand', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 6, time: '02:20 PM - 03:10 PM', code: 'PL801', title: 'Zoho & TCS Technical Placement Prep', faculty: 'Mr. R. Vignesh (CDC)', room: 'Seminar Hall 1', type: 'Training' },
      { periodNum: 7, time: '03:10 PM - 04:00 PM', code: 'LIB', title: 'Library & Online NPTEL Hours', faculty: 'Librarian & Faculty in Charge', room: 'Central Library', type: 'Lab' },
    ],
    Tuesday: [
      { periodNum: 1, time: '09:00 AM - 09:50 AM', code: 'CS8084', title: 'Natural Language Processing', faculty: 'Dr. S. Anand', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 2, time: '09:50 AM - 10:40 AM', code: 'CS8075', title: 'Cloud Computing', faculty: 'Dr. M. Senthilkumar', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 3, time: '11:00 AM - 11:50 AM', code: 'GE8076', title: 'Professional Ethics in Engineering', faculty: 'Dr. K. Ramesh', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 4, time: '11:50 AM - 12:40 PM', code: 'CS8080', title: 'Information Security', faculty: 'Prof. Priya N', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 5, time: '01:30 PM - 03:10 PM', code: 'CS8811', title: 'Project Work Phase II Lab (Continuous Review)', faculty: 'HOD & Project Committee', room: 'Turing Lab 4', type: 'Lab' },
      { periodNum: 6, time: '03:10 PM - 04:00 PM', code: 'SP801', title: 'Sports & Wellness Hour', faculty: 'Physical Director', room: 'SEC Sports Complex', type: 'Training' },
    ],
    Wednesday: [
      { periodNum: 1, time: '09:00 AM - 09:50 AM', code: 'CS8080', title: 'Information Security', faculty: 'Prof. Priya N', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 2, time: '09:50 AM - 10:40 AM', code: 'GE8076', title: 'Professional Ethics in Engineering', faculty: 'Dr. K. Ramesh', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 3, time: '11:00 AM - 12:40 PM', code: 'CS8085', title: 'Cloud & AI Lab Demonstration', faculty: 'Dr. M. Senthilkumar', room: 'Cloud Computing Lab', type: 'Lab' },
      { periodNum: 4, time: '01:30 PM - 02:20 PM', code: 'CS8075', title: 'Cloud Computing', faculty: 'Dr. M. Senthilkumar', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 5, time: '02:20 PM - 03:10 PM', code: 'CS8084', title: 'Natural Language Processing', faculty: 'Dr. S. Anand', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 6, time: '03:10 PM - 04:00 PM', code: 'MEN801', title: 'Faculty Mentor Counseling & Review', faculty: 'Dr. M. Senthilkumar', room: 'HOD Chamber', type: 'Training' },
    ],
    Thursday: [
      { periodNum: 1, time: '09:00 AM - 09:50 AM', code: 'CS8075', title: 'Cloud Computing', faculty: 'Dr. M. Senthilkumar', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 2, time: '09:50 AM - 10:40 AM', code: 'CS8084', title: 'Natural Language Processing', faculty: 'Dr. S. Anand', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 3, time: '11:00 AM - 11:50 AM', code: 'CS8080', title: 'Information Security', faculty: 'Prof. Priya N', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 4, time: '11:50 AM - 12:40 PM', code: 'GE8076', title: 'Professional Ethics in Engineering', faculty: 'Dr. K. Ramesh', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 5, time: '01:30 PM - 03:10 PM', code: 'APT801', title: 'Quantitative Aptitude & Coding Round Mock', faculty: 'Career Development Centre', room: 'Auditorium', type: 'Training' },
      { periodNum: 6, time: '03:10 PM - 04:00 PM', code: 'RAG', title: 'AI Copilot & Research Hours', faculty: 'Dr. M. Senthilkumar', room: 'Turing Lab 4', type: 'Lab' },
    ],
    Friday: [
      { periodNum: 1, time: '09:00 AM - 10:40 AM', code: 'CS8811', title: 'Project Work Phase II - Code Evaluation', faculty: 'Project Guide & Expert', room: 'Turing Lab 4', type: 'Lab' },
      { periodNum: 2, time: '11:00 AM - 11:50 AM', code: 'CS8075', title: 'Cloud Computing (Tutorial)', faculty: 'Dr. M. Senthilkumar', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 3, time: '11:50 AM - 12:40 PM', code: 'CS8080', title: 'Information Security (Tutorial)', faculty: 'Prof. Priya N', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 4, time: '01:30 PM - 02:20 PM', code: 'CS8084', title: 'Natural Language Processing', faculty: 'Dr. S. Anand', room: 'Block C - 302', type: 'Theory' },
      { periodNum: 5, time: '02:20 PM - 04:00 PM', code: 'SEM801', title: 'Department Technical Seminar / Hackathon Hours', faculty: 'CSE Association Incharge', room: 'Seminar Hall 1', type: 'Training' },
    ],
  };

  const generateAndDownloadTimetableHTML = () => {
    let daySections = '';
    days.forEach((d) => {
      const rows = schedule[d]
        .map(
          (p) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center;">${p.periodNum}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${p.time}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">${p.code}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${p.title}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${p.faculty}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 600;">${p.room}</td>
          </tr>`
        )
        .join('');

      daySections += `
        <h3 style="margin-top: 20px; font-size: 14px; text-transform: uppercase; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">${d}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px;">
          <thead>
            <tr style="background: #f8fafc; text-align: left; font-size: 11px;">
              <th style="padding: 8px; border: 1px solid #cbd5e1; width: 50px; text-align: center;">Period</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; width: 140px;">Time</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; width: 80px;">Code</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Course Title</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Faculty In-Charge</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; width: 120px;">Room / Lab</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    });

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SEC_Class_Timetable_CSE_FinalYear</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #0f172a; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #1e1b4b; }
    p { margin: 3px 0; font-size: 12px; color: #475569; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Sengunthar Engineering College (Autonomous)</h1>
    <p>Department of Computer Science & Engineering • Academic Year 2025-2026 (Even Sem)</p>
    <p><strong>Class Timetable: B.E. CSE Final Year (Semester VIII)</strong></p>
  </div>
  ${daySections}
  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #4338ca; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_Class_Timetable_CSE_FinalYear.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    generateAndDownloadTimetableHTML();
    setDownloadSuccessModal(true);
    try {
      window.print();
    } catch {
      // Ignored if in restricted iframe
    }
  };

  const handleCopyDaySchedule = () => {
    const list = schedule[selectedDay]
      .map((p) => `Period ${p.periodNum} (${p.time}): [${p.code}] ${p.title} - ${p.faculty} @ ${p.room}`)
      .join('\n');
    navigator.clipboard.writeText(`SEC TIMETABLE - ${selectedDay.toUpperCase()}:\n\n${list}`);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Timetable Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                  Academic Year 2025-2026
                </span>
                <span className="text-xs text-slate-400 font-bold">• Even Semester</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Class Timetable • CSE Final Year (Semester VIII)
              </h1>
              <p className="text-xs text-slate-500">
                Sengunthar Engineering College (Autonomous) • Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyDaySchedule}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Copy day schedule"
            >
              {copiedSchedule ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedSchedule ? 'Copied!' : 'Copy Today'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Timetable</span>
            </button>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccessModal && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <span>Class Timetable File Downloaded!</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    SEC_Class_Timetable_CSE_FinalYear.html
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  Aapke Downloads folder me complete Monday-Friday schedule document save ho gaya hai. Is file ko double-click karke direct print ya PDF save kar sakte hain!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={generateAndDownloadTimetableHTML}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Again</span>
              </button>
              <button
                onClick={() => setDownloadSuccessModal(false)}
                className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Periods List for Selected Day */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{selectedDay}'s Lecture & Lab Schedule</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              7 Periods • 50 Mins Each
            </span>
          </div>

          <div className="space-y-3">
            {schedule[selectedDay].map((period, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 text-indigo-700 font-black text-sm flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-indigo-500">Period</span>
                    <span>{period.periodNum}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-extrabold text-[10px]">
                        {period.code}
                      </span>
                      <h3 className="text-sm font-black text-slate-900">{period.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          period.type === 'Lab'
                            ? 'bg-purple-100 text-purple-700'
                            : period.type === 'Training'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {period.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Faculty: <strong>{period.faculty}</strong></span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Venue: <strong>{period.room}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{period.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tea Break: 10:40 AM - 11:00 AM • Lunch Break: 12:40 PM - 01:30 PM</span>
            <span className="font-bold text-indigo-600">Autonomous Regulation 2024 Schedule</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Timetable;
