import api from './api';
import { SemesterRecord } from '../types';

export const MOCK_ACADEMIC_RECORDS: SemesterRecord[] = [
  {
    semester: 8,
    sgpa: 9.15,
    creditsEarned: 18,
    totalCredits: 18,
    examMonthYear: 'Apr/May 2026',
    status: 'Pass',
    subjects: [
      { code: 'CS8801', name: 'Cloud Computing & DevOps', credits: 3, internalMarks: 20, maxInternal: 20, externalMarks: 73, maxExternal: 80, totalMarks: 93, grade: 'O', result: 'Pass' },
      { code: 'CS8802', name: 'Machine Learning & AI', credits: 3, internalMarks: 19, maxInternal: 20, externalMarks: 70, maxExternal: 80, totalMarks: 89, grade: 'A+', result: 'Pass' },
      { code: 'CS8811', name: 'Project Work Phase II', credits: 8, internalMarks: 38, maxInternal: 40, externalMarks: 115, maxExternal: 120, totalMarks: 153, grade: 'O', result: 'Pass' },
      { code: 'CS8082', name: 'Software Testing & QA', credits: 2, internalMarks: 18, maxInternal: 20, externalMarks: 68, maxExternal: 80, totalMarks: 86, grade: 'A+', result: 'Pass' },
      { code: 'GE8076', name: 'Professional Ethics', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 71, maxExternal: 80, totalMarks: 90, grade: 'O', result: 'Pass' }
    ]
  },
  {
    semester: 7,
    sgpa: 8.85,
    creditsEarned: 22,
    totalCredits: 22,
    examMonthYear: 'Nov/Dec 2025',
    status: 'Pass',
    subjects: [
      { code: 'CS8791', name: 'Cloud Computing Architecture', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 68, maxExternal: 80, totalMarks: 86, grade: 'A+', result: 'Pass' },
      { code: 'CS8792', name: 'Cryptography & Network Security', credits: 3, internalMarks: 19, maxInternal: 20, externalMarks: 69, maxExternal: 80, totalMarks: 88, grade: 'A+', result: 'Pass' },
      { code: 'CS8711', name: 'Creative & Innovative Project', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 72, maxExternal: 80, totalMarks: 91, grade: 'O', result: 'Pass' },
      { code: 'CS8712', name: 'Security Laboratory', credits: 2, internalMarks: 20, maxInternal: 20, externalMarks: 76, maxExternal: 80, totalMarks: 96, grade: 'O', result: 'Pass' },
      { code: 'IT8075', name: 'Software Project Management', credits: 3, internalMarks: 17, maxInternal: 20, externalMarks: 65, maxExternal: 80, totalMarks: 82, grade: 'A', result: 'Pass' },
      { code: 'GE8071', name: 'Disaster Management', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 66, maxExternal: 80, totalMarks: 84, grade: 'A+', result: 'Pass' },
      { code: 'CS8812', name: 'Project Work Phase I', credits: 6, internalMarks: 38, maxInternal: 40, externalMarks: 112, maxExternal: 120, totalMarks: 150, grade: 'O', result: 'Pass' }
    ]
  },
  {
    semester: 6,
    sgpa: 8.90,
    creditsEarned: 24,
    totalCredits: 24,
    examMonthYear: 'Apr/May 2025',
    status: 'Pass',
    subjects: [
      { code: 'CS8651', name: 'Internet Programming', credits: 3, internalMarks: 19, maxInternal: 20, externalMarks: 70, maxExternal: 80, totalMarks: 89, grade: 'A+', result: 'Pass' },
      { code: 'CS8691', name: 'Artificial Intelligence', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 67, maxExternal: 80, totalMarks: 85, grade: 'A+', result: 'Pass' },
      { code: 'CS8601', name: 'Mobile Computing', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 68, maxExternal: 80, totalMarks: 86, grade: 'A+', result: 'Pass' },
      { code: 'CS8602', name: 'Compiler Design', credits: 4, internalMarks: 17, maxInternal: 20, externalMarks: 63, maxExternal: 80, totalMarks: 80, grade: 'A', result: 'Pass' },
      { code: 'CS8611', name: 'Internet Programming Laboratory', credits: 2, internalMarks: 20, maxInternal: 20, externalMarks: 75, maxExternal: 80, totalMarks: 95, grade: 'O', result: 'Pass' },
      { code: 'CS8612', name: 'Mobile Application Dev Lab', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 74, maxExternal: 80, totalMarks: 93, grade: 'O', result: 'Pass' },
      { code: 'HS8581', name: 'Professional Communication Lab', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 73, maxExternal: 80, totalMarks: 92, grade: 'O', result: 'Pass' },
      { code: 'CS8075', name: 'Data Warehousing & Data Mining', credits: 5, internalMarks: 18, maxInternal: 20, externalMarks: 68, maxExternal: 80, totalMarks: 86, grade: 'A+', result: 'Pass' }
    ]
  },
  {
    semester: 5,
    sgpa: 8.78,
    creditsEarned: 23,
    totalCredits: 23,
    examMonthYear: 'Nov/Dec 2024',
    status: 'Pass',
    subjects: [
      { code: 'CS8591', name: 'Computer Networks', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 66, maxExternal: 80, totalMarks: 84, grade: 'A+', result: 'Pass' },
      { code: 'CS8592', name: 'Object Oriented Analysis & Design', credits: 3, internalMarks: 17, maxInternal: 20, externalMarks: 65, maxExternal: 80, totalMarks: 82, grade: 'A', result: 'Pass' },
      { code: 'EC8691', name: 'Microprocessors & Microcontrollers', credits: 3, internalMarks: 18, maxInternal: 20, externalMarks: 64, maxExternal: 80, totalMarks: 82, grade: 'A', result: 'Pass' },
      { code: 'CS8501', name: 'Theory of Computation', credits: 4, internalMarks: 19, maxInternal: 20, externalMarks: 68, maxExternal: 80, totalMarks: 87, grade: 'A+', result: 'Pass' },
      { code: 'CS8511', name: 'Networks Laboratory', credits: 2, internalMarks: 20, maxInternal: 20, externalMarks: 76, maxExternal: 80, totalMarks: 96, grade: 'O', result: 'Pass' },
      { code: 'EC8681', name: 'Microprocessors Laboratory', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 72, maxExternal: 80, totalMarks: 91, grade: 'O', result: 'Pass' },
      { code: 'CS8582', name: 'Object Oriented Systems Lab', credits: 2, internalMarks: 19, maxInternal: 20, externalMarks: 73, maxExternal: 80, totalMarks: 92, grade: 'O', result: 'Pass' },
      { code: 'OCE551', name: 'Environment & Agriculture', credits: 4, internalMarks: 18, maxInternal: 20, externalMarks: 66, maxExternal: 80, totalMarks: 84, grade: 'A+', result: 'Pass' }
    ]
  }
];

export const academicService = {
  /**
   * GET /api/academics
   */
  getAcademicRecords: async (): Promise<{ records: SemesterRecord[]; cgpa: number; totalCreditsEarned: number }> => {
    try {
      const response = await api.get('/academics');
      return response.data;
    } catch {
      const totalCreditsEarned = MOCK_ACADEMIC_RECORDS.reduce((acc, sem) => acc + sem.creditsEarned, 0);
      const weightedSgpaSum = MOCK_ACADEMIC_RECORDS.reduce((acc, sem) => acc + (sem.sgpa * sem.creditsEarned), 0);
      const cgpa = Number((weightedSgpaSum / totalCreditsEarned).toFixed(2));
      return {
        records: MOCK_ACADEMIC_RECORDS,
        cgpa,
        totalCreditsEarned
      };
    }
  }
};

export default academicService;
