import api from './api';
import { StudentProfile } from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  id: 'usr_rohit_2026',
  name: 'Rohit Kumar',
  rollNumber: '22CSE045',
  registerNumber: '732922104045',
  department: 'Computer Science & Engineering',
  degree: 'B.E. Computer Science and Engineering',
  section: 'A',
  year: '4th Year (Final Year)',
  semester: 8,
  batch: '2022 - 2026',
  email: 'rohit.22cse@sengunthar.ac.in',
  phone: '+91 98421 88721',
  dob: '2004-06-18',
  bloodGroup: 'O+ Positive',
  address: 'Plot No. 42, Green Park Avenue, Tiruchengode, Tamil Nadu - 637205',
  guardianName: 'Mr. R. Kumar (Father)',
  guardianPhone: '+91 94432 99812',
  mentorName: 'Dr. M. Senthilkumar, M.E., Ph.D. (HOD)',
  mentorContact: 'senthilkumar.m@sengunthar.ac.in',
  hostelStatus: 'Day Scholar',
  transportBusNo: 'Bus Route No. 12 (Erode - SEC Campus)',
  cgpa: 8.84,
  overallAttendance: 91.8,
  verified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
};

export const studentService = {
  /**
   * Fetch student profile
   * GET /api/student/profile
   */
  getProfile: async (): Promise<StudentProfile> => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch {
      // Return cached/local profile or INITIAL_PROFILE
      const saved = localStorage.getItem('sec_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
      return INITIAL_PROFILE;
    }
  },

  /**
   * Update student profile
   * PUT /api/student/profile
   */
  updateProfile: async (updatedData: Partial<StudentProfile>): Promise<StudentProfile> => {
    try {
      const response = await api.put('/student/profile', updatedData);
      return response.data;
    } catch {
      const current = await studentService.getProfile();
      const updated = { ...current, ...updatedData };
      localStorage.setItem('sec_student_profile', JSON.stringify(updated));
      return updated;
    }
  }
};

export default studentService;
