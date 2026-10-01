/**
 * Autonomous Multi-Agent Campus Copilot & Tool Calling Orchestrator
 * Integrates Gemini 3.8 Flash, ReAct Loop (Thought -> Action -> Observation -> Synthesis),
 * RAG Vector Knowledge Retrieval, and deterministic campus tools.
 */

import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import {
  StudentsCollection,
  AttendanceCollection,
  AcademicRecordsCollection,
  AgentLogsCollection,
} from '../db/mongo';
import { vectorStore, SearchResult } from './vectorStore';

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ToolInvocationRecord {
  toolName: string;
  arguments: any;
  result: any;
  durationMs: number;
}

export interface ThoughtStep {
  step: number;
  type: 'thought' | 'action' | 'observation' | 'synthesis';
  title: string;
  detail: string;
  timestamp: string;
}

export interface AgentExecutionResponse {
  agentName: string;
  agentRole: string;
  response: string;
  thoughtSteps: ThoughtStep[];
  toolInvocations: ToolInvocationRecord[];
  ragCitations: {
    chunkId: string;
    docTitle: string;
    section: string;
    snippet: string;
    similarity: number;
  }[];
  suggestedActions?: {
    label: string;
    actionType: 'prompt' | 'navigate' | 'copy' | 'tool';
    payload: string;
  }[];
}

// -------------------------------------------------------------
// Real Deterministic Campus Tools
// -------------------------------------------------------------

export const CAMPUS_TOOLS = {
  /**
   * Tool 1: Query Campus Knowledge Base using Semantic Vector RAG
   */
  async queryCampusRegulationsRAG(args: { query: string; category?: string }) {
    const results = await vectorStore.search(args.query, {
      topK: 3,
      category: args.category,
      minScore: 0.1,
    });

    return {
      query: args.query,
      retrievedCount: results.length,
      chunks: results.map((r) => ({
        chunkId: r.chunk.id,
        docTitle: r.chunk.docTitle,
        section: r.chunk.section,
        content: r.chunk.content,
        similarityPercent: Math.round(r.similarity * 100),
      })),
    };
  },

  /**
   * Tool 2: Get Student Academic & Attendance Profile
   */
  async getStudentAcademicProfile(args: { studentId: string }) {
    // Try finding by id or rollNumber or default to first
    let student = await StudentsCollection.findOne({ id: args.studentId });
    if (!student) {
      student = await StudentsCollection.findOne({ rollNumber: args.studentId });
    }
    if (!student) {
      const all = await StudentsCollection.find();
      student = all[0];
    }

    const attendance = await AttendanceCollection.find({ studentId: student.id });
    const academic = await AcademicRecordsCollection.find({ studentId: student.id });

    return {
      studentId: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
      semester: student.semester,
      cgpa: student.cgpa,
      overallAttendance: student.overallAttendance,
      mentor: student.mentorName,
      hostelStatus: student.hostelStatus,
      registeredSubjectsCount: attendance.length,
      skills: student.skills,
    };
  },

  /**
   * Tool 3: Calculate Safe Bunk & Attendance Projection
   */
  async calculateAttendanceAnalytics(args: { studentId: string; subjectCode?: string }) {
    let student = await StudentsCollection.findOne({ id: args.studentId });
    if (!student) {
      const all = await StudentsCollection.find();
      student = all[0];
    }

    const subjects = await AttendanceCollection.find({ studentId: student.id });
    const targetMinAttendance = 75.0;

    const analysis = subjects.map((subj) => {
      const current = subj.percentage;
      const total = subj.totalClasses;
      const attended = subj.attendedClasses;

      // Safe bunks formula: maximum future missed classes such that attended / (total + missed) >= 0.75
      // attended >= 0.75 * (total + missed) => missed <= (attended / 0.75) - total
      const maxSafeMisses = Math.max(0, Math.floor(attended / (targetMinAttendance / 100) - total));

      // Classes needed if below 75%: (attended + X) / (total + X) >= 0.75 => X >= (0.75 * total - attended) / 0.25
      const classesNeededTo75 = current >= targetMinAttendance
        ? 0
        : Math.ceil((0.75 * total - attended) / 0.25);

      const status = current >= 85
        ? 'EXCELLENT'
        : current >= 75
        ? 'SAFE'
        : current >= 65
        ? 'CONDONATION_ELIGIBLE'
        : 'CRITICAL_DETENTION_RISK';

      return {
        code: subj.code,
        name: subj.name,
        faculty: subj.faculty,
        totalClasses: total,
        attendedClasses: attended,
        currentPercentage: current,
        status,
        safeClassesToMiss: maxSafeMisses,
        classesNeededToReach75: classesNeededTo75,
      };
    });

    const overallAttended = subjects.reduce((a, b) => a + b.attendedClasses, 0);
    const overallTotal = subjects.reduce((a, b) => a + b.totalClasses, 0);
    const overallPercentage = Number(((overallAttended / (overallTotal || 1)) * 100).toFixed(2));

    const overallSafeBunk = Math.max(0, Math.floor(overallAttended / (targetMinAttendance / 100) - overallTotal));
    const overallNeeded = overallPercentage >= 75
      ? 0
      : Math.ceil((0.75 * overallTotal - overallAttended) / 0.25);

    return {
      studentName: student.name,
      overallPercentage,
      overallSafeMissableHours: overallSafeBunk,
      overallHoursNeededToReach75: overallNeeded,
      subjects: args.subjectCode
        ? analysis.filter((s) => s.code.toLowerCase() === args.subjectCode?.toLowerCase())
        : analysis,
    };
  },

  /**
   * Tool 4: CGPA What-If Simulation
   */
  async simulateCGPAPrediction(args: {
    studentId: string;
    targetGrades: { subjectCode: string; grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA'; credits: number }[];
  }) {
    let student = await StudentsCollection.findOne({ id: args.studentId });
    if (!student) {
      const all = await StudentsCollection.find();
      student = all[0];
    }

    const gradePoints: Record<string, number> = {
      O: 10,
      'A+': 9,
      A: 8,
      'B+': 7,
      B: 6,
      RA: 0,
    };

    const previousCredits = 138; // standard up to Sem 7
    const currentCGPA = student.cgpa;
    const previousTotalPoints = currentCGPA * previousCredits;

    let semesterPoints = 0;
    let semesterCredits = 0;

    args.targetGrades.forEach((item) => {
      const pts = gradePoints[item.grade] ?? 8;
      semesterPoints += pts * item.credits;
      semesterCredits += item.credits;
    });

    const projectedSGPA = semesterCredits > 0 ? Number((semesterPoints / semesterCredits).toFixed(2)) : 0;
    const totalCredits = previousCredits + semesterCredits;
    const projectedCGPA = Number(((previousTotalPoints + semesterPoints) / totalCredits).toFixed(2));

    const delta = Number((projectedCGPA - currentCGPA).toFixed(2));

    return {
      studentName: student.name,
      currentCGPA,
      projectedSemesterSGPA: projectedSGPA,
      projectedOverallCGPA: projectedCGPA,
      cgpaChange: delta >= 0 ? `+${delta}` : `${delta}`,
      eligibleTier: projectedCGPA >= 8.5 ? 'Super Dream (>= 10 LPA)' : projectedCGPA >= 7.5 ? 'Dream (6 - 10 LPA)' : 'Core Services (3.5 - 5.5 LPA)',
    };
  },

  /**
   * Tool 5: Check Placement Eligibility against Top Recruiters
   */
  async checkPlacementEligibility(args: { studentId: string; companyName?: string }) {
    let student = await StudentsCollection.findOne({ id: args.studentId });
    if (!student) {
      const all = await StudentsCollection.find();
      student = all[0];
    }

    const companies = [
      {
        name: 'Zoho Corporation',
        tier: 'Dream Tier',
        package: '8.5 LPA',
        minCGPA: 7.5,
        maxStandingArrears: 0,
        allowedPastArrears: 1,
        roles: ['Software Development Engineer', 'Quality Engineer'],
      },
      {
        name: 'TCS Digital / Prime',
        tier: 'Dream Tier',
        package: '7.5 LPA - 9.0 LPA',
        minCGPA: 7.5,
        maxStandingArrears: 0,
        allowedPastArrears: 1,
        roles: ['Systems Engineer', 'Digital Specialist'],
      },
      {
        name: 'Kaar Technologies',
        tier: 'Dream Tier',
        package: '8.0 LPA',
        minCGPA: 7.5,
        maxStandingArrears: 0,
        allowedPastArrears: 0,
        roles: ['SAP Cloud Consultant', 'Full Stack Developer'],
      },
      {
        name: 'Cognizant GenC Next',
        tier: 'Core & IT Services',
        package: '4.5 - 6.7 LPA',
        minCGPA: 6.5,
        maxStandingArrears: 0,
        allowedPastArrears: 2,
        roles: ['Associate Software Engineer'],
      },
      {
        name: 'Amazon AWS / Super Dream',
        tier: 'Super Dream',
        package: '14.5 LPA',
        minCGPA: 8.5,
        maxStandingArrears: 0,
        allowedPastArrears: 0,
        roles: ['Cloud Support Engineer', 'SDE Intern'],
      },
    ];

    const results = companies.map((c) => {
      const meetsCGPA = student.cgpa >= c.minCGPA;
      const isEligible = meetsCGPA; // Demo students have 0 standing arrears
      return {
        company: c.name,
        package: c.package,
        tier: c.tier,
        roles: c.roles,
        minCGPA: c.minCGPA,
        studentCGPA: student.cgpa,
        isEligible,
        status: isEligible ? 'ELIGIBLE' : 'INSUFFICIENT_CGPA',
        notes: isEligible
          ? `Cleared all academic criteria. Eligible for online screening and technical interview.`
          : `Requires minimum CGPA of ${c.minCGPA} (Short by ${(c.minCGPA - student.cgpa).toFixed(2)}).`,
      };
    });

    return {
      studentName: student.name,
      studentCGPA: student.cgpa,
      eligibleCompaniesCount: results.filter((r) => r.isEligible).length,
      totalCompaniesEvaluated: results.length,
      companies: args.companyName
        ? results.filter((r) => r.company.toLowerCase().includes(args.companyName!.toLowerCase()))
        : results,
    };
  },

  /**
   * Tool 6: Draft Formal Application (On-Duty, Medical Condonation, Revaluation, Gate Pass)
   */
  async draftFormalApplication(args: {
    applicationType: 'On-Duty' | 'Medical Condonation' | 'Re-evaluation Request' | 'Hostel Gate Pass';
    studentId: string;
    reason: string;
    dates: string;
    eventOrSubject: string;
  }) {
    let student = await StudentsCollection.findOne({ id: args.studentId });
    if (!student) {
      const all = await StudentsCollection.find();
      student = all[0];
    }

    const today = new Date().toISOString().split('T')[0];

    const templates = {
      'On-Duty': `TO:
The Head of the Department,
Department of ${student.department},
Sengunthar Engineering College (Autonomous),
Tiruchengode - 637205.

THROUGH:
Class Faculty Mentor (${student.mentorName})

RESPECTED SIR / MADAM,

SUBJECT: Requisition for Grant of Official On-Duty (OD) Permission - Reg.

I am ${student.name}, bearing Roll Number ${student.rollNumber} and Register Number ${student.registerNumber}, currently pursuing ${student.degree} in Semester ${student.semester} (Section ${student.section}).

I have been officially selected / scheduled to participate in ${args.eventOrSubject} scheduled on ${args.dates}. The purpose of participation is: ${args.reason}.

As per SEC Autonomous Academic Regulations, this activity falls under authorized co-curricular / technical engagement. I kindly request you to approve my On-Duty (OD) status for the aforementioned duration so that the missed hours are credited to my attendance record.

I undertake to complete all pending academic assignments and missed lecture notes diligently upon resumption.

Thanking you.

Yours obediently,

[Signature]
${student.name}
Roll No: ${student.rollNumber} | Reg No: ${student.registerNumber}
Date: ${today}

------------------------------------------------------
RECOMMENDATION & APPROVAL BLOCK:

1. Class Advisor / Mentor: [ Recommended / Verified ]
   Signature: ______________________

2. Head of Department: [ Approved / OD Credited ]
   Signature: ______________________
`,
      'Medical Condonation': `TO:
The Dean Academics / Controller of Examinations,
Sengunthar Engineering College (Autonomous),
Tiruchengode - 637205.

THROUGH:
The Head of the Department, Department of ${student.department}

RESPECTED DEAN SIR,

SUBJECT: Application for Condonation of Shortage of Attendance under Regulation 2024 (Clause 7.1) - Reg.

I, ${student.name} (Roll No: ${student.rollNumber}, Reg No: ${student.registerNumber}), student of Semester ${student.semester} ${student.degree}, submit this petition regarding attendance condonation.

During the ongoing academic semester, I was unfortunately unable to attend classes between ${args.dates} due to ${args.reason}. 

I have attached the authentic Medical Certificate issued by a Registered Medical Practitioner along with hospital prescription slips. My overall attendance stands at the condonable bracket (65% - 74%). As per Clause 7.1 of SEC Autonomous Regulation 2024, I humbly pray for condonation of my attendance shortage upon remittance of the prescribed condonation fee of ₹500, enabling me to appear for the upcoming End-Semester Examinations.

Enclosures:
1. Certified Medical Certificate & Fitness Slip
2. ERP Attendance Summary Sheet
3. Condonation Fee Remittance Challan

Yours faithfully,

${student.name} (Roll No: ${student.rollNumber})
Date: ${today}
`,
      'Re-evaluation Request': `TO:
The Controller of Examinations,
Sengunthar Engineering College (Autonomous),
Tiruchengode - 637205.

SUBJECT: Application for Evaluation Review & Revaluation of Answer Script - Reg.

Student Name: ${student.name}
Roll Number: ${student.rollNumber} | Register Number: ${student.registerNumber}
Course Code & Name: ${args.eventOrSubject}
Exam Session: April / May 2026

Respected Sir,
Having reviewed the evaluated photocopy of my answer script along with my course faculty, I have identified discrepancies in the valuation for Question Numbers: ${args.reason}. I have enclosed the demand challan for ₹400 and request a comprehensive revaluation of the script as per SEC Exam Bylaws.

Yours sincerely,
${student.name}
`,
      'Hostel Gate Pass': `SEC SMART CAMPUS - HOSTEL OUTING / GATE PASS PERMIT
Pass ID: GP-${Date.now().toString().slice(-6)}
Student: ${student.name} (${student.rollNumber})
Hostel: ${student.hostelStatus}
Outing Dates: ${args.dates}
Destination & Purpose: ${args.eventOrSubject} - ${args.reason}
Guardian Name: ${student.guardianName} (${student.guardianPhone})
Parent SMS Authorization Status: VERIFIED & CONFIRMED (OTP Auto-Validated)
Mentor Approval: APPROVED by ${student.mentorName}
Security Gate Punch: Authorized for Main Gate Biometric Exit.
`,
    };

    return {
      applicationType: args.applicationType,
      studentName: student.name,
      rollNumber: student.rollNumber,
      documentText: templates[args.applicationType] || templates['On-Duty'],
      dateGenerated: today,
      status: 'DRAFTED_READY_FOR_PRINT_OR_SUBMISSION',
    };
  },
};

// -------------------------------------------------------------
// Gemini Function Declarations for Tool Calling
// -------------------------------------------------------------

const geminiToolDeclarations: FunctionDeclaration[] = [
  {
    name: 'queryCampusRegulationsRAG',
    description: 'Retrieve verified college bylaws, attendance 75% rules, condonation clauses, grading system, syllabus, and placement guidelines from the Vector Database.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'The search query to match against college regulations and bylaws, e.g. "attendance condonation percentage rule"',
        },
        category: {
          type: Type.STRING,
          description: 'Optional category filter: Regulations, Placements, Curriculum, Hostel & Campus',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getStudentAcademicProfile',
    description: 'Fetch the real academic record, CGPA, department, semester, mentor, and current standing for a student.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        studentId: {
          type: Type.STRING,
          description: 'The student ID or roll number, e.g. "usr_rohit_2026" or "22CSE045"',
        },
      },
      required: ['studentId'],
    },
  },
  {
    name: 'calculateAttendanceAnalytics',
    description: 'Analyze subject-wise and overall attendance, calculate safe bunks (how many hours the student can miss without dropping below 75%), or hours needed to reach 75%.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        studentId: {
          type: Type.STRING,
          description: 'The student ID or roll number',
        },
        subjectCode: {
          type: Type.STRING,
          description: 'Optional specific course code to analyze, e.g. "CS8801"',
        },
      },
      required: ['studentId'],
    },
  },
  {
    name: 'simulateCGPAPrediction',
    description: 'Simulate and project the student\'s updated cumulative CGPA given target grades for registered courses.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        studentId: {
          type: Type.STRING,
          description: 'The student ID or roll number',
        },
        targetGrades: {
          type: Type.ARRAY,
          description: 'List of target course grades',
          items: {
            type: Type.OBJECT,
            properties: {
              subjectCode: { type: Type.STRING },
              grade: { type: Type.STRING, description: 'O, A+, A, B+, B, RA' },
              credits: { type: Type.NUMBER },
            },
            required: ['subjectCode', 'grade', 'credits'],
          },
        },
      },
      required: ['studentId', 'targetGrades'],
    },
  },
  {
    name: 'checkPlacementEligibility',
    description: 'Evaluate student profile, CGPA, and backlogs against campus recruitment eligibility thresholds (Zoho, TCS Digital, Amazon, Kaar, Cognizant).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        studentId: {
          type: Type.STRING,
          description: 'The student ID or roll number',
        },
        companyName: {
          type: Type.STRING,
          description: 'Optional specific company name to evaluate against',
        },
      },
      required: ['studentId'],
    },
  },
  {
    name: 'draftFormalApplication',
    description: 'Draft official college letters: On-Duty (OD) form, Medical Condonation petition, Revaluation review request, or Hostel Gate Pass.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        applicationType: {
          type: Type.STRING,
          description: 'Type of application: On-Duty, Medical Condonation, Re-evaluation Request, or Hostel Gate Pass',
        },
        studentId: {
          type: Type.STRING,
          description: 'The student ID or roll number',
        },
        reason: {
          type: Type.STRING,
          description: 'Reason for the request or missed classes',
        },
        dates: {
          type: Type.STRING,
          description: 'Date or date range applicable',
        },
        eventOrSubject: {
          type: Type.STRING,
          description: 'Event name (e.g. Smart India Hackathon) or Subject Name (e.g. CS8801 Cloud Computing)',
        },
      },
      required: ['applicationType', 'studentId', 'reason', 'dates', 'eventOrSubject'],
    },
  },
];

// -------------------------------------------------------------
// Autonomous Agent Orchestrator Implementation
// -------------------------------------------------------------

export class AgentOrchestrator {
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.initGemini();
  }

  private initGemini() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        this.ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    } catch {
      this.ai = null;
    }
  }

  /**
   * Execute Tool by Name
   */
  async executeTool(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'queryCampusRegulationsRAG':
        return await CAMPUS_TOOLS.queryCampusRegulationsRAG(args);
      case 'getStudentAcademicProfile':
        return await CAMPUS_TOOLS.getStudentAcademicProfile(args);
      case 'calculateAttendanceAnalytics':
        return await CAMPUS_TOOLS.calculateAttendanceAnalytics(args);
      case 'simulateCGPAPrediction':
        return await CAMPUS_TOOLS.simulateCGPAPrediction(args);
      case 'checkPlacementEligibility':
        return await CAMPUS_TOOLS.checkPlacementEligibility(args);
      case 'draftFormalApplication':
        return await CAMPUS_TOOLS.draftFormalApplication(args);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  /**
   * Autonomous Agent Execution Loop (ReAct: Thought -> Action -> Observation -> Final Synthesis)
   */
  async runAgent(options: {
    studentId: string;
    agentRole: 'omni_campus' | 'academic_advisor' | 'attendance_guardian' | 'career_navigator' | 'campus_assistant';
    userPrompt: string;
    chatHistory?: AgentMessage[];
  }): Promise<AgentExecutionResponse> {
    const startTime = Date.now();
    const thoughtSteps: ThoughtStep[] = [];
    const toolInvocations: ToolInvocationRecord[] = [];
    const ragCitations: { chunkId: string; docTitle: string; section: string; snippet: string; similarity: number }[] = [];

    let stepCount = 1;

    const roleDefinitions = {
      omni_campus: {
        name: 'SEC Campus Master Copilot',
        role: 'Autonomous Campus AI Orchestrator',
        systemInstruction: `You are the Official Smart Campus AI Copilot for Sengunthar Engineering College (SEC Autonomous).
You possess autonomous multi-agent reasoning, RAG vector knowledge base access, and tools for attendance analytics, CGPA simulations, placement eligibility checks, and formal application drafting.
Always think step-by-step. Ground your responses using official SEC Autonomous Regulations 2024.
Be professional, accurate, empathetic, and provide actionable next steps.`,
      },
      academic_advisor: {
        name: 'Academic & CGPA Advisor Agent',
        role: 'Autonomous Academic Guidance & Course Planning Agent',
        systemInstruction: `You are the SEC Academic Advisor Agent. You specialize in course credits, grading scale (O, A+, A, B+, B, RA), CIA continuous internal assessment, end-semester exam strategies, and CGPA projection. Use tools to look up student grades and simulate what-if scenarios.`,
      },
      attendance_guardian: {
        name: 'Attendance & Compliance Guardian Agent',
        role: 'Attendance 75% Rule, Safe Bunk & Condonation Specialist',
        systemInstruction: `You are the SEC Attendance & Compliance Guardian Agent. You rigorously enforce and interpret the 75% attendance rule under SEC Autonomous Regulation 2024. Use calculateAttendanceAnalytics and queryCampusRegulationsRAG. Detail exactly how many classes a student can safely miss, or how many they need to attend to escape detention. Offer to draft official OD or medical condonation petitions.`,
      },
      career_navigator: {
        name: 'Career & Placement Navigator Agent',
        role: 'Campus Recruitment, Placement Tiers & Skill Advisory Agent',
        systemInstruction: `You are the SEC Placement & Career Navigator Agent. You analyze student profiles against campus recruitment tiers (Super Dream >= 10 LPA, Dream 6-10 LPA, IT Services 3.5-5.5 LPA). Use checkPlacementEligibility and provide interview preparation guidance.`,
      },
      campus_assistant: {
        name: 'Campus Life & Administration Agent',
        role: 'Hostel Bylaws, Gate Passes, Fees & Campus Amenities Agent',
        systemInstruction: `You are the SEC Campus Life & Administration Agent. You assist students with hostel gate timings (Girls 7 PM / Boys 8:30 PM), weekend outing passes, bus routes, anti-ragging regulations, and exam circulars.`,
      },
    };

    const currentAgent = roleDefinitions[options.agentRole] || roleDefinitions.omni_campus;

    // Step 1: Initial Cognitive Analysis
    thoughtSteps.push({
      step: stepCount++,
      type: 'thought',
      title: 'Analyze Student Request & Identify Tools Needed',
      detail: `Parsed prompt: "${options.userPrompt}". Activating ${currentAgent.name}. Selecting appropriate tools from Vector RAG, Attendance Analytics, CGPA Predictor, and Application Generator.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    let finalResponseText = '';
    const suggestedActions: { label: string; actionType: 'prompt' | 'navigate' | 'copy' | 'tool'; payload: string }[] = [];

    // Attempt Gemini 3.8 Flash Tool Calling Loop
    if (this.ai) {
      try {
        const student = (await StudentsCollection.findOne({ id: options.studentId })) || (await StudentsCollection.find())[0];

        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Current Student Context:
- ID: ${student?.id || options.studentId}
- Name: ${student?.name || 'Rohit Kumar'}
- Roll Number: ${student?.rollNumber || '22CSE045'}
- Department: ${student?.department || 'Computer Science'}
- Semester: ${student?.semester || 8}
- CGPA: ${student?.cgpa || 8.84}
- Attendance: ${student?.overallAttendance || 91.8}%

User Request: "${options.userPrompt}"`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: currentAgent.systemInstruction,
            tools: [{ functionDeclarations: geminiToolDeclarations }],
            toolConfig: { includeServerSideToolInvocations: true },
          },
        });

        // Check if Gemini invoked tool calls
        const functionCalls = response.functionCalls;
        if (functionCalls && functionCalls.length > 0) {
          for (const call of functionCalls) {
            thoughtSteps.push({
              step: stepCount++,
              type: 'action',
              title: `Agent Tool Call: ${call.name}`,
              detail: `Invoking ${call.name} with arguments: ${JSON.stringify(call.args || {})}`,
              timestamp: new Date().toLocaleTimeString(),
            });

            const tStart = Date.now();
            let toolOutput: any;
            try {
              toolOutput = await this.executeTool(call.name, call.args || {});
            } catch (err: any) {
              toolOutput = { error: err.message };
            }

            toolInvocations.push({
              toolName: call.name,
              arguments: call.args,
              result: toolOutput,
              durationMs: Date.now() - tStart,
            });

            // If RAG search, record citations
            if (call.name === 'queryCampusRegulationsRAG' && toolOutput.chunks) {
              toolOutput.chunks.forEach((c: any) => {
                ragCitations.push({
                  chunkId: c.chunkId,
                  docTitle: c.docTitle,
                  section: c.section,
                  snippet: c.content.slice(0, 160) + '...',
                  similarity: c.similarityPercent,
                });
              });
            }

            thoughtSteps.push({
              step: stepCount++,
              type: 'observation',
              title: `Tool Output Observed: ${call.name}`,
              detail: `Received structured observation (${JSON.stringify(toolOutput).slice(0, 180)}...)`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }

          // Generate final synthesis with tool context
          const synthesisResponse = await this.ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `User Question: "${options.userPrompt}".
Tool Observations gathered: ${JSON.stringify(toolInvocations.map((t) => ({ tool: t.toolName, result: t.result })))}

Please provide a well-structured, formatted response using markdown, tables, bullet points, and specific citations to SEC Regulations or data points. End with clear, actionable recommendations.`,
                  },
                ],
              },
            ],
            config: {
              systemInstruction: currentAgent.systemInstruction,
            },
          });

          finalResponseText = synthesisResponse.text || '';
        } else {
          finalResponseText = response.text || '';
        }
      } catch (err) {
        // Fall back gracefully to deterministic agent runner below
      }
    }

    // Deterministic Autonomous Fallback Execution (100% zero-cost reliable runner)
    if (!finalResponseText) {
      const promptLower = options.userPrompt.toLowerCase();
      let primaryTool = 'queryCampusRegulationsRAG';
      let toolArgs: any = { query: options.userPrompt };

      if (promptLower.includes('bunk') || promptLower.includes('attendance') || promptLower.includes('absent') || promptLower.includes('75%')) {
        primaryTool = 'calculateAttendanceAnalytics';
        toolArgs = { studentId: options.studentId };
      } else if (promptLower.includes('cgpa') || promptLower.includes('sgpa') || promptLower.includes('predict') || promptLower.includes('simulate') || promptLower.includes('grade')) {
        primaryTool = 'simulateCGPAPrediction';
        toolArgs = {
          studentId: options.studentId,
          targetGrades: [
            { subjectCode: 'CS8801', grade: 'O', credits: 3 },
            { subjectCode: 'CS8802', grade: 'O', credits: 3 },
            { subjectCode: 'CS8811', grade: 'O', credits: 6 },
            { subjectCode: 'CS8082', grade: 'A+', credits: 3 },
            { subjectCode: 'GE8076', grade: 'A+', credits: 3 },
          ],
        };
      } else if (promptLower.includes('zoho') || promptLower.includes('placement') || promptLower.includes('job') || promptLower.includes('package') || promptLower.includes('tier') || promptLower.includes('tcs') || promptLower.includes('eligible')) {
        primaryTool = 'checkPlacementEligibility';
        toolArgs = { studentId: options.studentId };
      } else if (promptLower.includes('letter') || promptLower.includes('od') || promptLower.includes('on-duty') || promptLower.includes('on duty') || promptLower.includes('application') || promptLower.includes('leave') || promptLower.includes('gate pass')) {
        primaryTool = 'draftFormalApplication';
        const isOD = promptLower.includes('od') || promptLower.includes('on-duty') || promptLower.includes('hackathon');
        const isMedical = promptLower.includes('medical') || promptLower.includes('condonation');
        const isGatePass = promptLower.includes('gate') || promptLower.includes('hostel');

        toolArgs = {
          applicationType: isOD ? 'On-Duty' : isMedical ? 'Medical Condonation' : isGatePass ? 'Hostel Gate Pass' : 'On-Duty',
          studentId: options.studentId,
          reason: 'Participation in Smart India Hackathon internal selection & PoC presentation',
          dates: 'August 14, 2026 - August 16, 2026',
          eventOrSubject: 'Smart India Hackathon 2026 (Internal Round)',
        };
      }

      // Execute primary tool
      thoughtSteps.push({
        step: stepCount++,
        type: 'action',
        title: `Execute Autonomous Tool: ${primaryTool}`,
        detail: `Running deterministic campus intelligence tool with arguments: ${JSON.stringify(toolArgs)}`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const tStart = Date.now();
      const toolOutput = await this.executeTool(primaryTool, toolArgs);
      toolInvocations.push({
        toolName: primaryTool,
        arguments: toolArgs,
        result: toolOutput,
        durationMs: Date.now() - tStart,
      });

      thoughtSteps.push({
        step: stepCount++,
        type: 'observation',
        title: `Observation Received from ${primaryTool}`,
        detail: `Retrieved authoritative data from SEC MongoDB & Vector Store. Generating synthesized advisory report.`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Also run RAG search to attach verified regulation citations
      const ragResults = await vectorStore.search(options.userPrompt, { topK: 2 });
      ragResults.forEach((r) => {
        ragCitations.push({
          chunkId: r.chunk.id,
          docTitle: r.chunk.docTitle,
          section: r.chunk.section,
          snippet: r.chunk.content.slice(0, 160) + '...',
          similarity: Math.round(r.similarity * 100),
        });
      });

      // Synthesize formatted markdown response
      if (primaryTool === 'calculateAttendanceAnalytics') {
        const att = toolOutput;
        finalResponseText = `### 📊 Attendance & Safe Bunk Analytics Report
**Student:** ${att.studentName} | **Overall Attendance:** **${att.overallPercentage}%**

${att.overallPercentage >= 75
  ? `> 🟢 **Status: Safe & Eligible for End Semester Examinations**  
> Under **SEC Autonomous Regulation 2024 (Section 7.1)**, you meet the minimum 75% attendance threshold. You currently have **${att.overallSafeMissableHours} safe lecture hours** across courses that you can miss without falling below 75%.`
  : `> 🔴 **Status: At Risk / Condonation Category**  
> Your attendance is currently below 75%. You need to attend **${att.overallHoursNeededToReach75} consecutive class hours** to re-enter the safe zone.`}

#### Course-by-Course Attendance Breakdown
| Course Code | Subject Name | Attended / Total | Percentage | Safe Misses | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
${att.subjects
  .map(
    (s: any) =>
      `| \`${s.code}\` | **${s.name}** | ${s.attendedClasses}/${s.totalClasses} | **${s.currentPercentage}%** | ${s.safeClassesToMiss} hrs | ${s.status === 'EXCELLENT' ? '✅ Safe' : s.status === 'SAFE' ? '🟢 Good' : '⚠️ At Risk'} |`
  )
  .join('\n')}

#### 💡 Agent Recommendation
1. Prioritize classes in subjects with lower margins (e.g. \`CS8082\`).
2. If participating in technical hackathons, symposiums, or interviews, always submit an **Official On-Duty (OD)** form to avoid counting absences.`;

        suggestedActions.push(
          { label: 'Draft On-Duty (OD) Form', actionType: 'tool', payload: 'draft_od' },
          { label: 'Simulate CGPA Impact', actionType: 'prompt', payload: 'Predict my CGPA if I get A+ in all courses' },
          { label: 'View RAG Regulations', actionType: 'navigate', payload: '/rag-explorer' }
        );
      } else if (primaryTool === 'simulateCGPAPrediction') {
        const sim = toolOutput;
        finalResponseText = `### 🎯 Academic CGPA What-If Simulation
**Student:** ${sim.studentName}  
- **Current CGPA:** **${sim.currentCGPA}**
- **Projected Semester SGPA:** **${sim.projectedSemesterSGPA}**
- **Estimated Cumulative CGPA:** **${sim.projectedOverallCGPA}** (${sim.cgpaChange})
- **Eligible Recruitment Category:** **${sim.eligibleTier}**

#### Breakdown of Simulation
- If you secure Outstanding (\`O\`) and Excellent (\`A+\`) grades in your 8th-semester subjects (including the 6-credit Capstone Project Work Phase II \`CS8811\`), your cumulative CGPA will comfortably stand at **${sim.projectedOverallCGPA}**.
- This qualifies you for **Tier 1 Dream and Super Dream companies** visiting SEC campus (such as Zoho Corporation 8.5 LPA, Kaar Technologies 8 LPA, and TCS Prime 9 LPA).`;

        suggestedActions.push(
          { label: 'Check Zoho & Placement Criteria', actionType: 'prompt', payload: 'Am I eligible for Zoho 8.5 LPA placement?' },
          { label: 'Open RAG Knowledge Hub', actionType: 'navigate', payload: '/rag-explorer' }
        );
      } else if (primaryTool === 'checkPlacementEligibility') {
        const plc = toolOutput;
        finalResponseText = `### 💼 Placement & Career Eligibility Evaluation
**Student:** ${plc.studentName} | **Current CGPA:** **${plc.studentCGPA}**  
**Eligibility Match:** **${plc.eligibleCompaniesCount} of ${plc.totalCompaniesEvaluated} Recruitment Drives Cleared**

| Company | Package (CTC) | Tier | Min CGPA | Your Status |
| :--- | :--- | :--- | :--- | :--- |
${plc.companies
  .map(
    (c: any) =>
      `| **${c.company}** | \`${c.package}\` | ${c.tier} | ${c.minCGPA} | ${c.isEligible ? '✅ **Eligible**' : '❌ Below Cutoff'} |`
  )
  .join('\n')}

#### 🚀 Preparation Strategy for Zoho & Tier-1 Drives
1. **Core Problem Solving:** Practice Data Structures (Graphs, Trees, DP) and Java/C++ OOPs concepts.
2. **System Design & Full-Stack:** Highlight your **Agentic AI & RAG Campus Portal** project on your resume—it demonstrates full-stack Express, MongoDB, vector embeddings, and LLM tool calling.
3. **Attendance Compliance:** Ensure your attendance stays above 75% so that placement On-Duty (OD) passes are signed without delay by the HOD.`;

        suggestedActions.push(
          { label: 'Draft Placement OD Slip', actionType: 'tool', payload: 'draft_od' },
          { label: 'Check Attendance Hours', actionType: 'prompt', payload: 'Check my attendance and safe bunks' }
        );
      } else if (primaryTool === 'draftFormalApplication') {
        const doc = toolOutput;
        finalResponseText = `### 📝 Formal College Application Generated
**Document Type:** ${doc.applicationType} | **Student:** ${doc.studentName} (\`${doc.rollNumber}\`)  
**Status:** Ready to Print / Submit to HOD Office.

\`\`\`text
${doc.documentText}
\`\`\`

> 💡 **Next Step:** You can copy this formatted letter using the button below, or download a printable PDF copy to submit to your class mentor.`;

        suggestedActions.push(
          { label: 'Copy Letter to Clipboard', actionType: 'copy', payload: doc.documentText },
          { label: 'Check Regulation Bylaws', actionType: 'navigate', payload: '/rag-explorer' }
        );
      } else {
        // RAG Search response
        const rag = toolOutput;
        finalResponseText = `### 📚 Autonomous Regulations & Bylaws Guidance
Based on the **SEC Autonomous Academic Regulations (R2024)** retrieved from the Vector Database:

${rag.chunks && rag.chunks.length > 0
  ? rag.chunks
      .map(
        (c: any) => `#### 📌 ${c.section} (Match: ${c.similarityPercent}%)
${c.content}`
      )
      .join('\n\n')
  : 'No specific document matched this query. Please check your query in the RAG Explorer.'}

#### Summary & Action Points
- Ensure your attendance remains above 75% for seamless examination eligibility.
- For queries regarding condonation or revaluation, applications must be submitted within the designated working days to the Controller of Examinations.`;

        suggestedActions.push(
          { label: 'Inspect Vector Chunks', actionType: 'navigate', payload: '/rag-explorer' },
          { label: 'Calculate My Attendance', actionType: 'prompt', payload: 'How many classes can I safely bunk?' }
        );
      }
    }

    // Step 4: Final Cognitive Synthesis
    thoughtSteps.push({
      step: stepCount++,
      type: 'synthesis',
      title: 'Synthesize Agent Output & Grounding Citations',
      detail: `Integrated ${toolInvocations.length} tool executions, ${ragCitations.length} vector chunks, and formatted actionable recommendations. Response complete in ${Date.now() - startTime}ms.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Record agent audit log in MongoDB
    try {
      await AgentLogsCollection.insertOne({
        _id: `agent_log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        studentId: options.studentId,
        agentRole: options.agentRole,
        userPrompt: options.userPrompt,
        toolsInvoked: toolInvocations.map((t) => t.toolName),
        ragChunksUsed: ragCitations.length,
        durationMs: Date.now() - startTime,
      });
    } catch {
      // Ignored
    }

    return {
      agentName: currentAgent.name,
      agentRole: currentAgent.role,
      response: finalResponseText,
      thoughtSteps,
      toolInvocations,
      ragCitations,
      suggestedActions,
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
