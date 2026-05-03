import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';
import { useInterview } from '../../contex/useInterview';

const Login = () => {

    const { setUserData, clearSession } = useInterview();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        if (!email || !password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        try {
            const result = await login({ email, password });
            if (result.success) {
                // Clear any previous user's stale data first
                clearSession();
                navigate('/');
            }

            // Example: Redirect to dashboard or set user state here
        } catch (error) {
            setErrorMessage(error.toString());
        }
    };

    return (

        <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-950 font-sans text-sm">

            {/* 2. Main Login Card Section */}
            {/* Use h-auto for mobile so it expands, and h-[724px] for desktop matching design */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 flex justify-center items-center">
                <div className="bg-zinc-900 border border-zinc-800 p-10 md:p-12 rounded-3xl w-full max-w-[510px] h-[650px] shadow-[0px_8px_30px_rgba(220,38,38,0.05)] shadow-red-900/10 flex flex-col">

                    <div className="text-center mb-10">
                        <h1 className="text-zinc-100 text-2xl font-bold leading-tight">Welcome Back</h1>
                        <p className="text-zinc-400 mt-2 text-base font-normal">Access your AI-powered workspace.</p>
                    </div>

                    {/* Error Message Alert */}
                    {errorMessage && (
                        <div className="bg-red-950/50 text-red-400 border border-red-900/50 text-sm p-4 rounded-xl mb-6 text-center">
                            {errorMessage}
                        </div>
                    )}


                    {/* The Login Form connected to the onSubmit handler */}
                    <form onSubmit={handleLoginSubmit} className="space-y-6 flex flex-col flex-grow">

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">
                                EMAIL ADDRESS
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-base font-medium px-5 rounded-xl placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="text-zinc-400 text-sm font-medium uppercase tracking-wide">
                                    PASSWORD
                                </label>
                                <a href="/forgot-password" className="text-red-400 text-1xs font-bold uppercase tracking-widest hover:underline hover:text-red-300">
                                    FORGOT?
                                </a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-2xl font-black px-5 rounded-xl placeholder:text-zinc-600 placeholder:font-normal placeholder:text-base focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
                            />
                        </div>

                        {/* This ensures the button stays at the bottom in the 724px height desktop design */}
                        <div className="flex-grow hidden md:block"></div>

                        {/* Login Button */}
                        <button type="submit" className="w-full h-[54px] bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-base font-bold rounded-xl shadow-lg shadow-red-900/30 transition duration-150 mt-10 md:mt-0 cursor-pointer active:scale-95">
                            Enter Workspace
                        </button>


                    </form>
                    {/* 3. Pre-Footer: Create Account */}
                    <div className="w-full text-center py-10 md:py-16">
                        <p className="text-zinc-400 text-base font-medium">
                            New to the console?{' '}
                            <a href="/register" className="text-red-400 font-bold hover:text-red-300 hover:underline">
                                Create account
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;