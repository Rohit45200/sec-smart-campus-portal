import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* SEC Brand Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-block p-2 bg-white rounded-xl shadow-md border border-slate-700">
                <img
                  src="/images/sect-logo.png"
                  alt="Sengunthar Engineering College"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
                  }}
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">Smart Campus Portal</span>
                <span className="text-xs text-indigo-400 font-medium">Sengunthar Engineering College (Autonomous)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai. Autonomous Institution Accredited by NAAC with 'A' Grade & NBA Accredited Courses.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://sect.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-900/60 hover:bg-indigo-800 text-[11px] font-bold text-indigo-200 border border-indigo-700 transition"
              >
                <span>sect.edu.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                NAAC 'A' Grade
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Autonomous
              </span>
            </div>
          </div>

          {/* Quick ERP Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Smart Campus Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-indigo-500">›</span> Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/attendance" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-indigo-500">›</span> Attendance Tracker
                </Link>
              </li>
              <li>
                <Link to="/academics" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-indigo-500">›</span> University Results & Marksheets
                </Link>
              </li>
              <li>
                <Link to="/notices" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-indigo-500">›</span> Official Examination Circulars
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-indigo-500">›</span> Student Profile & Credentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments & Academic Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Academic Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>Controller of Exams (CoE)</span>
                <span className="text-indigo-400 font-semibold">Extension #104</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Training & Placement Cell</span>
                <span className="text-indigo-400 font-semibold">Extension #112</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Library & Information Centre</span>
                <span className="text-indigo-400 font-semibold">Extension #108</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Student Affairs & Hostel</span>
                <span className="text-indigo-400 font-semibold">Extension #102</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Transport & Bus Desk</span>
                <span className="text-indigo-400 font-semibold">Extension #115</span>
              </li>
            </ul>
          </div>

          {/* Contact & Campus Address */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Campus Address
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Sengunthar Engineering College,<br />
                  Kosavampalayam, Kumaramangalam (PO),<br />
                  Tiruchengode - 637 205, Namakkal Dt., Tamil Nadu.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>04288 - 255716, 255726</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>info@sengunthar.ac.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            <p className="font-medium text-slate-400">
              © Copyright 2026 Sengunthar Engineering College. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              SEC Smart Campus Portal • Developed for Sengunthar Educational Institutions
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              Main Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
