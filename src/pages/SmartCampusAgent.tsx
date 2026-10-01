import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Cpu,
  Database,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Shield,
  Briefcase,
  Calendar,
  AlertTriangle,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { AgentChatMessage, AgentRoleType, ThoughtStep, ToolInvocation, RAGCitation } from '../types';
import { Link } from 'react-router-dom';

const AGENT_PERSONAS: {
  id: AgentRoleType;
  name: string;
  shortName: string;
  role: string;
  badge: string;
  color: string;
  icon: any;
  description: string;
}[] = [
  {
    id: 'omni_campus',
    name: 'SEC Campus AI Copilot',
    shortName: 'Campus Copilot',
    role: 'Autonomous Master AI Campus Orchestrator',
    badge: 'Multi-Agent',
    color: 'from-blue-600 via-indigo-600 to-purple-600',
    icon: Sparkles,
    description: 'Autonomous orchestrator combining attendance analytics, regulations RAG, and placement intelligence.',
  },
  {
    id: 'attendance_guardian',
    name: 'Attendance & Safe-Bunk Guardian',
    shortName: 'Attendance Guardian',
    role: '75% Rule Compliance & Safe Misses Calculator',
    badge: 'Regulation R2024',
    color: 'from-emerald-600 to-teal-700',
    icon: Calendar,
    description: 'Calculates safe missable hours, condonation eligibility, and drafts official OD passes.',
  },
  {
    id: 'academic_advisor',
    name: 'Academic & CGPA Advisor Agent',
    shortName: 'Academic Advisor',
    role: 'Course Strategy, Grade Predictions & CIA Advisor',
    badge: 'Autonomous Curriculum',
    color: 'from-indigo-600 to-blue-700',
    icon: BookOpen,
    description: 'Simulates what-if CGPA predictions, semester credits, and exam passing targets.',
  },
  {
    id: 'career_navigator',
    name: 'Placement & Career Navigator',
    shortName: 'Career Navigator',
    role: 'Tier 1/2 Recruiter Eligibility & Interview Coach',
    badge: 'Placement Cell',
    color: 'from-violet-600 to-purple-700',
    icon: Briefcase,
    description: 'Evaluates eligibility against Zoho, TCS, and Amazon, matching student skillsets.',
  },
  {
    id: 'campus_assistant',
    name: 'Campus Life & Hostel Assistant',
    shortName: 'Campus Life',
    role: 'Hostel Bylaws, Gate Passes & Administrative FAQs',
    badge: 'Campus Admin',
    color: 'from-amber-600 to-orange-700',
    icon: Shield,
    description: 'Handles Kaveri/Bhavani hostel timings, gate pass generation, and anti-ragging bylaws.',
  },
];

const PROMPT_SUGGESTIONS = [
  {
    title: 'Calculate Safe Bunks',
    prompt: 'How many classes can I safely bunk in Cloud Computing and other subjects without dropping below 75%?',
    agent: 'attendance_guardian' as AgentRoleType,
  },
  {
    title: 'Simulate CGPA What-If',
    prompt: 'Simulate my CGPA if I get Outstanding (O) in Capstone Project Phase II and A+ in other subjects.',
    agent: 'academic_advisor' as AgentRoleType,
  },
  {
    title: 'Zoho 8.5 LPA Eligibility',
    prompt: 'Am I eligible for Zoho Corporation campus recruitment? What are their CGPA and backlog requirements?',
    agent: 'career_navigator' as AgentRoleType,
  },
  {
    title: 'Draft On-Duty (OD) Form',
    prompt: 'Draft an official On-Duty (OD) application for attending the Smart India Hackathon internal round.',
    agent: 'attendance_guardian' as AgentRoleType,
  },
  {
    title: 'Condonation & Medical Rule',
    prompt: 'What does Autonomous Regulation 2024 say about attendance condonation between 65% and 74%?',
    agent: 'omni_campus' as AgentRoleType,
  },
];

export const SmartCampusAgent: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AgentRoleType>('omni_campus');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedThought, setExpandedThought] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message once on mount
  useEffect(() => {
    const studentName = profile?.name || user?.name || 'Rohit Kumar';
    const activePersona = AGENT_PERSONAS.find((p) => p.id === selectedRole) || AGENT_PERSONAS[0];

    const initialGreeting: AgentChatMessage = {
      id: `welcome_${selectedRole}`,
      sender: 'agent',
      agentName: activePersona.name,
      agentRole: activePersona.role,
      content: `Hello **${studentName}**! 👋 I am your **${activePersona.name}**.
I am equipped with autonomous **ReAct multi-step reasoning**, real-time **MongoDB records**, and high-precision **RAG Vector Database** indexing the *SEC Autonomous Academic Regulations 2024*, *Placement Policies*, and *Curriculum Syllabi*.

How can I assist you with your academics, attendance calculations, or placement preparation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialGreeting]);
  }, []); // Run once on mount to prevent wiping chat when switching roles or clicking prompts

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSelectPersona = (roleId: AgentRoleType) => {
    if (roleId === selectedRole) return;
    setSelectedRole(roleId);
    const persona = AGENT_PERSONAS.find((p) => p.id === roleId) || AGENT_PERSONAS[0];
    const switchNotice: AgentChatMessage = {
      id: `switch_${roleId}_${Date.now()}`,
      sender: 'agent',
      agentName: persona.name,
      agentRole: persona.role,
      content: `Switched to **${persona.name}** (${persona.role}). How can I assist you in this domain?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, switchNotice]);
  };

  const handleSendMessage = async (textToSend?: string, roleOverride?: AgentRoleType) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    const activeRole = roleOverride || selectedRole;
    const activePersona = AGENT_PERSONAS.find((p) => p.id === activeRole) || AGENT_PERSONAS[0];

    const userMessage: AgentChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    // Placeholder message while waiting
    const agentPendingId = `agt_${Date.now()}`;
    const agentPendingMessage: AgentChatMessage = {
      id: agentPendingId,
      sender: 'agent',
      agentName: activePersona.name,
      agentRole: activePersona.role,
      content: 'Synthesizing response...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true,
    };
    setMessages((prev) => [...prev, agentPendingMessage]);

    try {
      const response = await aiService.chatWithAgent(
        query.trim(),
        activeRole,
        profile?.id || user?.id || 'usr_rohit_2026'
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentPendingId
            ? {
                ...msg,
                isThinking: false,
                content: response.response,
                thoughtSteps: response.thoughtSteps,
                toolInvocations: response.toolInvocations,
                ragCitations: response.ragCitations,
                suggestedActions: response.suggestedActions,
              }
            : msg
        )
      );

      // Auto-expand thought steps for recruiter visibility
      setExpandedThought((prev) => ({ ...prev, [agentPendingId]: true }));
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentPendingId
            ? {
                ...msg,
                isThinking: false,
                content: `### ⚠️ Notice
I encountered a temporary connection issue. Please retry or test with our one-click prompt shortcuts.
*Details: ${err.message || 'Server timeout'}*`,
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePersona = AGENT_PERSONAS.find((p) => p.id === selectedRole) || AGENT_PERSONAS[0];

  return (
    <div className="min-h-screen bg-slate-50 py-6 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Agentic AI • Gemini 3.8 Flash • RAG Embeddings • Vector DB • Tool Calling</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <span>SEC Autonomous Campus AI Copilot</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  ReAct Loop Active
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl">
                Multi-agent cognitive orchestrator powered by official college regulations, biometric attendance data, CGPA prediction models, and live recruiter criteria.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/rag-explorer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
              >
                <Database className="w-4 h-4 text-indigo-300" />
                <span>RAG Vector Explorer</span>
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 hover:brightness-110 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Campus Tools Lab</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {AGENT_PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isSelected = selectedRole === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handleSelectPersona(persona.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${persona.color} shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      isSelected ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {persona.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {persona.shortName}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {persona.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Conversation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Messages Stream (3 cols) */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[640px]">
            
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activePersona.color} flex items-center justify-center text-white shadow-xs`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{activePersona.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready & Online" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {activePersona.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMessages([]);
                    const initialGreeting: AgentChatMessage = {
                      id: `welcome_${Date.now()}`,
                      sender: 'agent',
                      agentName: activePersona.name,
                      agentRole: activePersona.role,
                      content: `Workspace reset. Ask me anything about attendance, semester grades, placement criteria, or college regulations.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setMessages([initialGreeting]);
                  }}
                  title="Clear Conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[580px]">
              {messages.map((message) => {
                const isUser = message.sender === 'user';
                const hasThoughts = message.thoughtSteps && message.thoughtSteps.length > 0;
                const hasTools = message.toolInvocations && message.toolInvocations.length > 0;
                const hasRAG = message.ragCitations && message.ragCitations.length > 0;
                const isThinkingExpanded = expandedThought[message.id] ?? true;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activePersona.color} flex items-center justify-center text-white shrink-0 shadow-xs mt-1`}>
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                      
                      {/* Message Bubble Header */}
                      <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 font-medium ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span>{isUser ? 'You' : message.agentName || 'Campus Copilot'}</span>
                        <span>•</span>
                        <span>{message.timestamp}</span>
                      </div>

                      {/* User Bubble */}
                      {isUser ? (
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-none text-xs font-medium shadow-md shadow-indigo-600/15 leading-relaxed">
                          {message.content}
                        </div>
                      ) : (
                        /* Agent Response Container */
                        <div className="space-y-3">
                          
                          {/* ReAct Execution Timeline Accordion */}
                          {(hasThoughts || hasTools) && (
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
                              <button
                                onClick={() =>
                                  setExpandedThought((prev) => ({
                                    ...prev,
                                    [message.id]: !isThinkingExpanded,
                                  }))
                                }
                                className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold text-indigo-900 hover:bg-indigo-100/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-indigo-600" />
                                  <span>Agentic ReAct Trace ({message.thoughtSteps?.length || 0} Steps • {message.toolInvocations?.length || 0} Tool Calls)</span>
                                </div>
                                {isThinkingExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-indigo-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-indigo-500" />
                                )}
                              </button>

                              <AnimatePresence>
                                {isThinkingExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-3 space-y-2 border-t border-indigo-100/80 pt-2 text-[11px]"
                                  >
                                    {message.thoughtSteps?.map((step) => (
                                      <div key={step.step} className="flex items-start gap-2 text-slate-700">
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                                            step.type === 'thought'
                                              ? 'bg-amber-100 text-amber-800'
                                              : step.type === 'action'
                                              ? 'bg-blue-100 text-blue-800'
                                              : step.type === 'observation'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-purple-100 text-purple-800'
                                          }`}
                                        >
                                          {step.type}
                                        </span>
                                        <div className="flex-1">
                                          <span className="font-bold text-slate-800">{step.title}: </span>
                                          <span className="text-slate-600">{step.detail}</span>
                                        </div>
                                      </div>
                                    ))}

                                    {/* Tool Calls Details */}
                                    {message.toolInvocations?.map((tool, idx) => (
                                      <div key={idx} className="p-2 bg-white rounded-xl border border-indigo-100 font-mono text-[10px] text-slate-700 space-y-1">
                                        <div className="flex items-center justify-between text-indigo-700 font-bold">
                                          <span>⚡ Tool: {tool.toolName}()</span>
                                          <span className="text-slate-400 font-normal">{tool.durationMs}ms</span>
                                        </div>
                                        <div className="text-slate-500 truncate">
                                          Args: {JSON.stringify(tool.arguments)}
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* RAG Grounding Badges */}
                          {hasRAG && (
                            <div className="flex flex-wrap gap-1.5">
                              {message.ragCitations?.map((rag, i) => (
                                <Link
                                  key={i}
                                  to="/rag-explorer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                                  title={rag.snippet}
                                >
                                  <Database className="w-3 h-3 text-emerald-600" />
                                  <span>{rag.section}</span>
                                  <span className="px-1 py-0.2 bg-emerald-200/60 rounded text-[9px]">
                                    {rag.similarity}% Match
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Primary Answer Bubble */}
                          <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-5 text-xs text-slate-800 shadow-sm leading-relaxed space-y-3 prose prose-sm max-w-none">
                            {message.isThinking ? (
                              <div className="flex items-center gap-3 py-2 text-indigo-600 font-bold">
                                <Cpu className="w-4 h-4 animate-spin" />
                                <span>Agent thinking, analyzing parameters & querying knowledge base...</span>
                              </div>
                            ) : (
                              <div
                                className="whitespace-pre-wrap font-sans"
                                dangerouslySetInnerHTML={{
                                  __html: message.content
                                    .replace(/### (.*)/g, '<h3 class="font-extrabold text-slate-900 text-sm mt-3 mb-1">$1</h3>')
                                    .replace(/#### (.*)/g, '<h4 class="font-bold text-slate-800 text-xs mt-2 mb-1">$1</h4>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
                                    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-slate-100 text-indigo-700 rounded text-[11px] font-mono font-bold">$1</code>'),
                                }}
                              />
                            )}

                            {/* Action Buttons inside message */}
                            {!message.isThinking && message.suggestedActions && message.suggestedActions.length > 0 && (
                              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 not-prose">
                                {message.suggestedActions.map((act, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      if (act.actionType === 'copy') {
                                        copyToClipboard(act.payload, `${message.id}_${idx}`);
                                      } else if (act.actionType === 'prompt') {
                                        handleSendMessage(act.payload);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-200/70"
                                  >
                                    {act.actionType === 'copy' ? (
                                      copiedId === `${message.id}_${idx}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )
                                    ) : (
                                      <Sparkles className="w-3.5 h-3.5" />
                                    )}
                                    <span>{act.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs mt-1">
                        {user?.name?.charAt(0) || 'R'}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask ${activePersona.shortName} (e.g. "Can I bunk Cloud Computing Friday?", "Zoho eligibility?", "Draft OD form")...`}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 shadow-xs transition"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isProcessing}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <span>Ask Copilot</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Prompt Shortcuts & Knowledge Insights (1 col) */}
          <div className="space-y-6">
            
            {/* Quick Prompt Cards */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>One-Click Agent Prompts</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Click any prompt to trigger multi-agent tool execution and live RAG retrieval:
              </p>

              <div className="space-y-2">
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={isProcessing}
                    onClick={() => {
                      setSelectedRole(item.agent);
                      handleSendMessage(item.prompt, item.agent);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/60 hover:border-indigo-200 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 group-hover:text-indigo-700">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Knowledge Base Index Status */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wide uppercase text-indigo-300">
                  Vector DB Status
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <div className="space-y-2 text-xs text-indigo-200">
                <div className="flex items-center justify-between py-1 border-b border-indigo-800/60">
                  <span>Indexed Chunks</span>
                  <span className="font-bold text-white">14 Chunks</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-indigo-800/60">
                  <span>Embedding Model</span>
                  <span className="font-bold text-white">gemini-embedding-2</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-indigo-800/60">
                  <span>Similarity Metric</span>
                  <span className="font-bold text-white">Cosine Similarity</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Deployment Cost</span>
                  <span className="font-bold text-emerald-400">$0.00 (Zero-Cost)</span>
                </div>
              </div>

              <Link
                to="/rag-explorer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all text-center mt-2"
              >
                <span>Inspect Vector Chunks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recruiter / Resume Notes */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Resume Key Features</span>
              </div>
              <ul className="text-[11px] text-amber-900/80 space-y-1 list-disc pl-4">
                <li>Gemini 3.8 Flash Function/Tool Calling</li>
                <li>RAG retrieval with Cosine Similarity vector store</li>
                <li>Zero-cost MongoDB document collection repository</li>
                <li>Automated ReAct reasoning chain logs</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SmartCampusAgent;
