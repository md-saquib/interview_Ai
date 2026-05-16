import React from 'react';
import {
  User, Mail, Shield, Calendar, Users, BrainCircuit,
  FileText, TrendingUp, Award, ChevronRight, LogOut,
} from 'lucide-react';
import { useInterview } from '../../contex/useInterview';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { logout } from '../../services/authServices';

/* ── Small stat card ──────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent = false }) => (
  <div className={`flex flex-col gap-2 p-5 rounded-2xl border transition-all
    ${accent
      ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/15 hover:border-red-500/40'
      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
      ${accent ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>
      <Icon size={18} />
    </div>
    <p className="text-2xl font-black text-white">{value ?? '—'}</p>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
  </div>
);

/* ── Info row ─────────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-zinc-800/60 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-zinc-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="text-sm font-semibold text-zinc-200 mt-0.5 truncate">{value ?? '—'}</p>
    </div>
    <ChevronRight size={14} className="text-zinc-700 flex-shrink-0" />
  </div>
);

/* ── Main Profile Page ────────────────────────────────────────── */
const Profile = () => {
  const { userData, tittles, clearSession } = useInterview();
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearSession();
    try {
      await logout();
    } catch (_) { }
    navigate('/login');
  };

  // Derive initials for the avatar
  const initials = userData?.name
    ? userData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const totalReports = tittles?.length ?? 0;

  // Capitalise helper
  const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '—';

  return (
    <AppLayout>
      <div className="min-h-full bg-zinc-950 text-zinc-300 p-6 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ── Banner + Avatar ──────────────────────────────── */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            {/* decorative gradient banner */}
            <div className="h-32 bg-gradient-to-r from-red-900/60 via-rose-900/40 to-zinc-900 relative">
              <BrainCircuit size={120} className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500/10" />
            </div>

            {/* Avatar row */}
            <div className="px-8 pb-8 -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-5">
                {/* Avatar circle */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center border-4 border-zinc-900 shadow-xl shadow-red-900/30 flex-shrink-0">
                  <span className="text-3xl font-black text-white">{initials}</span>
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-black text-white leading-none">
                    {userData?.name ?? 'Guest User'}
                  </h1>
                  <p className="text-sm text-zinc-400 mt-1">{userData?.email ?? 'Not logged in'}</p>
                  {/* Role badge */}
                  <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${userData?.role === 'admin'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    <Shield size={9} />
                    {cap(userData?.role) ?? 'User'}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* ── Stats Row ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Total Reports" value={totalReports} accent />
            <StatCard icon={TrendingUp} label="Reports This Week" value={
              tittles?.filter(t => {
                const d = new Date(t.createdAt || t.analysisDate);
                return (Date.now() - d) < 7 * 86400000;
              }).length ?? 0
            } />
            <StatCard icon={Award} label="Plan" value="Free" />
            <StatCard icon={Users} label="Member Since" value={
              userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'N/A'
            } />
          </div>

          {/* ── Personal Info ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Info Card */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Personal Information
              </h2>
              <InfoRow icon={User} label="Full Name" value={userData?.name} />
              <InfoRow icon={Mail} label="Email" value={userData?.email} />
              <InfoRow icon={Calendar} label="Age" value={userData?.age} />
              <InfoRow icon={Users} label="Gender" value={cap(userData?.gender)} />
              <InfoRow icon={Shield} label="Role" value={cap(userData?.role)} />
            </section>

            {/* Recent Reports */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Recent Reports
              </h2>
              {tittles && tittles.length > 0 ? (
                <div className="space-y-2">
                  {[...tittles].slice(0, 5).map((item, i) => (
                    <button
                      key={item._id || i}
                      onClick={() => navigate(`/report/${item._id}`)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText size={13} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white line-clamp-1 transition-colors">
                          {item.title || 'Untitled Report'}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : item.analysisDate}
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-zinc-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <FileText size={32} className="text-zinc-700 mb-3" />
                  <p className="text-sm text-zinc-500">No reports yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-3 text-xs text-red-400 hover:text-red-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Generate your first report
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* ── Account Actions ────────────────────────────────── */}
          <section className="bg-gradient-to-r from-red-900/15 to-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upgrade to Pro</h3>
              <p className="text-xs text-zinc-400 mt-1">Unlock unlimited reports, priority AI models &amp; more.</p>
            </div>
            <button className="flex-shrink-0 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center gap-2 active:scale-95">
              <Award size={14} /> Upgrade Plan
            </button>
          </section>

        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
