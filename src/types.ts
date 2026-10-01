export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  rollNumber: string;
  department: string;
  year: string;
  semester: number;
  avatarUrl?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  registerNumber: string;
  department: string;
  degree: string;
  section: string;
  year: string;
  semester: number;
  batch: string;
  email: string;
  phone: string;
  dob: string;
  bloodGroup: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  mentorName: string;
  mentorContact: string;
  hostelStatus: string;
  transportBusNo?: string;
  cgpa: number;
  overallAttendance: number;
  verified: boolean;
  avatarUrl: string;
}

export interface AttendanceSubject {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
}

export interface AttendanceDailyLog {
  id: string;
  date: string;
  subjectCode: string;
  subjectName: string;
  timeSlot: string;
  status: 'Present' | 'Absent' | 'On-Duty' | 'Leave';
}

export interface Notice {
  _id?: string;
  id?: string;
  title: string;
  category: 'Examinations' | 'Placements' | 'Circular' | 'Events' | 'Fee Notice' | 'Department';
  description: string;
  date: string;
  author: string;
  importance: 'Urgent' | 'High' | 'Normal';
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  internalMarks: number;
  maxInternal: number;
  externalMarks: number;
  maxExternal: number;
  totalMarks: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA';
  result: 'Pass' | 'Fail' | 'Re-appear';
}

export interface SemesterRecord {
  semester: number;
  sgpa: number;
  creditsEarned: number;
  totalCredits: number;
  subjects: SubjectGrade[];
  examMonthYear: string;
  status: 'Pass' | 'Withheld' | 'Pending';
}

export type AgentRoleType =
  | 'omni_campus'
  | 'academic_advisor'
  | 'attendance_guardian'
  | 'career_navigator'
  | 'campus_assistant';

export interface ThoughtStep {
  step: number;
  type: 'thought' | 'action' | 'observation' | 'synthesis';
  title: string;
  detail: string;
  timestamp: string;
}

export interface ToolInvocation {
  toolName: string;
  arguments: any;
  result: any;
  durationMs: number;
}

export interface RAGCitation {
  chunkId: string;
  docTitle: string;
  section: string;
  snippet: string;
  similarity: number;
}

export interface SuggestedAction {
  label: string;
  actionType: 'prompt' | 'navigate' | 'copy' | 'tool';
  payload: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  agentRole?: string;
  content: string;
  timestamp: string;
  thoughtSteps?: ThoughtStep[];
  toolInvocations?: ToolInvocation[];
  ragCitations?: RAGCitation[];
  suggestedActions?: SuggestedAction[];
  isThinking?: boolean;
}

export interface VectorDocument {
  id: string;
  title: string;
  category: 'Regulations' | 'Placements' | 'Curriculum' | 'Hostel & Campus' | 'Examinations';
  version: string;
  effectiveDate: string;
  totalChunks: number;
  description: string;
}

export interface VectorChunk {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  section: string;
  content: string;
  tokens: number;
  tags: string[];
  embeddingLength?: number;
}

export interface VectorSearchResult {
  chunkId: string;
  docId: string;
  docTitle: string;
  category: string;
  section: string;
  content: string;
  similarity: number;
  similarityPercent: number;
  tokens: number;
  tags: string[];
  matchedTerms: string[];
}

export interface VectorDBStats {
  totalDocuments: number;
  totalChunks: number;
  vectorDimensions: number;
  similarityMetric: string;
  embeddingModels: string[];
  status: string;
  indexedCategories: string[];
}

export interface SafeBunkSubject {
  code: string;
  name: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  currentPercentage: number;
  status: string;
  safeClassesToMiss: number;
  classesNeededToReach75: number;
}

export interface SafeBunkReport {
  studentName: string;
  overallPercentage: number;
  overallSafeMissableHours: number;
  overallHoursNeededToReach75: number;
  subjects: SafeBunkSubject[];
}

export interface PlacementEligibilityCompany {
  company: string;
  package: string;
  tier: string;
  roles: string[];
  minCGPA: number;
  studentCGPA: number;
  isEligible: boolean;
  status: string;
  notes: string;
}

export interface PlacementEligibilityReport {
  studentName: string;
  studentCGPA: number;
  eligibleCompaniesCount: number;
  totalCompaniesEvaluated: number;
  companies: PlacementEligibilityCompany[];
}

export interface FormalApplicationResult {
  applicationType: string;
  studentName: string;
  rollNumber: string;
  documentText: string;
  dateGenerated: string;
  status: string;
}

export interface CGPASimulationResult {
  studentName: string;
  currentCGPA: number;
  projectedSemesterSGPA: number;
  projectedOverallCGPA: number;
  cgpaChange: string;
  eligibleTier: string;
}

export interface MongoDBStats {
  status: string;
  databaseEngine: string;
  isExternalCluster: boolean;
  databaseName: string;
  collections: {
    name: string;
    count: number;
    description: string;
  }[];
  deploymentCost: string;
}

