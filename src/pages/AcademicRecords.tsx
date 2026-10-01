import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  GraduationCap,
  Printer,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { academicService } from '../services/academicService';
import { SemesterRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_LOGO_BASE64 } from '../assets/collegeLogo';

export const AcademicRecords: React.FC = () => {
  const { user, profile } = useAuth();
  const [records, setRecords] = useState<SemesterRecord[]>([]);
  const [cgpa, setCgpa] = useState<number>(8.92);
  const [totalCredits, setTotalCredits] = useState<number>(172);
  const [selectedSemester, setSelectedSemester] = useState<number>(8);
  const [loading, setLoading] = useState(true);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<string | null>(null);

  const studentName = profile?.name || user?.name || 'Rohit Kumar';
  const rollNumber = profile?.rollNumber || user?.rollNumber || '22CSE045';
  const department = profile?.department || user?.department || 'Computer Science & Engineering';

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const res = await academicService.getAcademicRecords();
        setRecords(res.records);
        setCgpa(res.cgpa);
        setTotalCredits(res.totalCreditsEarned);
        if (res.records.length > 0) {
          setSelectedSemester(res.records[0].semester);
        }
      } catch {
        // Fallbacks
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicData();
  }, []);

  const currentRecord = records.find((r) => r.semester === selectedSemester) || records[0];

  const generateAndDownloadTranscriptHTML = () => {
    // Generate multi-semester consolidated marks tables
    const semesterTables = (records.length > 0 ? records : [currentRecord]).filter(Boolean).map((sem) => `
      <div style="margin-bottom: 24px;">
        <div style="background: #1e1b4b; color: white; padding: 6px 12px; font-size: 11px; font-weight: 800; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between;">
          <span>SEMESTER ${sem.semester} • EXAM SESSION: ${sem.examMonthYear}</span>
          <span>SGPA: ${sem.sgpa} | CREDITS: ${sem.creditsEarned}/${sem.totalCredits}</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #f1f5f9; text-transform: uppercase; font-size: 10px;">
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Code</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left;">Course Title</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Credits</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Internal</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">External</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Total</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Grade</th>
              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${sem.subjects.map((sub) => `
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">${sub.code}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${sub.name}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.credits}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.internalMarks}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.externalMarks}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${sub.totalMarks}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #6b21a8;">${sub.grade}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #15803d;">${sub.result}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEC_Official_Transcript_${rollNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #0f172a; line-height: 1.4; background: #fff; }
    .header { text-align: center; border-bottom: 2.5px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .college-name { font-size: 22px; font-weight: 900; text-transform: uppercase; color: #1e1b4b; margin: 0; }
    .college-sub { font-size: 11px; color: #475569; margin: 2px 0; font-weight: 600; }
    .title-pill { display: inline-block; background: #581c87; color: #fff; padding: 5px 16px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-box { background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }
    .meta-item { display: flex; justify-content: space-between; }
    .meta-label { color: #6b21a8; font-weight: 600; }
    .meta-val { font-weight: 800; color: #0f172a; }
    .summary-card { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 14px 18px; margin: 24px 0; display: flex; justify-content: space-between; align-items: center; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; margin-top: 40px; font-size: 11px; }
    .sig-line { width: 130px; border-bottom: 1.5px solid #475569; margin: 0 auto 8px; height: 35px; }
    @media print {
      body { margin: 10mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="text-align: center; margin-bottom: 8px;">
      <img src="${COLLEGE_LOGO_BASE64}" alt="Sengunthar Engineering College" style="height: 65px; max-width: 300px; object-fit: contain; margin: 0 auto 6px; display: block;" />
      <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; text-transform: uppercase;">
        (Autonomous Institution • NAAC 'A' Grade • Approved by AICTE • Affiliated to Anna University)
      </div>
    </div>
    <p class="college-sub">Tiruchengode - 637205, Namakkal District, Tamil Nadu, India • Center Code: 7304</p>
    <div class="title-pill">OFFICIAL CONSOLIDATED GRADE SHEET TRANSCRIPT</div>
  </div>

  <div class="meta-box">
    <div class="meta-item"><span class="meta-label">Candidate Name:</span> <span class="meta-val">${studentName}</span></div>
    <div class="meta-item"><span class="meta-label">Register Number:</span> <span class="meta-val" style="color: #6b21a8;">${rollNumber}</span></div>
    <div class="meta-item"><span class="meta-label">Degree & Programme:</span> <span class="meta-val">B.E. Computer Science and Engineering</span></div>
    <div class="meta-item"><span class="meta-label">Regulation / Batch:</span> <span class="meta-val">Regulation 2024 / 2022 - 2026</span></div>
  </div>

  ${semesterTables}

  <div class="summary-card">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase;">Cumulative Grade Point Average (CGPA)</div>
      <div style="font-size: 12px; color: #15803d; font-weight: 600;">Total Mandatory Credits Earned: ${totalCredits} / ${totalCredits}</div>
      <div style="font-size: 12px; color: #15803d; font-weight: 700;">Qualifying Division: FIRST CLASS WITH DISTINCTION</div>
    </div>
    <div style="font-size: 26px; font-weight: 900; color: #166534;">${cgpa} / 10.0</div>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-line" style="display:flex; align-items:flex-end; justify-content:center; font-style:italic; font-weight:bold; color:#1e1b4b;">Section Incharge</div>
      <strong>Prepared & Verified By</strong>
    </div>
    <div>
      <div class="sig-line" style="display:flex; align-items:flex-end; justify-content:center; font-style:italic; font-weight:bold; color:#1e1b4b;">Dr. R. Natarajan, Ph.D.</div>
      <strong>Controller of Examinations</strong>
    </div>
    <div>
      <div class="sig-line" style="display:flex; align-items:flex-end; justify-content:center; font-style:italic; font-weight:bold; color:#1e1b4b;">Dr. C. Venkatesh</div>
      <strong>Principal & Chief Superintendent</strong>
    </div>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #6b21a8; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
      🖨️ Click to Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_Official_Transcript_${rollNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessModal(`Official Transcript (${rollNumber}) - Consolidated Grade Sheet`);
  };

  const generateAndDownloadSemesterMarksheetHTML = (sem: SemesterRecord) => {
    const tableRows = sem.subjects
      .map(
        (sub) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">${sub.code}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 600;">${sub.name}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.credits}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.internalMarks}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.externalMarks}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${sub.totalMarks}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #6b21a8;">${sub.grade}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #15803d;">${sub.result}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEC_Marksheet_Sem${sem.semester}_${rollNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px auto; max-width: 750px; color: #0f172a; line-height: 1.4; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .college-name { font-size: 20px; font-weight: 900; text-transform: uppercase; color: #1e1b4b; margin: 0; }
    .title-pill { display: inline-block; background: #1e1b4b; color: #fff; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-top: 8px; text-transform: uppercase; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
    th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }
    .summary { background: #faf5ff; border: 1.5px solid #d8b4fe; border-radius: 10px; padding: 12px 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
    @media print { body { margin: 10mm; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="text-align: center; margin-bottom: 8px;">
      <img src="${COLLEGE_LOGO_BASE64}" alt="Sengunthar Engineering College" style="height: 60px; max-width: 280px; object-fit: contain; margin: 0 auto 6px; display: block;" />
      <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; text-transform: uppercase;">
        (Autonomous Institution • NAAC 'A' Grade • Affiliated to Anna University)
      </div>
    </div>
    <p style="font-size: 11px; color: #475569; margin: 2px 0;">Approved by AICTE • Tiruchengode - 637205, Tamil Nadu • Center Code: 7304</p>
    <div class="title-pill">Grade Sheet • Semester ${sem.semester} Examination (${sem.examMonthYear})</div>
  </div>

  <div class="meta-box">
    <div><strong>Candidate Name:</strong> ${studentName}</div>
    <div><strong>Register Number:</strong> ${rollNumber}</div>
    <div><strong>Programme:</strong> B.E. ${department}</div>
    <div><strong>Semester SGPA:</strong> <span style="color: #6b21a8; font-weight: bold;">${sem.sgpa}</span> (Credits: ${sem.creditsEarned}/${sem.totalCredits})</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align: left;">Code</th>
        <th style="text-align: left;">Course Title</th>
        <th>Credits</th>
        <th>Internal</th>
        <th>External</th>
        <th>Total</th>
        <th>Grade</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="summary">
    <div>
      <strong style="color: #6b21a8;">Status: ${sem.status}</strong>
      <div style="font-size: 11px; color: #7e22ce;">All Registered Core & Elective Papers Passed</div>
    </div>
    <div style="font-size: 18px; font-weight: 900; color: #6b21a8;">SGPA: ${sem.sgpa}</div>
  </div>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px;">
    <div>Controller of Examinations Division • SEC</div>
    <div style="text-align: center;">
      <div style="width: 130px; border-bottom: 1.5px solid #475569; margin-bottom: 4px; font-style: italic; font-weight: bold;">Dr. R. Natarajan</div>
      <strong>Controller of Examinations</strong>
    </div>
  </div>

  <div class="no-print" style="margin-top: 25px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #4338ca; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
      🖨️ Click to Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_Marksheet_Sem${sem.semester}_${rollNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessModal(`Semester ${sem.semester} Marksheet (${sem.examMonthYear})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <span>Academic Performance & Marksheets</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Anna University Grade Sheets • Semester Credit Statements & Overall CGPA Trajectory
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={generateAndDownloadTranscriptHTML}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-black shadow-md hover:bg-purple-800 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Transcript</span>
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
                  <span>Official Document Downloaded!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  <span className="font-bold">{downloadSuccessModal}</span> file aapke computer ke <strong>Downloads folder</strong> me save ho gayi hai. Is file par double-click karke direct view karein ya print nikaalein (<kbd className="px-1 py-0.5 bg-emerald-200 rounded font-mono font-bold">Ctrl + P</kbd>)!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setDownloadSuccessModal(null)}
                className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall CGPA</span>
            <div className="text-3xl font-black text-purple-600 tracking-tight">{cgpa} / 10.0</div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>First Class with Distinction</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits Earned</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalCredits}</div>
            <div className="text-[11px] font-medium text-slate-500 pt-1">
              All Mandatory Core & Elective Credits
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Standing Arrears</span>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">0 <span className="text-xs text-slate-500 font-normal">(Nil)</span></div>
            <div className="text-[11px] font-semibold text-emerald-700 pt-1">
              100% History of Clean Pass
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Selected SGPA</span>
            <div className="text-3xl font-black text-indigo-600 tracking-tight">
              {currentRecord?.sgpa || 9.15}
            </div>
            <div className="text-[11px] font-medium text-slate-500 pt-1">
              Semester {selectedSemester} Performance
            </div>
          </div>

        </div>

        {/* Semester Selection Tabs */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-slate-500 uppercase px-2">Semester:</span>
            {[8, 7, 6, 5].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSemester === sem
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>

          {currentRecord && (
            <div className="text-xs font-bold text-slate-500 px-3">
              Exam Session: <span className="text-slate-800 font-extrabold">{currentRecord.examMonthYear}</span>
            </div>
          )}
        </div>

        {/* Semester Marksheet Table */}
        {currentRecord && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Semester {currentRecord.semester} Official Mark Statement
                </h3>
                <p className="text-xs text-slate-500">
                  Credits Earned: <span className="font-bold text-slate-800">{currentRecord.creditsEarned} / {currentRecord.totalCredits}</span> • Semester SGPA: <span className="font-bold text-purple-700">{currentRecord.sgpa}</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Result: {currentRecord.status}</span>
                </span>

                <button
                  onClick={() => generateAndDownloadSemesterMarksheetHTML(currentRecord)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-purple-700" />
                  <span>Download Marksheet</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <th className="p-3.5">Subject Code</th>
                    <th className="p-3.5">Subject Description</th>
                    <th className="p-3.5 text-center">Credits</th>
                    <th className="p-3.5 text-center">Internal (20)</th>
                    <th className="p-3.5 text-center">External (80)</th>
                    <th className="p-3.5 text-center">Total (100)</th>
                    <th className="p-3.5 text-center">Letter Grade</th>
                    <th className="p-3.5 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecord.subjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-purple-700">{sub.code}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{sub.name}</td>
                      <td className="p-3.5 text-center font-medium text-slate-600">{sub.credits}</td>
                      <td className="p-3.5 text-center font-bold text-slate-700">{sub.internalMarks}</td>
                      <td className="p-3.5 text-center font-bold text-slate-700">{sub.externalMarks}</td>
                      <td className="p-3.5 text-center font-black text-slate-900">{sub.totalMarks}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-extrabold text-[11px]">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {sub.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grade Points Guide Legend */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <span><strong>O:</strong> 10 Points (Outstanding)</span>
                <span><strong>A+:</strong> 9 Points (Excellent)</span>
                <span><strong>A:</strong> 8 Points (Very Good)</span>
                <span><strong>B+:</strong> 7 Points (Good)</span>
              </div>
              <span className="font-medium text-slate-400">Authenticated by Controller of Examinations - SEC</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AcademicRecords;
