import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  User,
  GraduationCap,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Download,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_LOGO_BASE64 } from '../assets/collegeLogo';

export const HallTicket: React.FC = () => {
  const { user, profile } = useAuth();
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<boolean>(false);
  const [copiedSchedule, setCopiedSchedule] = useState<boolean>(false);

  const studentName = profile?.name || user?.name || 'Rohit Kumar';
  const rollNumber = profile?.rollNumber || user?.rollNumber || '22CSE045';
  const department = profile?.department || 'Computer Science & Engineering';
  const studentAvatar =
    profile?.avatarUrl ||
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';

  const examSubjects = [
    {
      code: 'CS8075',
      name: 'Cloud Computing',
      date: '26-Aug-2026',
      day: 'Wednesday',
      session: 'FN (10:00 AM - 01:00 PM)',
      hall: 'Main Block - Hall 204',
      type: 'Theory',
    },
    {
      code: 'CS8080',
      name: 'Information Security',
      date: '29-Aug-2026',
      day: 'Saturday',
      session: 'FN (10:00 AM - 01:00 PM)',
      hall: 'Main Block - Hall 204',
      type: 'Theory',
    },
    {
      code: 'CS8084',
      name: 'Natural Language Processing',
      date: '02-Sep-2026',
      day: 'Wednesday',
      session: 'FN (10:00 AM - 01:00 PM)',
      hall: 'Main Block - Hall 204',
      type: 'Theory',
    },
    {
      code: 'GE8076',
      name: 'Professional Ethics in Engineering',
      date: '05-Sep-2026',
      day: 'Saturday',
      session: 'FN (10:00 AM - 01:00 PM)',
      hall: 'Main Block - Hall 204',
      type: 'Theory',
    },
    {
      code: 'CS8811',
      name: 'Project Work Phase II (Viva-Voce)',
      date: '08-Sep-2026',
      day: 'Tuesday',
      session: 'FN (09:00 AM - 04:00 PM)',
      hall: 'Turing Lab 4',
      type: 'Practical / Viva',
    },
  ];

  const convertImageToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  };

  const generateAndDownloadHTML = async () => {
    const photoBase64 = await convertImageToBase64(studentAvatar);

    const tableRows = examSubjects
      .map(
        (s) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">${s.code}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${s.name}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${s.date} (${s.day})</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${s.session}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${s.hall}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; width: 100px;"></td>
        </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEC_HallTicket_${rollNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; background: #fff; }
    .header { text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
    .college-name { font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 4px 0; color: #1e1b4b; }
    .college-sub { font-size: 12px; color: #475569; font-weight: 600; margin: 2px 0; }
    .title-pill { display: inline-block; background: #0f172a; color: #fff; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 800; margin-top: 12px; text-transform: uppercase; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .meta-grid { display: grid; grid-template-columns: 140px 1fr; gap: 8px; font-size: 13px; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-val { font-weight: 800; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
    th { background: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; text-transform: uppercase; font-size: 11px; text-align: left; }
    .rules { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px; font-size: 11px; color: #78350f; margin-top: 24px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; margin-top: 50px; font-size: 12px; }
    .sig-line { width: 140px; border-bottom: 1.5px solid #64748b; margin: 0 auto 10px; height: 30px; }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="text-align: center; margin-bottom: 12px;">
      <img src="${COLLEGE_LOGO_BASE64}" alt="Sengunthar Engineering College" style="height: 75px; max-width: 320px; object-fit: contain; margin: 0 auto 6px; display: block;" />
      <div style="font-size: 13px; font-weight: 800; color: #1e1b4b; text-transform: uppercase; letter-spacing: 0.5px;">
        (Autonomous Institution • NAAC 'A' Grade • Affiliated to Anna University)
      </div>
    </div>
    <p class="college-sub">Approved by AICTE, New Delhi • Center Code: 7304</p>
    <p class="college-sub">Tiruchengode - 637205, Namakkal District, Tamil Nadu</p>
    <div class="title-pill">End-Semester Examinations Hall Ticket • August / September 2026</div>
  </div>

  <div class="meta-box">
    <div class="meta-grid">
      <span class="meta-label">Candidate Name:</span>
      <span class="meta-val">${studentName}</span>
      <span class="meta-label">Register Number:</span>
      <span class="meta-val" style="color: #4338ca;">${rollNumber}</span>
      <span class="meta-label">Degree & Branch:</span>
      <span class="meta-val">B.E. ${department}</span>
      <span class="meta-label">Exam Center:</span>
      <span class="meta-val">7304 - Sengunthar Engineering College</span>
      <span class="meta-label">Eligibility Status:</span>
      <span class="meta-val" style="color: #059669;">91.8% Attendance • Regulation 2024 Verified</span>
    </div>

    <!-- Candidate Photo Box -->
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 120px; margin-left: 20px; text-align: center;">
      <div style="width: 110px; height: 130px; border: 2px solid #475569; border-radius: 8px; overflow: hidden; background: #e2e8f0; position: relative; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
        <img
          src="${photoBase64}"
          alt="${studentName}"
          style="width: 100%; height: 100%; object-fit: cover; display: block;"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';"
        />
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: #0f172a; color: #ffffff; font-size: 8px; text-align: center; font-weight: 800; padding: 2px 0; letter-spacing: 0.5px;">
          SEC VERIFIED
        </div>
      </div>
      <span style="font-size: 10px; font-weight: 700; color: #475569; margin-top: 4px;">Candidate Photo</span>
    </div>
  </div>

  <h3 style="font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">Theory & Practical Examination Schedule</h3>
  <table>
    <thead>
      <tr>
        <th>Sub Code</th>
        <th>Course Title</th>
        <th>Date & Day</th>
        <th>Session</th>
        <th>Hall No</th>
        <th style="text-align: center;">Invigilator Sign</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="rules">
    <strong>Instructions to Candidate (Regulation 2024):</strong>
    <ul>
      <li>Candidates must enter examination hall 15 minutes before the session starts.</li>
      <li>Possession of mobile phones, electronic smartwatches, or loose paper is strictly prohibited.</li>
      <li>Hall ticket and College ID card must be presented on demand during all examinations.</li>
    </ul>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <strong>Candidate Signature</strong>
    </div>
    <div>
      <div class="sig-line" style="display:flex; align-items:flex-end; justify-content:center; font-style:italic; color:#1e1b4b; font-weight:bold;">Dr. M. Senthilkumar</div>
      <strong>Signature of HOD</strong>
    </div>
    <div>
      <div class="sig-line" style="display:flex; align-items:flex-end; justify-content:center; font-style:italic; color:#0f172a; font-weight:bold;">Dr. R. Natarajan, Ph.D.</div>
      <strong>Controller of Examinations</strong>
    </div>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #4338ca; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
      🖨️ Click to Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_Autonomous_HallTicket_${rollNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = async () => {
    // 1. Trigger official file download with embedded photo
    await generateAndDownloadHTML();

    // 2. Open informative success modal with instructions
    setDownloadSuccessModal(true);

    // 3. Attempt direct print if supported/allowed by browser
    try {
      window.print();
    } catch {
      // Ignored if in restricted iframe
    }
  };

  const handleCopySchedule = () => {
    const text = `SENGUNTHAR ENGINEERING COLLEGE (AUTONOMOUS) - HALL TICKET\n` +
      `Candidate: ${studentName} | Reg No: ${rollNumber}\n` +
      `Branch: B.E. ${department} | Center Code: 7304\n\n` +
      `EXAM SCHEDULE:\n` +
      examSubjects
        .map(
          (s) =>
            `- [${s.code}] ${s.name}\n  Date: ${s.date} (${s.day}) | ${s.session} | Hall: ${s.hall}`
        )
        .join('\n\n') +
      `\n\nCOE: Dr. R. Natarajan, Ph.D. | Status: Verified & Eligible`;

    navigator.clipboard.writeText(text);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Office of the Controller of Examinations</div>
            <h1 className="text-sm sm:text-base font-black text-slate-900">
              Autonomous End-Semester Examination Hall Ticket (August / September 2026)
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopySchedule}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Copy formatted schedule to clipboard"
            >
              {copiedSchedule ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedSchedule ? 'Schedule Copied!' : 'Copy Schedule'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:brightness-110 text-white text-xs font-black shadow-md flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Hall Ticket</span>
            </button>
          </div>
        </div>

        {/* Informative Download / Print Feedback Modal */}
        {downloadSuccessModal && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <span>Official Hall Ticket File Downloaded!</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    SEC_Autonomous_HallTicket_{rollNumber}.html
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  Yeh file aapke downloads folder me save ho gayi hai. Is file par double-click karein — print/save as PDF ka dialog auto-open ho jayega ya keyboard se <kbd className="px-1.5 py-0.5 bg-emerald-200/80 rounded font-mono font-bold">Ctrl + P</kbd> dabayein!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={generateAndDownloadHTML}
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

        {/* PRINTABLE OFFICIAL HALL TICKET CONTAINER */}
        <div id="printable-hall-ticket" className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-300 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Official Letterhead Header */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
            <img
              src="/images/sect-logo.png"
              alt="Sengunthar Engineering College"
              className="h-16 w-auto mx-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
              }}
            />
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                Sengunthar Engineering College (Autonomous)
              </h2>
              <p className="text-[11px] text-slate-600 font-semibold">
                Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • Accredited by NAAC with 'A' Grade
              </p>
              <p className="text-[10px] text-slate-500">
                Tiruchengode - 637205, Namakkal District, Tamil Nadu | Center Code: 7304
              </p>
            </div>

            <div className="inline-block mt-2 px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
              Autonomous End-Semester Examinations Hall Ticket • August / September 2026
            </div>
          </div>

          {/* Candidate Profile Details Block */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
            
            {/* Candidate Details (9 Cols) */}
            <div className="sm:col-span-9 space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Candidate Name:</span>
                <span className="col-span-2 font-black text-slate-900 text-sm">{studentName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Register Number:</span>
                <span className="col-span-2 font-mono font-black text-indigo-700 text-sm">{rollNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Degree & Branch:</span>
                <span className="col-span-2 font-bold text-slate-800">B.E. {department} (Final Year - Sem VIII)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Examination Center:</span>
                <span className="col-span-2 font-bold text-slate-800">7304 - Sengunthar Engineering College</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Attendance Status:</span>
                <span className="col-span-2 font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>91.8% • Exam Eligible (Regulation 2024 Passed)</span>
                </span>
              </div>
            </div>

            {/* Candidate Photo Block (3 Cols) */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center">
              <div className="w-28 h-34 rounded-xl bg-slate-200 border-2 border-slate-400 overflow-hidden flex flex-col items-center justify-center text-slate-500 relative shadow-sm">
                <img
                  src={studentAvatar}
                  alt={studentName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-white text-[9px] text-center font-bold py-0.5 tracking-wider">
                  SEC Verified
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">Candidate Photo</span>
            </div>

          </div>

          {/* Exam Timetable Schedule Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Theory & Practical Examination Schedule
            </h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-black uppercase text-[10px] tracking-wider border-b border-slate-300">
                  <tr>
                    <th className="py-3 px-3">Sub Code</th>
                    <th className="py-3 px-3">Course Title</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Session</th>
                    <th className="py-3 px-3">Hall No</th>
                    <th className="py-3 px-3 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {examSubjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">{sub.code}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{sub.date}</td>
                      <td className="py-3 px-3 text-slate-600">{sub.session}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{sub.hall}</td>
                      <td className="py-3 px-3 text-center border-l border-slate-200 w-24"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & Signatures Strip */}
          <div className="pt-4 border-t border-slate-200 space-y-6">
            
            {/* Rules */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
              <div className="font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Instructions to Candidate (Regulation 2024)</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Candidates must enter the examination hall 15 minutes before session commencement.</li>
                <li>Possession of mobile phones, smartwatches, or programmable calculators is strictly prohibited.</li>
                <li>Hall ticket and College Identity Card must be produced on demand during all exam sessions.</li>
              </ul>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 text-center text-xs">
              <div className="space-y-8">
                <div className="h-10 border-b border-slate-400 mx-auto w-32" />
                <span className="font-bold text-slate-700 block">Candidate Signature</span>
              </div>

              <div className="space-y-8">
                <div className="h-10 border-b border-slate-400 mx-auto w-32 flex items-end justify-center">
                  <span className="font-serif italic text-xs text-indigo-900 font-bold">Dr. M. Senthilkumar</span>
                </div>
                <span className="font-bold text-slate-700 block">Signature of HOD</span>
              </div>

              <div className="space-y-8 col-span-2 sm:col-span-1">
                <div className="h-10 border-b border-slate-400 mx-auto w-32 flex items-end justify-center">
                  <span className="font-serif italic text-xs text-slate-900 font-bold">Dr. R. Natarajan, Ph.D.</span>
                </div>
                <span className="font-black text-slate-900 block">Controller of Examinations</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default HallTicket;
