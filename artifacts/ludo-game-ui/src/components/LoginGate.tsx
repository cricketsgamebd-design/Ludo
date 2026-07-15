import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface LoginGateProps {
  onClose: () => void;
  message?: string;
}

export default function LoginGate({ onClose, message }: LoginGateProps) {
  const [, setLocation] = useLocation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #140B2E 0%, #0A061F 100%)',
          border: '2px solid #4A2A9D',
          boxShadow: '0 0 40px rgba(100,60,220,0.4)',
          borderRadius: '20px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '320px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #4FA6FF, #C33BFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          লগইন করুন
        </h2>

        <p style={{ fontSize: '13px', color: '#B0B8D8', marginBottom: '24px', lineHeight: '1.5' }}>
          {message ?? 'এই ফিচার ব্যবহার করতে প্রথমে অ্যাকাউন্ট তৈরি করুন বা লগইন করুন।'}
        </p>

        <button
          onClick={() => setLocation('/register')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(90deg, #4FA6FF, #7B4FFF)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          রেজিস্ট্রেশন করুন
        </button>

        <button
          onClick={() => setLocation('/login')}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '50px',
            border: '2px solid #3A2A7D',
            background: 'transparent',
            color: '#A090E0',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '14px',
          }}
        >
          আগেই অ্যাকাউন্ট আছে? লগইন করুন
        </button>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#6060A0',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          এখন না, পরে করব
        </button>
      </motion.div>
    </div>
  );
}
