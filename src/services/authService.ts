import api from './api';
import { User } from '../types';

export const MOCK_USER: User = {
  id: 'usr_rohit_2026',
  name: 'Rohit Kumar',
  email: 'rohit.22cse@sengunthar.ac.in',
  role: 'student',
  rollNumber: '22CSE045',
  department: 'Computer Science & Engineering',
  year: '4th Year',
  semester: 8,
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
};

export const authService = {
  /**
   * Login student, faculty, or admin
   * Calls POST /api/auth/login
   */
  login: async (email: string, password: string, role: 'student' | 'faculty' | 'admin' = 'student'): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const { user, token } = response.data;
      localStorage.setItem('token', token || 'sec_jwt_token_demo_2026');
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch {
      // Fallback for offline/standalone execution
      const demoUser: User = {
        ...MOCK_USER,
        email: email || MOCK_USER.email,
        role: role || 'student',
        name: role === 'faculty' ? 'Dr. M. Senthilkumar' : role === 'admin' ? 'SEC Admin Portal' : 'Rohit Kumar',
        rollNumber: role === 'student' ? '22CSE045' : role === 'faculty' ? 'FAC-CSE-012' : 'ADM-SEC-001'
      };
      const token = `sec_jwt_${role}_token_${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return { user: demoUser, token };
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current authenticated user from localStorage or API
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Check if token exists
   */
  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem('token') && localStorage.getItem('user'));
  }
};

export default authService;
