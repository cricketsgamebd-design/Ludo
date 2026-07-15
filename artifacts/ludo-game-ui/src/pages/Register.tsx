import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useRegisterUser } from '@workspace/api-client-react';

export default function Register() {
  const [, setLocation] = useLocation();
  const registerMutation = useRegisterUser();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    registerMutation.mutate({ 
      data: { 
        username, 
        email, 
        password,
        inviteCode: inviteCode || null
      } 
    }, {
      onSuccess: (res) => {
        localStorage.setItem("ludo_token", res.token);
        window.location.href = "/";
      },
      onError: (err: any) => {
        setErrorMsg(err.message || 'Registration failed. Try a different username/email.');
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-[#0F0C1F] to-[#2A0066]">
      {/* Decorative background elements */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-[#C33BFF] rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">JOIN <span className="gradient-text">ARENA</span></h1>
          <p className="text-gray-400 text-sm">Create your gamer profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl text-sm text-center">
              {errorMsg}
            </div>
          )}
          
          <div>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#C33BFF] transition-colors placeholder:text-gray-500"
            />
          </div>

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#C33BFF] transition-colors placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#C33BFF] transition-colors placeholder:text-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="Invite Code (Optional)"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#C33BFF] transition-colors placeholder:text-gray-500 text-center font-mono uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-gradient-to-r from-[#C33BFF] to-[#6D1CC9] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(195,59,255,0.5)] hover:shadow-[0_0_30px_rgba(195,59,255,0.7)] transition-all active:scale-95 disabled:opacity-70 mt-2"
          >
            {registerMutation.isPending ? 'CREATING PROFILE...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C33BFF] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}