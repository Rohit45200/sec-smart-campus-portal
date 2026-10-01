import api from './api';
import {
  AgentChatMessage,
  AgentRoleType,
  VectorDocument,
  VectorChunk,
  VectorSearchResult,
  VectorDBStats,
  SafeBunkReport,
  PlacementEligibilityReport,
  FormalApplicationResult,
  CGPASimulationResult,
  MongoDBStats,
} from '../types';

export const aiService = {
  /**
   * Send user prompt to Autonomous Agent
   */
  chatWithAgent: async (
    prompt: string,
    agentRole: AgentRoleType = 'omni_campus',
    studentId?: string,
    chatHistory?: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<{
    agentName: string;
    agentRole: string;
    response: string;
    thoughtSteps: any[];
    toolInvocations: any[];
    ragCitations: any[];
    suggestedActions?: any[];
  }> => {
    const res = await api.post(
      '/agent/chat',
      {
        prompt,
        agentRole,
        studentId,
        chatHistory,
      },
      { timeout: 35000 }
    );
    return res.data;
  },

  /**
   * Semantic Vector Search over Knowledge Base (RAG)
   */
  searchRAG: async (
    query: string,
    category?: string,
    topK: number = 4
  ): Promise<{
    query: string;
    resultsCount: number;
    results: VectorSearchResult[];
  }> => {
    const res = await api.post('/rag/search', { query, category, topK });
    return res.data;
  },

  /**
   * Get all indexed RAG documents and Vector DB statistics
   */
  getRAGDocuments: async (): Promise<{
    documents: VectorDocument[];
    stats: VectorDBStats;
  }> => {
    const res = await api.get('/rag/documents');
    return res.data;
  },

  /**
   * Get all chunks for a document or all documents
   */
  getRAGChunks: async (docId?: string): Promise<{ count: number; chunks: VectorChunk[] }> => {
    const res = await api.get('/rag/chunks', { params: { docId } });
    return res.data;
  },

  /**
   * Get Safe Bunk & Attendance Projection Analytics
   */
  getSafeBunkReport: async (studentId?: string, subjectCode?: string): Promise<SafeBunkReport> => {
    const res = await api.get('/attendance/safe-bunk', {
      params: { studentId, subjectCode },
    });
    return res.data;
  },

  /**
   * Check Placement Eligibility against Top Companies
   */
  checkPlacementEligibility: async (
    studentId?: string,
    companyName?: string
  ): Promise<PlacementEligibilityReport> => {
    const res = await api.post('/tools/execute', {
      toolName: 'checkPlacementEligibility',
      args: { studentId: studentId || 'usr_rohit_2026', companyName },
    });
    return res.data.result;
  },

  /**
   * Run CGPA What-If Simulation
   */
  simulateCGPA: async (
    studentId: string,
    targetGrades: { subjectCode: string; grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA'; credits: number }[]
  ): Promise<CGPASimulationResult> => {
    const res = await api.post('/tools/execute', {
      toolName: 'simulateCGPAPrediction',
      args: { studentId, targetGrades },
    });
    return res.data.result;
  },

  /**
   * Draft Formal College Application (On-Duty / Medical Condonation / Reval / Gate Pass)
   */
  draftApplication: async (
    applicationType: 'On-Duty' | 'Medical Condonation' | 'Re-evaluation Request' | 'Hostel Gate Pass',
    studentId: string,
    reason: string,
    dates: string,
    eventOrSubject: string
  ): Promise<FormalApplicationResult> => {
    const res = await api.post('/tools/execute', {
      toolName: 'draftFormalApplication',
      args: { applicationType, studentId, reason, dates, eventOrSubject },
    });
    return res.data.result;
  },

  /**
   * Get MongoDB Database Engine & Collections Diagnosis Stats ($0 cost)
   */
  getMongoStats: async (): Promise<MongoDBStats> => {
    const res = await api.get('/mongodb/stats');
    return res.data;
  },

  /**
   * Get Demo Accounts for instant 1-click test switching
   */
  getDemoUsers: async (): Promise<{ accounts: any[] }> => {
    const res = await api.get('/auth/demo-users');
    return res.data;
  },
};

export default aiService;
