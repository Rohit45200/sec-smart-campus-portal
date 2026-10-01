import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Notices from './pages/Notices';
import AcademicRecords from './pages/AcademicRecords';
import SmartCampusAgent from './pages/SmartCampusAgent';
import RAGExplorer from './pages/RAGExplorer';
import ToolWorkbench from './pages/ToolWorkbench';
import FacultyPortal from './pages/FacultyPortal';
import AdminPortal from './pages/AdminPortal';
import Timetable from './pages/Timetable';
import FeesPortal from './pages/FeesPortal';
import HallTicket from './pages/HallTicket';

/**
 * Root Entry Controller:
 * Directs unauthenticated visitors immediately to the official SEC Login portal.
 * Directs authenticated users to the Campus Dashboard / Overview.
 */
function RootEntry() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white pb-16 sm:pb-0">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Root & Authentication Routes */}
              <Route path="/" element={<RootEntry />} />
              <Route path="/login" element={<Login />} />
              <Route path="/notices" element={<Notices />} />

              {/* Protected Agentic AI & RAG Routes */}
              <Route
                path="/agent"
                element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <SmartCampusAgent />
                  </ProtectedRoute>
                }
              />
              <Route path="/copilot" element={<Navigate to="/agent" replace />} />
              <Route
                path="/rag-explorer"
                element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <RAGExplorer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <ToolWorkbench />
                  </ProtectedRoute>
                }
              />

              {/* Protected Student & Faculty Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/academics"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <AcademicRecords />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timetable"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Timetable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fees"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <FeesPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hall-ticket"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <HallTicket />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* Catch all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
