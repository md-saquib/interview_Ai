import React, { useState } from 'react';
import { BarChart3, AlertCircle, Calendar, MessageSquare, CheckCircle2, ArrowRight, BrainCircuit, Download, Loader2 } from 'lucide-react';
import { useInterview } from '../../contex/useInterview';
import AppLayout from '../layout/AppLayout';
import { downloadResumePdf } from '../../services/aiServices';

const InterviewDashboard = () => {

  const { interviewReport, setLoading, loading } = useInterview();

  const [downloadError, setDownloadError] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setDownloadError('');
    try {
      await downloadResumePdf(interviewReport._id);
    } catch (err) {
      setDownloadError(err.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle color logic based on your 'severity' string
  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-950/50 text-red-400 border-red-900/50';
      case 'medium': return 'bg-rose-950/50 text-rose-400 border-rose-900/50';
      default: return 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50';
    }
  };

  if (!interviewReport) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] bg-zinc-950">
          <div className="p-6 bg-zinc-900 border border-red-900/30 rounded-2xl text-center shadow-2xl shadow-red-900/10">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
            <h2 className="text-zinc-100 font-bold text-lg">No Data Available</h2>
            <p className="text-sm text-zinc-400 mt-1">Please provide a valid interview report object.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-zinc-950 text-zinc-300 p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* --- Header Section --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <header className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500"><BrainCircuit size={120} /></div>
              <h1 className="text-3xl font-black text-white tracking-tight">{interviewReport.title}</h1>
              <p className="text-zinc-400 mt-2 text-lg">Report Generated: <span className="text-red-400 font-medium">{interviewReport.analysisDate}</span></p>
            </header>

            {/* Match Score + Download Button */}
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">Match Score</p>
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                      strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * interviewReport.matchScore) / 100}
                      className="text-red-500" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{interviewReport.matchScore}%</span>
                </div>
                <div className="mt-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center">ATS Optimized</p>
                </div>
              </div>

              {/* Download Resume Button */}
              <button
                id="download-resume-btn"
                onClick={handleDownload}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer shadow-lg
                ${loading
                    ? 'bg-red-500/10 border-red-500/20 text-red-400 opacity-60 cursor-not-allowed'
                    : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95'}`}
              >
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
                  : <><Download size={14} /> Download Resume</>}
              </button>
              {downloadError && (
                <p className="text-[10px] text-red-400 text-center">{downloadError}</p>
              )}
            </div>

          </div>

          {/* --- Technical Deep Dive --- */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-red-500" /> Technical Assessment Focus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewReport.technicalQuestions?.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-red-900/50 hover:bg-zinc-900 transition-all group">
                  <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Question {i + 1}</p>
                  <h3 className="text-sm font-semibold text-zinc-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.question}</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-red-900/50 pl-3">Intention: {q.intention}</p>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-400 line-clamp-3 mb-1 group-hover:text-zinc-300 transition-colors">{q.answer}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* --- Skill Gaps & Prep Plan Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Skill Gaps Mapping */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" /> Improvement Areas
              </h2>
              <div className="space-y-3">
                {interviewReport.skillGaps?.map((gap, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${getSeverityStyles(gap.severity)}`}>
                    <span className="text-xs font-bold">{gap.skill}</span>
                    <span className="text-[9px] uppercase font-black tracking-wider">{gap.severity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prep Plan Mapping */}
            <section className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-red-500" /> 7-Day Sprint Roadmap
              </h2>
              <div className="">
                <div className="flex flex-wrap gap-4 pb-2">
                  {interviewReport.preparationPlan?.map((plan, i) => (
                    <div key={i} className="min-w-[200px] flex-1 bg-zinc-950/50 border border-zinc-800/50 hover:border-red-900/30 transition-colors p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">Day {plan.day}</span>
                        <CheckCircle2 size={14} className="text-red-500" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-2">{plan.focus}</h4>
                      <ul className="space-y-2">
                        {plan.tasks?.map((task, ti) => (
                          <li key={ti} className="text-[10px] text-zinc-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1 flex-shrink-0" />
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
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-red-500" /> Behavioral Assessment Focus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewReport.behavioralQuestions?.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-red-900/50 hover:bg-zinc-900 transition-all group">
                  <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Question {i + 1}</p>
                  <h3 className="text-sm font-semibold text-zinc-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">{q.question}</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-red-900/50 pl-3">Intention: {q.intention}</p>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-400 line-clamp-3 mb-1 group-hover:text-zinc-300 transition-colors">{q.answer}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* --- Bottom Insights --- */}
          <section className="bg-gradient-to-r from-red-900/20 to-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20"><MessageSquare size={20} /></div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview Strategy</h3>
                <p className="text-xs text-zinc-400 mt-1">Tailored based on your profile and industry standards.</p>
              </div>
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 active:scale-95">
              Start Mock Session <ArrowRight size={16} />
            </button>
          </section>

        </div>
      </div>
    </AppLayout>
  );
};

export default InterviewDashboard;