import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading Campus Data...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-indigo-700">
          <GraduationCap className="w-7 h-7" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">SEC Smart Campus</h3>
        <p className="text-xs text-slate-500 mt-0.5">{message}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-xs w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loader;
