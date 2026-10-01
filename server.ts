import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  StudentsCollection,
  AttendanceCollection,
  DailyLogsCollection,
  NoticesCollection,
  AcademicRecordsCollection,
  AgentLogsCollection,
  getDbStats,
  mongoState,
} from './server/db/mongo';
import { vectorStore } from './server/services/vectorStore';
import { agentOrchestrator, CAMPUS_TOOLS } from './server/services/agentOrchestrator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS & Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Helper to extract student ID from header or query or default
const getStudentIdFromReq = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.includes('Bearer')) {
    const token = authHeader.split(' ')[1];
    if (token.includes('karthik')) return 'usr_karthik_2026';
    if (token.includes('pooja')) return 'usr_pooja_2026';
    if (token.includes('rohit')) return 'usr_rohit_2026';
  }
  return (req.query.studentId as string) || (req.body?.studentId as string) || 'usr_rohit_2026';
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email = '', password, role = 'student' } = req.body;

    if (role === 'faculty' || email.includes('senthilkumar') || email.includes('faculty')) {
      const token = `sec_jwt_faculty_${Date.now()}`;
      return res.json({
        success: true,
        token,
        user: {
          id: 'usr_faculty_senthil',
          name: 'Dr. M. Senthilkumar',
          email: email || 'senthilkumar.cse@sengunthar.ac.in',
          role: 'faculty',
          rollNumber: 'FAC-CSE-012',
          department: 'Computer Science & Engineering',
          designation: 'Professor & Head of Department',
          year: 'Faculty Member',
          semester: 8,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        },
      });
    }

    if (role === 'admin' || email.includes('admin')) {
      const token = `sec_jwt_admin_${Date.now()}`;
      return res.json({
        success: true,
        token,
        user: {
          id: 'usr_admin_sec',
          name: 'Er. K. Duraisamy (ERP Admin)',
          email: email || 'admin.erp@sengunthar.ac.in',
          role: 'admin',
          rollNumber: 'ADM-SEC-001',
          department: 'Office of Controller of Examinations',
          designation: 'Chief ERP & Systems Director',
          year: 'Administration',
          semester: 0,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        },
      });
    }

    const allStudents = await StudentsCollection.find();
    let matchedStudent = allStudents.find((s) => s.email.toLowerCase() === (email || '').toLowerCase());

    if (!matchedStudent) {
      if (email && email.includes('karthik')) {
        matchedStudent = allStudents.find((s) => s.id === 'usr_karthik_2026');
      } else if (email && email.includes('pooja')) {
        matchedStudent = allStudents.find((s) => s.id === 'usr_pooja_2026');
      } else {
        matchedStudent = allStudents[0]; // Rohit Kumar
      }
    }

    const token = `sec_jwt_${matchedStudent?.id || 'demo'}_${Date.now()}`;

    res.json({
      success: true,
      token,
      user: {
        id: matchedStudent?.id || 'usr_rohit_2026',
        name: matchedStudent?.name || 'Rohit Kumar',
        email: matchedStudent?.email || email || 'rohit.22cse@sengunthar.ac.in',
        role: 'student',
        rollNumber: matchedStudent?.rollNumber || '22CSE045',
        department: matchedStudent?.department || 'Computer Science & Engineering',
        year: matchedStudent?.year || '4th Year',
        semester: matchedStudent?.semester || 8,
        avatarUrl: matchedStudent?.avatarUrl,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Demo Users switcher endpoint
app.get('/api/auth/demo-users', async (_req: Request, res: Response) => {
  try {
    const students = await StudentsCollection.find();
    const demoAccounts = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber,
      department: s.department,
      semester: s.semester,
      cgpa: s.cgpa,
      attendance: s.overallAttendance,
      avatarUrl: s.avatarUrl,
      highlight: s.id === 'usr_rohit_2026'
        ? 'Project Author (CSE 4th Year, 8.84 CGPA)'
        : s.id === 'usr_pooja_2026'
        ? 'AI & DS 3rd Year (74.2% Attendance Alert)'
        : 'CSE Final Year (8.92 CGPA, Kaveri Hostel)',
    }));

    res.json({ accounts: demoAccounts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Student Profile Endpoints
// -------------------------------------------------------------

app.get('/api/student/profile', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    let student = await StudentsCollection.findOne({ id: studentId });
    if (!student) {
      student = (await StudentsCollection.find())[0];
    }
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/student/profile', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    const updates = req.body;
    await StudentsCollection.updateOne({ id: studentId }, updates);
    const updated = await StudentsCollection.findOne({ id: studentId });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Attendance Endpoints
// -------------------------------------------------------------

app.get('/api/attendance', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    let subjects = await AttendanceCollection.find({ studentId });

    if (subjects.length === 0) {
      // Fallback to first student's records
      subjects = await AttendanceCollection.find({ studentId: 'usr_rohit_2026' });
    }

    const totalClasses = subjects.reduce((a, b) => a + b.totalClasses, 0);
    const totalAttended = subjects.reduce((a, b) => a + b.attendedClasses, 0);
    const overallPercentage = Number(((totalAttended / (totalClasses || 1)) * 100).toFixed(2));

    const sanitizedSubjects = subjects.map((s, idx) => ({
      ...s,
      id: (s as any).id || s._id || s.code || `subj_${idx}`,
    }));

    res.json({
      subjects: sanitizedSubjects,
      overallPercentage,
      totalClasses,
      totalAttended,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/attendance/logs', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    let logs = await DailyLogsCollection.find({ studentId });
    if (logs.length === 0) {
      logs = await DailyLogsCollection.find({ studentId: 'usr_rohit_2026' });
    }
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Safe Bunk & Attendance Projection Analytics
app.get('/api/attendance/safe-bunk', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    const analytics = await CAMPUS_TOOLS.calculateAttendanceAnalytics({
      studentId,
      subjectCode: req.query.subjectCode as string,
    });
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Academic Records Endpoints
// -------------------------------------------------------------

app.get('/api/academics', async (req: Request, res: Response) => {
  try {
    const studentId = getStudentIdFromReq(req);
    let student = await StudentsCollection.findOne({ id: studentId });
    if (!student) student = (await StudentsCollection.find())[0];

    let records = await AcademicRecordsCollection.find({ studentId: student.id });
    if (records.length === 0) {
      records = await AcademicRecordsCollection.find({ studentId: 'usr_rohit_2026' });
    }

    const totalCredits = records.reduce((a, b) => a + b.totalCredits, 0);
    const earnedCredits = records.reduce((a, b) => a + b.creditsEarned, 0);

    res.json({
      records,
      cgpa: student.cgpa,
      totalCredits,
      earnedCredits,
      standingArrears: 0,
      clearedArrears: 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Notices & Circulars Endpoints
// -------------------------------------------------------------

app.get('/api/notices', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    let list = await NoticesCollection.find();
    if (category && category !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }
    const sanitizedList = list.map((n, idx) => ({
      ...n,
      id: (n as any).id || n._id || `notice_${idx}`,
    }));
    res.json(sanitizedList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Autonomous Agent Copilot & Multi-Agent Execution Endpoint
// -------------------------------------------------------------

app.post('/api/agent/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, agentRole = 'omni_campus', studentId: explicitId, chatHistory } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt string is required' });
      return;
    }

    const studentId = explicitId || getStudentIdFromReq(req);

    const result = await agentOrchestrator.runAgent({
      studentId,
      agentRole,
      userPrompt: prompt,
      chatHistory,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Agent chat error:', err);
    res.status(500).json({
      error: err.message || 'Agent failed to process request',
      agentName: 'SEC Campus AI Copilot',
      response: 'An unexpected error occurred while processing your request. Please try again.',
      thoughtSteps: [],
      toolInvocations: [],
      ragCitations: [],
    });
  }
});

// -------------------------------------------------------------
// RAG Vector Database & Search Endpoints
// -------------------------------------------------------------

app.post('/api/rag/search', async (req: Request, res: Response) => {
  try {
    const { query, category, topK = 4, minScore = 0.1 } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const results = await vectorStore.search(query, { category, topK, minScore });

    res.json({
      query,
      resultsCount: results.length,
      results: results.map((r) => ({
        chunkId: r.chunk.id,
        docId: r.chunk.docId,
        docTitle: r.chunk.docTitle,
        category: r.chunk.category,
        section: r.chunk.section,
        content: r.chunk.content,
        similarity: r.similarity,
        similarityPercent: Math.round(r.similarity * 100),
        tokens: r.chunk.tokens,
        tags: r.chunk.tags,
        matchedTerms: r.matchedTerms,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rag/documents', async (_req: Request, res: Response) => {
  try {
    const docs = vectorStore.getAllDocuments();
    const stats = vectorStore.getStats();
    res.json({ documents: docs, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rag/chunks', async (req: Request, res: Response) => {
  try {
    const docId = req.query.docId as string;
    const chunks = vectorStore.getAllChunks(docId);
    res.json({
      count: chunks.length,
      chunks: chunks.map((c) => ({
        id: c.id,
        docId: c.docId,
        docTitle: c.docTitle,
        category: c.category,
        section: c.section,
        content: c.content,
        tokens: c.tokens,
        tags: c.tags,
        embeddingLength: c.embedding.length,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Deterministic Campus Tools Execution API
// -------------------------------------------------------------

app.post('/api/tools/execute', async (req: Request, res: Response) => {
  try {
    const { toolName, args } = req.body;
    if (!toolName) {
      res.status(400).json({ error: 'toolName is required' });
      return;
    }

    const output = await agentOrchestrator.executeTool(toolName, args || {});
    res.json({ toolName, success: true, result: output });
  } catch (err: any) {
    res.status(500).json({ toolName: req.body?.toolName, error: err.message });
  }
});

// -------------------------------------------------------------
// MongoDB Stats & System Diagnosis
// -------------------------------------------------------------

app.get('/api/mongodb/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getDbStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Vite Middlewares in Dev / Static Serving in Production
// -------------------------------------------------------------

const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SEC Smart Campus Server listening on http://0.0.0.0:${PORT}`);
  });
};

startServer();
