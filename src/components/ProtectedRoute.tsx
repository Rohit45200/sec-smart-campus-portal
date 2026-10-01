import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import { ShieldAlert, ArrowLeft, Users } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'faculty' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader message="Verifying authentication credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const isStudentTryingFacultyOrAdmin = user.role === 'student';
    const isFacultyTryingAdmin = user.role === 'faculty';

    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
              Access Restricted • 403 Forbidden
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Unauthorized Portal Area
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              Your active account has role <strong className="font-black text-slate-900 uppercase">[{user.role}]</strong> ({user.name}).
              This section is strictly restricted to: <strong className="text-indigo-600 font-extrabold">{allowedRoles.join(', ').toUpperCase()}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs space-y-2 border border-slate-200/80">
            <div className="font-extrabold text-slate-700 flex items-center justify-between">
              <span>SEC Access Security Policy</span>
              <span className="text-[10px] text-slate-400 font-mono">RBAC-ENFORCED</span>
            </div>
            <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-1.5">
              {isStudentTryingFacultyOrAdmin && (
                <li className="text-rose-700 font-medium">
                  Students cannot access Faculty, HOD, or Central Admin management portals.
                </li>
              )}
              {isFacultyTryingAdmin && (
                <li className="text-rose-700 font-medium">
                  Teaching Faculty cannot access Central Admin configuration settings.
                </li>
              )}
              <li className="text-slate-500">
                Only Central Administrators have universal cross-portal access permissions.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to={user.role === 'faculty' ? '/faculty' : user.role === 'admin' ? '/admin' : '/dashboard'}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to {user.role === 'faculty' ? 'Faculty & HOD Portal' : user.role === 'admin' ? 'Admin Console' : 'Student Dashboard'}</span>
            </Link>

            <div className="text-[11px] text-slate-400 pt-1">
              Want to test other roles? Use the <span className="font-bold text-slate-600">"Switch"</span> menu in the top navigation bar.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
