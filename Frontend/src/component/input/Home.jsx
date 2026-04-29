import React, { useState } from 'react';
import { generateInterviewReport } from '../../services/aiServices';
import { useInterview } from '../../contex/useInterview';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { Sparkles, FileText, User, Briefcase } from 'lucide-react';

const Home = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [error, setError] = useState('');

    const { setInterviewReport, loading, setLoading } = useInterview();
    const navigate = useNavigate();

    // For model selection
    const GEMINI_MODELS = [
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Fastest)", description: "Best for quick analysis" },
        { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Advanced)", description: "Best for complex reasoning" },
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Ultra-low cost" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Stable)", description: "Highly reliable performance" },
    ];
    const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0].id);
    console.log(selectedModel);

    // API Call by user  
    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await generateInterviewReport(jobDescription, resume, selfDescription, selectedModel);
            setInterviewReport(response);
            navigate(`/report/${response._id}`);
        } catch (error) {
            if (error === "Unauthorized user, please login first" || error?.includes?.("Unauthorized")) {
                navigate('/login');
            } else {
                setError(error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : "An unknown error occurred"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-full flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-2xl">

                    {/* Hero Text */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                            <Sparkles size={12} className="text-blue-400" />
                            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">AI-Powered</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                            Generate Your
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> Interview Report</span>
                        </h1>
                        <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                            Provide your job details and resume to get a personalized technical assessment, skill gap analysis, and a 7-day prep roadmap.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[#0d1424] border border-white/[0.07] rounded-2xl p-6 md:p-8 shadow-2xl">

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                                <span className="text-red-400 mt-0.5">⚠</span>
                                <span className='break-all'>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleGenerate} className="flex flex-col gap-5">

                            {/* Job Description */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <Briefcase size={12} className="text-blue-500" />
                                    Job Description
                                </label>
                                <textarea
                                    className="w-full h-32 bg-[#070b14] border border-white/[0.08] text-slate-200 text-sm p-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition duration-200 resize-none placeholder-slate-600"
                                    placeholder="Paste the target job description here..."
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <FileText size={12} className="text-blue-500" />
                                    Resume (Upload .pdf)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        name="resume"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        className="block w-full text-sm text-slate-400
                                            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                            file:text-xs file:font-bold file:uppercase file:tracking-wide
                                            file:bg-blue-500/10 file:text-blue-400
                                            hover:file:bg-blue-500/20 hover:file:text-blue-300
                                            transition duration-200 cursor-pointer
                                            border border-white/[0.08] rounded-xl p-3
                                            bg-[#070b14] file:transition-all"
                                    />
                                </div>
                            </div>

                            {/* Self Description */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <User size={12} className="text-blue-500" />
                                    Self Description
                                </label>
                                <textarea
                                    className="w-full h-24 bg-[#070b14] border border-white/[0.08] text-slate-200 text-sm p-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition duration-200 resize-none placeholder-slate-600"
                                    placeholder="Add a brief summary about yourself, projects, and goals..."
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Select Gimini Model */}
                            <div className="flex flex-col gap-2 w-full max-w-xs">

                                <label className="text-sm font-semibold text-gray-700">Select AI Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="p-2 bg-[#070b14] border border-white/[0.08] text-slate-200 text-sm  focus:ring-2 focus:ring-blue-300 transition-all outline-none"
                                >
                                    {GEMINI_MODELS.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 italic">
                                    {GEMINI_MODELS.find(m => m.id === selectedModel)?.description}
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full h-13 mt-2 relative overflow-hidden
                                    bg-gradient-to-r from-blue-600 to-indigo-600
                                    hover:from-blue-500 hover:to-indigo-500
                                    text-white font-bold rounded-xl
                                    shadow-lg shadow-blue-500/20
                                    transition-all duration-200
                                    flex items-center justify-center gap-2 py-3.5
                                    ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99] hover:shadow-blue-500/30 hover:shadow-xl'}
                                `}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Report...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles size={15} />
                                        Generate Report
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer hint */}
                    <p className="text-center text-[11px] text-slate-700 mt-6">
                        Reports are personalized using AI. All data is processed securely.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
};

export default Home;