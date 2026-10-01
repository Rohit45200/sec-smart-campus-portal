import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Search,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Layers,
  Cpu,
  Shield,
  FileText,
  Clock,
  Code2,
  Tag,
  ArrowRight,
  BarChart2,
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { VectorDocument, VectorChunk, VectorSearchResult, VectorDBStats } from '../types';
import { Link } from 'react-router-dom';

const SAMPLE_QUERIES = [
  'What is the minimum attendance required for writing end semester exams?',
  'What is the condonation fee and rule for 65% to 74% attendance?',
  'What are the eligibility criteria and salary package for Zoho Corporation?',
  'What is the evaluation weightage and passing marks for Capstone Project Work Phase II?',
  'What are the Kaveri and Bhavani hostel gate closure timings?',
];

export const RAGExplorer: React.FC = () => {
  const [documents, setDocuments] = useState<VectorDocument[]>([]);
  const [stats, setStats] = useState<VectorDBStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('attendance condonation 65% rule');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchResults, setSearchResults] = useState<VectorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'documents' | 'architecture'>('search');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docChunks, setDocChunks] = useState<VectorChunk[]>([]);
  const [loadingChunks, setLoadingChunks] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await aiService.getRAGDocuments();
        setDocuments(data.documents);
        setStats(data.stats);
        if (data.documents.length > 0) {
          setSelectedDocId(data.documents[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch RAG docs:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch chunks when selected document changes
  useEffect(() => {
    if (!selectedDocId) return;
    const fetchChunks = async () => {
      setLoadingChunks(true);
      try {
        const data = await aiService.getRAGChunks(selectedDocId);
        setDocChunks(data.chunks);
      } catch (err) {
        console.error('Failed to load chunks:', err);
      } finally {
        setLoadingChunks(false);
      }
    };
    fetchChunks();
  }, [selectedDocId]);

  // Execute Semantic Search
  const handleSearch = async (queryToRun?: string) => {
    const q = queryToRun || searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    try {
      const data = await aiService.searchRAG(q.trim(), selectedCategory, 4);
      setSearchResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Run initial search
  useEffect(() => {
    handleSearch('attendance condonation 65% rule');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>RAG Architecture • Vector Database • Cosine Similarity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                RAG Knowledge Hub & Vector Explorer
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl">
                Explore real-time semantic retrieval over SEC Autonomous Regulations, Placement Policies, and Syllabi. Test live embedding vector similarity queries with token inspection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/agent"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Open Agent Copilot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Vector DB Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Indexed Documents
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats?.totalDocuments || documents.length || 4}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Regulations, Placements, Curriculum
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Vector Chunks
            </div>
            <div className="text-2xl font-black text-indigo-600">
              {stats?.totalChunks || 14} Chunks
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Semantic sub-document units
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Similarity Metric
            </div>
            <div className="text-base font-extrabold text-purple-700 truncate">
              Cosine Similarity
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Normalized Unit Vector Dot Product
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Infrastructure Cost
            </div>
            <div className="text-2xl font-black text-emerald-600">
              $0.00 / mo
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              100% Free-Tier & Zero Cost Optimized
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Semantic Search</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Base Docs</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RAG Architecture</span>
          </button>
        </div>

        {/* TAB 1: Semantic Search Testbench */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            
            {/* Search Input Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter semantic query (e.g., 'What happens if attendance is 72%?')"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  >
                    <option value="All">All Categories</option>
                    <option value="Regulations">Regulations</option>
                    <option value="Placements">Placements</option>
                    <option value="Curriculum">Curriculum</option>
                    <option value="Hostel & Campus">Hostel & Campus</option>
                  </select>

                  <button
                    onClick={() => handleSearch()}
                    disabled={isSearching}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSearching ? <span>Embedding...</span> : <span>Run Vector Search</span>}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sample Queries Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400">Quick Testbench:</span>
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(sq);
                      handleSearch(sq);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-[11px] font-medium rounded-lg transition-colors border border-slate-200/80"
                  >
                    {sq.length > 45 ? `${sq.slice(0, 45)}...` : sq}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Top-K Retrieved Chunks from Vector Space</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {searchResults.length} Chunks Retrieved
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                  <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold">No vector chunks matched your search parameters.</p>
                  <p className="text-[11px]">Try adjusting the query or select "All Categories".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result, idx) => (
                    <motion.div
                      key={result.chunkId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Match Bar */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {result.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-mono">
                              Chunk #{result.chunkId}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                              {result.similarityPercent}% Cosine Match
                            </span>
                          </div>
                        </div>

                        {/* Title & Section */}
                        <div>
                          <div className="text-[11px] font-bold text-slate-400">
                            {result.docTitle}
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                            {result.section}
                          </h4>
                        </div>

                        {/* Chunk Content */}
                        <div className="p-3.5 bg-slate-50/80 rounded-2xl text-[11px] text-slate-700 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-100">
                          {result.content}
                        </div>
                      </div>

                      {/* Tags & Metadata */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((t, ti) => (
                            <span key={ti} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono">{result.tokens} tokens</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Knowledge Base Documents & Chunks */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Document List (1 col) */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
                Indexed College Documents ({documents.length})
              </h3>

              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/15'
                          : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {doc.totalChunks} Chunks
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                        {doc.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Chunks Viewer (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Document Chunks & Vector Metadata ({docChunks.length})
                </h3>
              </div>

              {loadingChunks ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                  <Cpu className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span className="text-xs font-bold">Loading vector chunks from MongoDB store...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {docChunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-indigo-900">{chunk.section}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {chunk.id} • {chunk.tokens} tokens
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                        {chunk.content}
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {chunk.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: RAG Architecture & Resume Flowchart */}
        {activeTab === 'architecture' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                System Blueprint
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Full-Stack RAG & Agentic Architecture Overview
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Designed to run 100% on zero-cost infrastructure without requiring paid vector database clusters or API charges.
              </p>
            </div>

            {/* Step-by-Step Pipeline Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">Document Chunking</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  SEC Regulations, Syllabi, and Policies are segmented into contextual chunks with sliding window token overlap and metadata tags.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">Vector Embeddings</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Generates dense semantic vector embeddings via <code className="text-purple-700 font-mono">gemini-embedding-2-preview</code> with sublinear term-frequency normalization.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">Cosine Similarity Search</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Incoming student questions are vectorized, and top-K nearest neighbors are retrieved using normalized dot product distance metrics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">Agentic ReAct Loop</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Gemini 3.8 Flash receives retrieved chunks + student biometric data, executing function calls and outputting verified solutions.
                </p>
              </div>
            </div>

            {/* Recruiter Talking Points */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900">
                Key Technical Bullets for Rohit's Resume
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>
                  <strong className="text-slate-800">Agentic AI & Tool Calling:</strong> Implemented autonomous multi-agent ReAct orchestration using Gemini 3.8 Flash to evaluate attendance eligibility, calculate safe bunks, and simulate semester CGPA.
                </li>
                <li>
                  <strong className="text-slate-800">RAG & Vector Retrieval:</strong> Built an in-memory & persistent cosine similarity vector database indexing Autonomous Regulation bylaws with multi-turn citation grounding.
                </li>
                <li>
                  <strong className="text-slate-800">Zero-Cost Full-Stack Architecture:</strong> Engineered Express.js, React 19, and MongoDB document collection layer running at $0.00/month hosting expense.
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default RAGExplorer;
