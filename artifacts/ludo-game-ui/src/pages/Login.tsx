import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useLoginUser } from '@workspace/api-client-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const loginMutation = useLoginUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (res) => {
        localStorage.setItem("ludo_token", res.token);
        // hard reload to fetch user data cleanly
        window.location.href = "/";
      },
      onError: (err: any) => {
        setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-[#0F0C1F] to-[#2A0066]">
      {/* Decorative background elements */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#6D1CC9] rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-[#3FC5FF] rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6D1CC9] to-[#FF5CE8] mb-4 shadow-[0_0_30px_rgba(255,92,232,0.4)]">
            <span className="text-4xl">🎲</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">LUDO <span className="gradient-text">ARENA</span></h1>
          <p className="text-gray-400 text-sm">Enter the ultimate gaming experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl text-sm text-center">
              {errorMsg}
            </div>
          )}
          
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#4FA6FF] transition-colors placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#060A2D]/80 border-2 border-[#3A2A9D] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#4FA6FF] transition-colors placeholder:text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-[#4FA6FF] to-[#6D1CC9] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(109,28,201,0.5)] hover:shadow-[0_0_30px_rgba(79,166,255,0.7)] transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loginMutation.isPending ? 'CONNECTING...' : 'LOGIN TO PLAY'} 🚀
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#3FC5FF] font-bold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}