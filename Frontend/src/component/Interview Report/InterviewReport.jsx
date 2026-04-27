import React from 'react';
import { BarChart3, AlertCircle, Calendar, MessageSquare, CheckCircle2, ArrowRight, BrainCircuit } from 'lucide-react';
import { useInterview } from '../../contex/useInterview';
import AppLayout from '../layout/AppLayout';
const InterviewDashboard = () => {

  const { interviewReport } = useInterview();
  // Helper to handle color logic based on your 'severity' string
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  if (!interviewReport) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
            <h2 className="text-white font-bold">No Data Available</h2>
            <p className="text-sm text-slate-500">Please provide a valid interview report object.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
    <div className="min-h-full bg-[#070b14] text-slate-300 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- Header Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <header className="lg:col-span-3 bg-[#161b2c] border border-white/5 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit size={120} /></div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{interviewReport.title}</h1>
            <p className="text-slate-400 mt-2 text-lg">Report Generated: {interviewReport.analysisDate}</p>
          </header>

          <div className="bg-[#161b2c] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">Match Score</p>
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * interviewReport.matchScore) / 100}
                  className="text-blue-500" strokeLinecap="round" />
              </svg>
              <span className="absolute text-2xl font-black text-white">{interviewReport.matchScore}%</span>
            </div>
            <div className="mt-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest text-center">ATS Optimized</p>
            </div>
          </div>
        </div>

        {/* --- Technical Deep Dive (Mapping your techQuestions) --- */}
        <section className="bg-[#161b2c] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" /> Technical Assessment Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewReport.technicalQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Question {i + 1}</p>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.question}</h3>
                <div className="space-y-2 mb-3">
                  <p className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-slate-700 pl-3">Intention: {q.intention}</p>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.answer}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* --- Skill Gaps & Prep Plan Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Skill Gaps Mapping */}
          <section className="bg-[#161b2c] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" /> Improvement Areas
            </h2>
            <div className="space-y-3">
              {interviewReport.skillGaps.map((gap, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${getSeverityStyles(gap.severity)}`}>
                  <span className="text-xs font-bold">{gap.skill}</span>
                  <span className="text-[9px] uppercase font-black">{gap.severity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Prep Plan Mapping */}
          <section className="lg:col-span-2 bg-[#161b2c] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" /> 7-Day Sprint Roadmap
            </h2>
            <div className="">
              <div className="flex flex-wrap gap-4 pb-2">
                {interviewReport.preparationPlan.map((plan, i) => (
                  <div key={i} className="min-w-[200px] flex-1 bg-white/[0.03] border border-white/5 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Day {plan.day}</span>
                      <CheckCircle2 size={14} className="text-blue-500" />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-2">{plan.focus}</h4>
                    <ul className="space-y-2">
                      {plan.tasks.map((task, ti) => (
                        <li key={ti} className="text-[10px] text-slate-400 flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* .... behavioral questions .... */}

        <section className="bg-[#161b2c] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" /> Behavioral Assessment Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewReport.behavioralQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Question {i + 1}</p>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.question}</h3>
                <div className="space-y-2 mb-3">
                  <p className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-slate-700 pl-3">Intention: {q.intention}</p>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.answer}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* --- Bottom Insights --- */}
        <section className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400"><MessageSquare /></div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview Strategy</h3>
              <p className="text-xs text-slate-400">Tailored based on your MERN stack expertise and AI integration projects.</p>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2">
            Start Mock Session <ArrowRight size={16} />
          </button>
        </section>

      </div>
    </div>
    </AppLayout>
  );
};

export default InterviewDashboard;