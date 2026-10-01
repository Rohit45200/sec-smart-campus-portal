import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile } from '../types';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  login: (email: string, password: string, role?: 'student' | 'faculty' | 'admin') => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        try {
          const prof = await studentService.getProfile();
          setProfile(prof);
        } catch {
          // ignore profile fetch failure on init
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'faculty' | 'admin' = 'student') => {
    setLoading(true);
    try {
      const result = await authService.login(email, password, role);
      setUser(result.user);
      const prof = await studentService.getProfile();
      setProfile(prof);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await studentService.getProfile();
      setProfile(prof);
    }
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    const updated = await studentService.updateProfile(data);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
