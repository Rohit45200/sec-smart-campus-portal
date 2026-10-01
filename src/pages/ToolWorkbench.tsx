import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calculator,
  Calendar,
  Briefcase,
  FileText,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import {
  SafeBunkReport,
  PlacementEligibilityReport,
  FormalApplicationResult,
  CGPASimulationResult,
  MongoDBStats,
} from '../types';

export const ToolWorkbench: React.FC = () => {
  const { user, profile } = useAuth();

  const [activeTool, setActiveTool] = useState<
    'safe_bunk' | 'cgpa_simulator' | 'placement_check' | 'letter_generator' | 'mongodb_stats'
  >('safe_bunk');

  // Safe Bunk state
  const [bunkReport, setBunkReport] = useState<SafeBunkReport | null>(null);
  const [hypotheticalMisses, setHypotheticalMisses] = useState<number>(0);

  // CGPA Simulation state
  const [gradesMap, setGradesMap] = useState<Record<string, 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA'>>({
    CS8801: 'O',
    CS8802: 'O',
    CS8811: 'O',
    CS8082: 'A+',
    GE8076: 'A+',
  });
  const [cgpaResult, setCgpaResult] = useState<CGPASimulationResult | null>(null);
  const [simulatingCGPA, setSimulatingCGPA] = useState(false);

  // Placement state
  const [placementReport, setPlacementReport] = useState<PlacementEligibilityReport | null>(null);

  // Letter Generator state
  const [letterType, setLetterType] = useState<
    'On-Duty' | 'Medical Condonation' | 'Re-evaluation Request' | 'Hostel Gate Pass'
  >('On-Duty');
  const [letterReason, setLetterReason] = useState('Participation in Smart India Hackathon internal round');
  const [letterDates, setLetterDates] = useState('August 14, 2026 - August 16, 2026');
  const [letterEvent, setLetterEvent] = useState('Smart India Hackathon 2026 (Internal Round)');
  const [generatedLetter, setGeneratedLetter] = useState<FormalApplicationResult | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // MongoDB diagnosis state
  const [mongoStats, setMongoStats] = useState<MongoDBStats | null>(null);

  const studentId = profile?.id || user?.id || 'usr_rohit_2026';

  // Load initial tool data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [safeBunk, placement, mongo] = await Promise.all([
          aiService.getSafeBunkReport(studentId),
          aiService.checkPlacementEligibility(studentId),
          aiService.getMongoStats(),
        ]);
        setBunkReport(safeBunk);
        setPlacementReport(placement);
        setMongoStats(mongo);
      } catch (err) {
        console.error('Failed to load workbench tools:', err);
      }
    };
    loadData();
  }, [studentId]);

  // Handle CGPA Simulation
  const runCGPASimulation = async () => {
    setSimulatingCGPA(true);
    try {
      const courses = [
        { subjectCode: 'CS8801', grade: gradesMap['CS8801'] || 'O', credits: 3 },
        { subjectCode: 'CS8802', grade: gradesMap['CS8802'] || 'O', credits: 3 },
        { subjectCode: 'CS8811', grade: gradesMap['CS8811'] || 'O', credits: 6 },
        { subjectCode: 'CS8082', grade: gradesMap['CS8082'] || 'A+', credits: 3 },
        { subjectCode: 'GE8076', grade: gradesMap['GE8076'] || 'A+', credits: 3 },
      ];
      const res = await aiService.simulateCGPA(studentId, courses);
      setCgpaResult(res);
    } catch (err) {
      console.error('CGPA Simulation failed:', err);
    } finally {
      setSimulatingCGPA(false);
    }
  };

  useEffect(() => {
    runCGPASimulation();
  }, [studentId]);

  // Handle Letter Generation
  const handleGenerateLetter = async () => {
    setGeneratingLetter(true);
    try {
      const res = await aiService.draftApplication(
        letterType,
        studentId,
        letterReason,
        letterDates,
        letterEvent
      );
      setGeneratedLetter(res);
    } catch (err) {
      console.error('Letter generation failed:', err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  useEffect(() => {
    handleGenerateLetter();
  }, [letterType, studentId]);

  const copyLetterText = () => {
    if (generatedLetter?.documentText) {
      navigator.clipboard.writeText(generatedLetter.documentText);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    }
  };

  const printLetter = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deterministic Campus Tool Calling Suite</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Campus Intelligence & Tool Workbench
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl">
                Direct access to the deterministic tools used by our Autonomous AI Agents: Safe-Bunk Calculations, CGPA What-If Predictions, Recruitment Matching, and Formal OD Drafting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/20">
                Student: {profile?.name || user?.name || 'Rohit Kumar'} ({profile?.rollNumber || '22CSE045'})
              </span>
            </div>
          </div>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-200/60 rounded-2xl">
          <button
            onClick={() => setActiveTool('safe_bunk')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTool === 'safe_bunk'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Safe-Bunk Calculator</span>
          </button>

          <button
            onClick={() => setActiveTool('cgpa_simulator')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTool === 'cgpa_simulator'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>CGPA What-If Simulator</span>
          </button>

          <button
            onClick={() => setActiveTool('placement_check')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTool === 'placement_check'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span>Placement Eligibility</span>
          </button>

          <button
            onClick={() => setActiveTool('letter_generator')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTool === 'letter_generator'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>OD / Letter Generator</span>
          </button>

          <button
            onClick={() => setActiveTool('mongodb_stats')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTool === 'mongodb_stats'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span>MongoDB Diagnostic</span>
          </button>
        </div>

        {/* TOOL 1: Safe-Bunk & Catch-Up Calculator */}
        {activeTool === 'safe_bunk' && (
          <div className="space-y-6">
            
            {/* Overview Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Overall Attendance Rate
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {bunkReport?.overallPercentage || 91.8}%
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Autonomous Minimum Threshold: 75.0%
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Safe Classes You Can Miss
                </div>
                <div className="text-3xl font-black text-emerald-600">
                  {bunkReport?.overallSafeMissableHours || 0} Hours
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Without dropping below 75% examination eligibility
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Regulation Status
                </div>
                <div className="text-lg font-black text-indigo-700 mt-1">
                  {(bunkReport?.overallPercentage || 91.8) >= 75
                    ? 'Eligible for End-Sem Exam'
                    : 'At Risk (Condonation Bracket)'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  SEC Autonomous Regulation 2024 (Section 7.1)
                </div>
              </div>
            </div>

            {/* Interactive Simulation Slider */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Interactive "What-If I Miss Future Classes?" Slider
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust the slider to simulate how missing future lecture periods affects your overall percentage.
                  </p>
                </div>
                <span className="text-sm font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-200">
                  {hypotheticalMisses} Classes Missed
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="25"
                value={hypotheticalMisses}
                onChange={(e) => setHypotheticalMisses(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              {hypotheticalMisses > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600 font-medium">Projected New Overall Attendance: </span>
                    <strong className="text-indigo-900 font-black text-sm">
                      {Math.max(
                        0,
                        Number(
                          (
                            (((bunkReport?.overallPercentage || 91.8) * 232) / 100 / (232 + hypotheticalMisses)) *
                            100
                          ).toFixed(2)
                        )
                      )}
                      %
                    </strong>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      (((bunkReport?.overallPercentage || 91.8) * 232) / 100 / (232 + hypotheticalMisses)) * 100 >=
                      75
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {(((bunkReport?.overallPercentage || 91.8) * 232) / 100 / (232 + hypotheticalMisses)) * 100 >=
                    75
                      ? '✅ Still Exam Eligible'
                      : '⚠️ Will Drop Below 75%!'}
                  </span>
                </div>
              )}
            </div>

            {/* Subject-Wise Safe Misses Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Subject-by-Subject Safe Bunk Breakdown
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Course</th>
                      <th className="px-6 py-3">Attended / Total</th>
                      <th className="px-6 py-3">Percentage</th>
                      <th className="px-6 py-3">Safe Misses Allowed</th>
                      <th className="px-6 py-3">Catch-Up Hours Needed</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bunkReport?.subjects.map((sub) => (
                      <tr key={sub.code} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-900">{sub.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sub.code} • {sub.faculty}</div>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {sub.attendedClasses} / {sub.totalClasses}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {sub.currentPercentage}%
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black font-mono">
                            +{sub.safeClassesToMiss} hrs
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {sub.classesNeededToReach75 > 0 ? (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-black font-mono">
                              {sub.classesNeededToReach75} hrs needed
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                              sub.status === 'EXCELLENT'
                                ? 'bg-emerald-50 text-emerald-700'
                                : sub.status === 'SAFE'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TOOL 2: CGPA What-If Simulator */}
        {activeTool === 'cgpa_simulator' && (
          <div className="space-y-6">
            
            {/* Projection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Current CGPA
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {cgpaResult?.currentCGPA || 8.84}
                </div>
                <div className="text-[11px] text-slate-500">Across 7 completed semesters</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Projected 8th Sem SGPA
                </div>
                <div className="text-2xl font-black text-indigo-600">
                  {cgpaResult?.projectedSemesterSGPA || 9.5}
                </div>
                <div className="text-[11px] text-slate-500">Based on target grades below</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Projected Cumulative CGPA
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {cgpaResult?.projectedOverallCGPA || 8.92}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold">
                  {cgpaResult?.cgpaChange || '+0.08'} Change
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Eligible Placement Tier
                </div>
                <div className="text-base font-black text-purple-700 truncate mt-1">
                  {cgpaResult?.eligibleTier || 'Super Dream (>= 10 LPA)'}
                </div>
                <div className="text-[11px] text-slate-500">Recruitment Tier qualification</div>
              </div>
            </div>

            {/* Course Grade Selector Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    8th Semester Course Grade Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust target grades to see real-time updates to your final graduation CGPA:
                  </p>
                </div>

                <button
                  onClick={runCGPASimulation}
                  disabled={simulatingCGPA}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition"
                >
                  {simulatingCGPA ? 'Calculating...' : 'Recalculate CGPA'}
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { code: 'CS8801', name: 'Cloud Computing & DevOps', credits: 3 },
                  { code: 'CS8802', name: 'Generative AI & Agentic Systems', credits: 3 },
                  { code: 'CS8811', name: 'Capstone Project Work Phase II', credits: 6 },
                  { code: 'CS8082', name: 'Software Testing & QA Automation', credits: 3 },
                  { code: 'GE8076', name: 'Professional Ethics in Engineering', credits: 3 },
                ].map((course) => (
                  <div
                    key={course.code}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{course.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Code: {course.code} • <strong className="text-indigo-600">{course.credits} Credits</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-500">Target Grade:</span>
                      <select
                        value={gradesMap[course.code] || 'O'}
                        onChange={(e) => {
                          const val = e.target.value as 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA';
                          setGradesMap((prev) => ({ ...prev, [course.code]: val }));
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-black text-xs text-indigo-700 shadow-xs focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="O">O (Outstanding - 10 Pts)</option>
                        <option value="A+">A+ (Excellent - 9 Pts)</option>
                        <option value="A">A (Very Good - 8 Pts)</option>
                        <option value="B+">B+ (Good - 7 Pts)</option>
                        <option value="B">B (Average - 6 Pts)</option>
                        <option value="RA">RA (Re-appear - 0 Pts)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TOOL 3: Placement & Recruiter Matcher */}
        {activeTool === 'placement_check' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Campus Placement Eligibility Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated for <strong>{placementReport?.studentName}</strong> (CGPA: <strong>{placementReport?.studentCGPA}</strong>, Standing Backlogs: 0)
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                ✅ Cleared {placementReport?.eligibleCompaniesCount} of {placementReport?.totalCompaniesEvaluated} Company Criteria
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placementReport?.companies.map((comp) => (
                <div
                  key={comp.company}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        {comp.tier}
                      </span>
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                        {comp.package}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{comp.company}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Roles: {comp.roles.join(', ')}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Required CGPA:</span>
                        <strong className="text-slate-900">{comp.minCGPA}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Your CGPA:</span>
                        <strong className="text-slate-900">{comp.studentCGPA}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">
                      {comp.notes}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black ${
                        comp.isEligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {comp.isEligible ? '✅ Eligible to Apply' : '❌ Below Cutoff'}
                    </span>

                    <button
                      onClick={() => {
                        setActiveTool('letter_generator');
                        setLetterType('On-Duty');
                        setLetterEvent(`${comp.company} Campus Interview & Technical Assessment`);
                        setLetterReason(`Attendance at ${comp.company} recruitment rounds`);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Draft Interview OD →
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TOOL 4: Formal OD & Letter Generator */}
        {activeTool === 'letter_generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Controls (1 col) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Application Parameters
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Document Category
                </label>
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                >
                  <option value="On-Duty">On-Duty (OD) Permission Form</option>
                  <option value="Medical Condonation">Medical Condonation Petition (Reg 7.1)</option>
                  <option value="Re-evaluation Request">Answer Script Revaluation Request</option>
                  <option value="Hostel Gate Pass">Hostel Outing / Gate Pass Permit</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Event / Course / Activity Name
                </label>
                <input
                  type="text"
                  value={letterEvent}
                  onChange={(e) => setLetterEvent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Dates Applicable
                </label>
                <input
                  type="text"
                  value={letterDates}
                  onChange={(e) => setLetterDates(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Purpose / Details
                </label>
                <textarea
                  rows={3}
                  value={letterReason}
                  onChange={(e) => setLetterReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <button
                onClick={handleGenerateLetter}
                disabled={generatingLetter}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition"
              >
                {generatingLetter ? 'Generating Document...' : 'Update Application'}
              </button>
            </div>

            {/* Generated Document Viewer (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Official College Letter Preview
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ready for print, HOD signature, and ERP upload
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyLetterText}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={printLetter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable Letter Paper */}
              <div className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {generatedLetter?.documentText}
              </div>
            </div>

          </div>
        )}

        {/* TOOL 5: MongoDB Diagnostics & Collections */}
        {activeTool === 'mongodb_stats' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                  Database Diagnostic Engine
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  MongoDB Compatible Document Repository ($0 Cost Architecture)
                </h3>
                <p className="text-xs text-slate-500">
                  {mongoStats?.databaseEngine || 'Embedded Zero-Cost Document Database'}
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                Status: {mongoStats?.status || 'ONLINE'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mongoStats?.collections.map((col) => (
                <div
                  key={col.name}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700">
                      db.{col.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 font-bold text-[10px] border border-slate-200">
                      {col.count} Documents
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {col.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-indigo-900 font-bold">
                Deploying without cost?
              </span>
              <span className="font-extrabold text-indigo-700">
                100% Free: Operates in-memory/JSON without external paid Atlas servers, while remaining 100% connectable to MongoDB Atlas M0!
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ToolWorkbench;
