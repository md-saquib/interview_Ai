import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../contex/useInterview';
import { BrainCircuit, Home, Clock, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import { logout } from '../../services/authServices';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();
    const { tittles, userData, clearSession } = useInterview();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        // 1. Immediately wipe all user-specific state from React context
        clearSession();
        try {
            // 2. Tell the backend to clear the cookie
            await logout();
        } catch (e) {
            // Even if API fails, user is already cleared locally
        }
        // 3. Redirect to login
        navigate('/login');
    };

    const handleProfileClick = () => {
        if (userData) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
            {/* ───── Top Nav Bar ───── */}
            <header className="h-14 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
                {/* Left: Logo */}
                <div className="flex items-center gap-2.5">
                    <button
                        className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 mr-1 transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-900/20">
                        <BrainCircuit size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-white text-base tracking-tight">InterviewAI</span>
                </div>

                {/* Right: User Avatar */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={handleProfileClick}
                >
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-semibold text-zinc-200 leading-none">{userData ? userData.name : 'Guest'}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Free Plan</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:border-red-400/50 transition-all">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ───── Left Sidebar ───── */}
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside className={`
                    fixed md:static top-14 left-0 h-[calc(100vh-3.5rem)] md:h-auto
                    w-64 bg-zinc-900 border-r border-zinc-800
                    flex flex-col z-20 transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    {/* Home Button */}
                    <div className="p-3 border-b border-zinc-800">
                        <button
                            onClick={() => { navigate('/'); setSidebarOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all group"
                        >
                            <Home size={15} />
                            <span className="text-sm font-semibold">New Report</span>
                            <ChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {/* History Label */}
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">History</p>
                    </div>

                    {/* Report History List */}
                    <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin">
                        {tittles && tittles.length > 0 ? (
                            tittles.map((item, i) => (
                                <button
                                    key={item._id || i}
                                    onClick={() => { navigate(`/report/${item._id}`); setSidebarOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 transition-all group"
                                >
                                    <p className="text-xs font-medium text-zinc-300 group-hover:text-white line-clamp-1 transition-colors">
                                        {item.title || 'Untitled Report'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock size={10} className="text-zinc-500" />
                                        <span className="text-[10px] text-zinc-500">
                                            {formatDate(item.createdAt || item.analysisDate)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-8 text-center">
                                <p className="text-xs text-zinc-500">No reports yet</p>
                                <p className="text-[10px] text-zinc-600 mt-1">Generate your first report</p>
                            </div>
                        )}
                    </div>
                    {/* Sidebar Footer — Logout */}
                    <div className="p-3 border-t border-zinc-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-zinc-400 hover:text-red-400 transition-all group"
                        >
                            <LogOut size={15} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* ───── Right Content Area ───── */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
