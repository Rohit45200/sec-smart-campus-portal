import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Search,
  Calendar,
  FileText,
  Download,
  AlertCircle,
  Tag,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { noticeService } from '../services/noticeService';
import { Notice } from '../types';

export const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeService.getNotices();
        setNotices(data);
      } catch {
        // Fallbacks
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const categories = ['All', 'Examinations', 'Placements', 'Department', 'Events', 'Fee Notice'];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-amber-500" />
            <span>Campus Notice & Circular Bulletin</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Official announcements from Office of the Principal, Controller of Examinations, & Department Heads
          </p>
        </div>


        {/* Filter and Search Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices or circulars..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>


        {/* Notice Cards List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => {
            const isUrgent = notice.importance === 'Urgent';
            const isHigh = notice.importance === 'High';

            return (
              <motion.div
                key={notice.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Category & Date */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wide uppercase ${
                      notice.category === 'Examinations'
                        ? 'bg-purple-100 text-purple-800'
                        : notice.category === 'Placements'
                        ? 'bg-emerald-100 text-emerald-800'
                        : notice.category === 'Fee Notice'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {notice.category}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.date}
                    </span>
                  </div>

                  {/* Title & Importance Badge */}
                  <div>
                    {isUrgent && (
                      <span className="inline-block mb-1.5 px-2 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider">
                        ⚡ URGENT ANNOUNCEMENT
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {notice.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {notice.description}
                  </p>

                  {/* Author */}
                  <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                    Issued by: <span className="font-bold text-slate-700">{notice.author}</span>
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {notice.hasAttachment ? (
                    <button
                      onClick={() => alert(`Downloading attachment: ${notice.attachmentName}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Text Circular</span>
                  )}

                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600"
                  >
                    <span>Read Full</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>


        {/* Notice Detail Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                  {selectedNotice.category}
                </span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>

              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {selectedNotice.title}
              </h2>

              <div className="text-xs text-slate-500 font-medium flex items-center gap-4">
                <span>Published: {selectedNotice.date}</span>
                <span>Issuer: {selectedNotice.author}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {selectedNotice.description}
              </p>

              {selectedNotice.hasAttachment && (
                <button
                  onClick={() => alert(`Downloading attachment: ${selectedNotice.attachmentName}`)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Circular PDF ({selectedNotice.attachmentName})</span>
                </button>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Notices;
