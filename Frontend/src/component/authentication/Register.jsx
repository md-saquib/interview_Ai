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
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 font-sans text-sm">



      {/* 2. Main Register Card Section (h-auto for mobile, h-[724px] for desktop matching design) */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 flex justify-center items-center">
        <div className="bg-white p-10 md:p-12 rounded-3xl w-full max-w-[510px] h-auto  shadow-[0px_8px_30px_rgba(107,114,128,0.05)] flex flex-col">

          <div className="text-center mb-10">
            <h1 className="text-text-primary text-2xl font-bold leading-tight">Create Your Account</h1>
            <p className="text-text-secondary mt-2 text-base font-normal">Start your journey with Aether AI.</p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 rounded-xl mb-6 text-center">
              {errorMessage}
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="bg-green-50 text-green-700 border border-green-200 text-sm p-4 rounded-xl mb-6 text-center">
              {successMessage}
            </div>
          )}

          {/* The Register Form connected to the onSubmit handler */}
          <form onSubmit={handleRegisterSubmit} className="space-y-6 flex flex-col flex-grow">

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
                FULL NAME
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-[54px] bg-white border border-input-border text-text-primary text-base font-medium px-5 rounded-xl placeholder:text-text-tertiary focus:ring-2 focus:ring-brand-blue-bg focus:border-input-border outline-none transition duration-150"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-[54px] bg-white border border-input-border text-text-primary text-base font-medium px-5 rounded-xl placeholder:text-text-tertiary focus:ring-2 focus:ring-brand-blue-bg focus:border-input-border outline-none transition duration-150"
              />
            </div>

            {/* Age and Gender Fields (Two columns on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
                  AGE
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="w-full h-[54px] bg-white border border-input-border text-text-primary text-base font-medium px-5 rounded-xl placeholder:text-text-tertiary focus:ring-2 focus:ring-brand-blue-bg focus:border-input-border outline-none transition duration-150"
                />
              </div>
              <div className="relative">
                <label htmlFor="gender" className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
                  GENDER
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-[54px] bg-white border border-input-border text-text-primary text-base font-medium px-5 rounded-xl appearance-none placeholder:text-text-tertiary focus:ring-2 focus:ring-brand-blue-bg focus:border-input-border outline-none transition duration-150"
                >
                  <option value="" disabled>Select option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {/* Custom dropdown arrow to match the design */}
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="absolute right-5 top-[60px] text-text-tertiary pointer-events-none">
                  <path d="M11 1L6 6L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full h-[54px] bg-white border border-input-border text-text-primary text-2xl font-black px-5 rounded-xl placeholder:text-text-tertiary placeholder:font-normal placeholder:text-base focus:ring-2 focus:ring-brand-blue-bg focus:border-input-border outline-none transition duration-150"
              />
            </div>

            {/* Register Button */}
            <button type="submit" className="w-full h-[54px] bg-brand-blue-btn hover:bg-brand-blue-dark text-white text-base font-bold rounded-xl transition duration-150 mt-10">
              Create Account
            </button>
          </form>

          {/* 3. Pre-Footer: Already have an account */}
          <div className="w-full text-center py-10 md:py-16">
            <p className="text-text-secondary text-base font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-brand-blue-icon font-bold hover:underline">
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