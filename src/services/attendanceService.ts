import api from './api';
import { AttendanceSubject, AttendanceDailyLog } from '../types';

export const MOCK_ATTENDANCE_SUBJECTS: AttendanceSubject[] = [
  {
    id: 'att_01',
    code: 'CS8801',
    name: 'Cloud Computing & DevOps',
    faculty: 'Dr. K. Ramesh (Prof / CSE)',
    totalClasses: 48,
    attendedClasses: 45,
    percentage: 93.75,
    lastUpdated: '2026-08-07',
  },
  {
    id: 'att_02',
    code: 'CS8802',
    name: 'Machine Learning & AI',
    faculty: 'Dr. P. Sangeetha (Assoc. Prof / CSE)',
    totalClasses: 52,
    attendedClasses: 48,
    percentage: 92.31,
    lastUpdated: '2026-08-07',
  },
  {
    id: 'att_03',
    code: 'CS8811',
    name: 'Project Work Phase II',
    faculty: 'Dr. M. Senthilkumar (Assoc. Prof / CSE)',
    totalClasses: 60,
    attendedClasses: 58,
    percentage: 96.67,
    lastUpdated: '2026-08-06',
  },
  {
    id: 'att_04',
    code: 'CS8082',
    name: 'Software Testing & QA',
    faculty: 'Mrs. R. Priya (Asst. Prof / CSE)',
    totalClasses: 40,
    attendedClasses: 35,
    percentage: 87.50,
    lastUpdated: '2026-08-05',
  },
  {
    id: 'att_05',
    code: 'GE8076',
    name: 'Professional Ethics in Engineering',
    faculty: 'Mr. V. Anand (Asst. Prof / English)',
    totalClasses: 32,
    attendedClasses: 30,
    percentage: 93.75,
    lastUpdated: '2026-08-04',
  },
];

export const MOCK_DAILY_LOGS: AttendanceDailyLog[] = [
  { id: 'log_01', date: '2026-08-07', subjectCode: 'CS8801', subjectName: 'Cloud Computing & DevOps', timeSlot: '09:00 AM - 10:00 AM', status: 'Present' },
  { id: 'log_02', date: '2026-08-07', subjectCode: 'CS8802', subjectName: 'Machine Learning & AI', timeSlot: '10:15 AM - 11:15 AM', status: 'Present' },
  { id: 'log_03', date: '2026-08-07', subjectCode: 'CS8811', subjectName: 'Project Work Phase II', timeSlot: '11:30 AM - 01:00 PM', status: 'Present' },
  { id: 'log_04', date: '2026-08-06', subjectCode: 'CS8082', subjectName: 'Software Testing & QA', timeSlot: '01:45 PM - 02:45 PM', status: 'On-Duty' },
  { id: 'log_05', date: '2026-08-06', subjectCode: 'GE8076', subjectName: 'Professional Ethics', timeSlot: '03:00 PM - 04:00 PM', status: 'Present' },
  { id: 'log_06', date: '2026-08-05', subjectCode: 'CS8801', subjectName: 'Cloud Computing & DevOps', timeSlot: '09:00 AM - 10:00 AM', status: 'Present' },
  { id: 'log_07', date: '2026-08-05', subjectCode: 'CS8802', subjectName: 'Machine Learning & AI', timeSlot: '10:15 AM - 11:15 AM', status: 'Absent' },
  { id: 'log_08', date: '2026-08-04', subjectCode: 'CS8811', subjectName: 'Project Work Phase II', timeSlot: '11:30 AM - 01:00 PM', status: 'Present' },
];

export const attendanceService = {
  /**
   * GET /api/attendance
   */
  getAttendance: async (): Promise<{ subjects: AttendanceSubject[]; overallPercentage: number; totalClasses: number; totalAttended: number }> => {
    try {
      const response = await api.get('/attendance');
      return response.data;
    } catch {
      const totalClasses = MOCK_ATTENDANCE_SUBJECTS.reduce((acc, curr) => acc + curr.totalClasses, 0);
      const totalAttended = MOCK_ATTENDANCE_SUBJECTS.reduce((acc, curr) => acc + curr.attendedClasses, 0);
      const overallPercentage = Number(((totalAttended / totalClasses) * 100).toFixed(2));
      return {
        subjects: MOCK_ATTENDANCE_SUBJECTS,
        overallPercentage,
        totalClasses,
        totalAttended
      };
    }
  },

  /**
   * GET /api/attendance/logs
   */
  getAttendanceLogs: async (): Promise<AttendanceDailyLog[]> => {
    try {
      const response = await api.get('/attendance/logs');
      return response.data;
    } catch {
      return MOCK_DAILY_LOGS;
    }
  }
};

export default attendanceService;
