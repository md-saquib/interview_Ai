import React, { useState, useRef } from 'react';
import {
  BarChart3, AlertCircle, Calendar, MessageSquare,
  CheckCircle2, ArrowRight, BrainCircuit, Download, Loader2
} from 'lucide-react';
import { useInterview } from '../../contex/useInterview';
import AppLayout from '../layout/AppLayout';
import { downloadResumePdf } from '../../services/aiServices';

/* ─── Popup coordinate calculator (fixed positioning) ─────────────────── */
const POPUP_W_Q = 580;   // question popup width
const POPUP_W_P = 520;   // plan popup width


const calcPopupStyle = (cardEl, popupWidth) => {
  if (!cardEl) return {};
  const r = cardEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const GAP = 12;
  const spaceRight = vw - r.right - GAP;
  const spaceLeft = r.left - GAP;

  let left, animKey;

  if (vw < 768 || (spaceRight < popupWidth && spaceLeft < popupWidth)) {
    // Mobile / no side space → center modal
    return {
      position: 'fixed', zIndex: 9999,
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: Math.min(vw - 32, popupWidth),
      maxHeight: '85vh',
      animation: 'popSlideDown 0.18s ease-out',
    };
  }

  if (spaceRight >= popupWidth) {
    // Place to the RIGHT of card
    left = r.right + GAP;
    animKey = 'popSlideRight';
  } else {
    // Place to the LEFT of card
    left = r.left - popupWidth - GAP;
    animKey = 'popSlideLeft';
  }

  // Vertical: align top of popup with top of card, clamp to viewport
  let top = r.top;
  const maxTop = vh - 40;   // at least 40 px visible
  if (top > maxTop) top = maxTop;
  if (top < 8) top = 8;

  return {
    position: 'fixed', zIndex: 9999,
    top, left, width: popupWidth,
    animation: `${animKey} 0.18s ease-out`,
  };
};

/* ─── Question Card (Technical / Behavioral) ─────────────────────────── */
const QuestionCard = ({ q, index }) => {
  const [popupStyle, setPopupStyle] = useState(null);
  const cardRef = useRef(null);
  const timer = useRef(null);

  const enter = () => {
    timer.current = setTimeout(() => {
      setPopupStyle(calcPopupStyle(cardRef.current, POPUP_W_Q));
    }, 140);
  };
  const leave = () => { clearTimeout(timer.current); setPopupStyle(null); };

  return (
    <div ref={cardRef} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      {/* ── Compact card ── */}
      <div className="h-full p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-red-900/50 hover:bg-zinc-900 transition-all group cursor-default">
        <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Question {index + 1}</p>
        <h3 className="text-sm font-semibold text-zinc-200 line-clamp-2 mb-3 group-hover:text-white transition-colors">
          {q.question}
        </h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-red-900/50 pl-3 line-clamp-2 mb-3">
          {q.intention}
        </p>
        <p className="text-xs font-medium text-zinc-400 line-clamp-3 group-hover:text-zinc-300 transition-colors">
          {q.answer}
        </p>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500/30 group-hover:bg-red-500 transition-all duration-300" />
      </div>

      {/* ── Expanded popup — fixed, escapes all stacking contexts ── */}
      {popupStyle && (
        <div
          style={popupStyle}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={leave}
        >
          <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-900/40 overflow-hidden">
            {/* header */}
            <div className="px-6 py-4 border-b border-indigo-900/40 flex items-center justify-between bg-indigo-950/60">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-indigo-300">{index + 1}</span>
                </div>
                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                  Question {index + 1}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            </div>
            {/* body */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-800/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-2">❓ Question</p>
                <p className="text-base font-semibold text-white leading-relaxed">{q.question}</p>
              </div>
              <div className="p-4 rounded-xl bg-violet-950/40 border-l-4 border-violet-500 border border-violet-800/20">
                <p className="text-[9px] font-black uppercase tracking-widest text-violet-400 mb-2">💡 Intention</p>
                <p className="text-sm text-slate-300 leading-relaxed italic">{q.intention}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">✅ Suggested Answer</p>
                <p className="text-sm text-slate-200 leading-relaxed">{q.answer}</p>
              </div>
            </div>
            {/* footer */}
            <div className="px-6 py-3 border-t border-indigo-900/30 bg-indigo-950/30 flex items-center justify-between">
              <p className="text-[10px] text-indigo-700">Move away to close</p>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-indigo-600" />
                <div className="w-1 h-1 rounded-full bg-violet-600" />
                <div className="w-1 h-1 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};    

/* ─── Preparation Plan Card ───────────────────────────────────────────── */
const PlanCard = ({ plan }) => {
  const [popupStyle, setPopupStyle] = useState(null);
  const cardRef = useRef(null);
  const timer = useRef(null);

  const enter = () => {
    timer.current = setTimeout(() => {
      setPopupStyle(calcPopupStyle(cardRef.current, POPUP_W_P));
    }, 140);
  };
  const leave = () => { clearTimeout(timer.current); setPopupStyle(null); };

  return (
    <div ref={cardRef} className="relative min-w-[180px] flex-1" onMouseEnter={enter} onMouseLeave={leave}>
      {/* ── Compact plan card ── */}
      <div className="h-full bg-zinc-950/50 border border-zinc-800/50 hover:border-red-900/40 hover:bg-zinc-900/60 transition-all p-4 rounded-xl group cursor-default">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-zinc-500 uppercase">Day {plan.day}</span>
          <CheckCircle2 size={14} className="text-red-500" />
        </div>
        <h4 className="text-xs font-bold text-white mb-2 line-clamp-1">{plan.focus}</h4>
        <ul className="space-y-1.5">
          {plan.tasks?.slice(0, 3).map((task, ti) => (
            <li key={ti} className="text-[10px] text-zinc-400 flex items-start gap-2 line-clamp-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1 flex-shrink-0" />
              {task}
            </li>
          ))}
          {plan.tasks?.length > 3 && (
            <li className="text-[10px] text-red-500/60 pl-3.5">+{plan.tasks.length - 3} more…</li>
          )}
        </ul>
      </div>

      {/* ── Expanded popup — fixed, escapes all stacking contexts ── */}
      {popupStyle && (
        <div
          style={popupStyle}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={leave}
        >
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-900/30 overflow-hidden">
            {/* header */}
            <div className="px-6 py-4 border-b border-emerald-900/40 flex items-center justify-between bg-emerald-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-sm font-black text-emerald-300">{plan.day}</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Sprint Day</p>
                  <p className="text-xs font-black text-emerald-300">Day {plan.day} Roadmap</p>
                </div>
              </div>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            {/* body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-2">🎯 Focus Area</p>
                <p className="text-base font-bold text-white">{plan.focus}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-teal-500 mb-3">📋 All Tasks ({plan.tasks?.length})</p>
                <ul className="space-y-2.5">
                  {plan.tasks?.map((task, ti) => (
                    <li key={ti} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/30">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[8px] font-black text-emerald-400">{ti + 1}</span>
                      </div>
                      <span className="text-sm text-slate-200 leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* footer */}
            <div className="px-6 py-3 border-t border-emerald-900/30 bg-emerald-950/20 flex items-center justify-between">
              <p className="text-[10px] text-emerald-800">Move away to close</p>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-600" />
                <div className="w-1 h-1 rounded-full bg-teal-600" />
                <div className="w-1 h-1 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};    

/* ─── Main Component ─────────────────────────────────────────────────── */
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
    );
  }

  return (
    <AppLayout>
      {/* Keyframe animations */}
      <style>{`
        @keyframes popSlideRight {
          from { opacity: 0; transform: translateX(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)     scale(1);    }
        }
        @keyframes popSlideLeft {
          from { opacity: 0; transform: translateX(12px)  scale(0.97); }
          to   { opacity: 1; transform: translateX(0)     scale(1);    }
        }
        @keyframes popSlideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>

      <div className="min-h-full bg-zinc-950 text-zinc-300 p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Header ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <header className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500"><BrainCircuit size={120} /></div>
              <h1 className="text-3xl font-black text-white tracking-tight">{interviewReport.title}</h1>
              <p className="text-zinc-400 mt-2 text-lg">
                Report Generated: <span className="text-red-400 font-medium">{interviewReport.analysisDate}</span>
              </p>
            </header>

            {/* Match Score + Download */}
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">Match Score</p>
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * interviewReport.matchScore) / 100}
                      className="text-red-500" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{interviewReport.matchScore}%</span>
                </div>
                <div className="mt-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center">ATS Optimized</p>
                </div>
              </div>

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
              {downloadError && <p className="text-[10px] text-red-400 text-center">{downloadError}</p>}
            </div>
          </div>

          {/* ── Technical Assessment ──────────────────────────── */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg overflow-visible">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
              <BarChart3 size={18} className="text-red-500" /> Technical Assessment Focus
            </h2>
            <p className="text-[11px] text-zinc-600 mb-5 pl-7">
              Hover a card — a detail panel slides in from the side.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewReport.technicalQuestions?.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          {/* ── Skill Gaps & Prep Plan ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill Gaps */}
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

            {/* Prep Plan */}
            <section className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg overflow-visible">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
                <Calendar size={18} className="text-red-500" /> 7-Day Sprint Roadmap
              </h2>
              <p className="text-[11px] text-zinc-600 mb-5 pl-7">
                Hover a day card to see all tasks.
              </p>
              <div className="flex flex-wrap gap-4 pb-2">
                {interviewReport.preparationPlan?.map((plan, i) => (
                  <PlanCard key={i} plan={plan} />
                ))}
              </div>
            </section>
          </div>

          {/* ── Behavioral Assessment ─────────────────────────── */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg overflow-visible">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
              <BarChart3 size={18} className="text-red-500" /> Behavioral Assessment Focus
            </h2>
            <p className="text-[11px] text-zinc-600 mb-5 pl-7">
              Hover a card — a detail panel slides in from the side.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewReport.behavioralQuestions?.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          {/* ── Bottom Insights ───────────────────────────────── */}
          <section className="bg-gradient-to-r from-red-900/20 to-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                <MessageSquare size={20} />
              </div>
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