import { useState } from 'react';
import { register } from '../../services/authServices';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous state
    setSuccessMessage('');

    const payload = {
      name: fullName,
      email,
      age: Number(age),
      gender,
      password,
    }

    try {
      const response = await register(payload);

      if (response.success) setSuccessMessage(response.message);
      else setErrorMessage(response.message);
    }
    catch (error) {
      setErrorMessage(error.message);
    }

  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-950 font-sans text-sm">

      {/* 2. Main Register Card Section (h-auto for mobile, h-[724px] for desktop matching design) */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 flex justify-center items-center py-12">
        <div className="bg-zinc-900 border border-zinc-800 p-10 md:p-12 rounded-3xl w-full max-w-[510px] h-auto shadow-[0px_8px_30px_rgba(220,38,38,0.05)] shadow-red-900/10 flex flex-col">

          <div className="text-center mb-10">
            <h1 className="text-zinc-100 text-2xl font-bold leading-tight">Create Your Account</h1>
            <p className="text-zinc-400 mt-2 text-base font-normal">Start your journey with InterviewAI.</p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-red-950/50 text-red-400 border border-red-900/50 text-sm p-4 rounded-xl mb-6 text-center">
              {errorMessage}
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 text-sm p-4 rounded-xl mb-6 text-center">
              {successMessage}
            </div>
          )}

          {/* The Register Form connected to the onSubmit handler */}
          <form onSubmit={handleRegisterSubmit} className="space-y-6 flex flex-col flex-grow">

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">
                FULL NAME
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-base font-medium px-5 rounded-xl placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
              />
            </div>

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
                placeholder="name@example.com"
                className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-base font-medium px-5 rounded-xl placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
              />
            </div>

            {/* Age and Gender Fields (Two columns on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">
                  AGE
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-base font-medium px-5 rounded-xl placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
                />
              </div>
              <div className="relative">
                <label htmlFor="gender" className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">
                  GENDER
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-base font-medium px-5 rounded-xl appearance-none placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
                >
                  <option value="" disabled>Select option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {/* Custom dropdown arrow to match the design */}
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="absolute right-5 top-[60px] text-zinc-500 pointer-events-none">
                  <path d="M11 1L6 6L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full h-[54px] bg-zinc-950/50 border border-zinc-800 text-zinc-100 text-2xl font-black px-5 rounded-xl placeholder:text-zinc-600 placeholder:font-normal placeholder:text-base focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition duration-150"
              />
            </div>

            {/* Register Button */}
            <button type="submit" className="w-full h-[54px] bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-base font-bold rounded-xl shadow-lg shadow-red-900/30 transition duration-150 mt-10 active:scale-95">
              Create Account
            </button>
          </form>

          {/* 3. Pre-Footer: Already have an account */}
          <div className="w-full text-center py-10 md:py-8">
            <p className="text-zinc-400 text-base font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-red-400 font-bold hover:text-red-300 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Register;