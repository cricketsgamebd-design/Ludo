import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import ludoBanner from '/ludo-banner.png';
import { useGetInviteCode, useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import LoginGate from '../components/LoginGate';

export default function Home() {
  const [showInvite, setShowInvite] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [loginGateMsg, setLoginGateMsg] = useState<string | undefined>();
  const [, setLocation] = useLocation();

  const { data: user } = useGetMe({
    query: { retry: false, queryKey: getGetMeQueryKey() }
  });

  const requireLogin = (msg: string) => {
    if (user) return true;
    setLoginGateMsg(msg);
    setShowLoginGate(true);
    return false;
  };

  const handleTournament = () => {
    if (!requireLogin('টুর্নামেন্টে অংশগ্রহণ করতে প্রথমে রেজিস্ট্রেশন করুন এবং লগইন করুন।')) return;
    // TODO: navigate to tournament page
  };

  const handleInvite = () => {
    if (!requireLogin('Invite code দেখতে প্রথমে লগইন করুন।')) return;
    setShowInvite(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-6"
    >
      {/* GAME BOARD */}
      <div className="game-board mt-3">
        <img
          src={ludoBanner}
          alt="Ludo Banner"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1611996575749-79a3a250f563?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* MODES */}
      <div className="modes">
        {/* Online — available to all */}
        <div className="mode-card" style={{
          background: 'linear-gradient(180deg, #0D4EA6 0%, #082A68 50%, #041C48 100%)',
          border: '2px solid #2A7FEF', boxShadow: '0 0 16px #3FC5FF',
        }}>
          <div className="icon">🌍</div>
          <div className="content">
            <strong>ONLINE</strong>
            <small>Play With Real Players</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #4FA6FF, #0D4EA6)', boxShadow: '0 0 8px #3FC5FF' }}>➤</div>
        </div>

        {/* With Friend — available to all */}
        <div className="mode-card" style={{
          background: 'linear-gradient(180deg, #0D6B2E 0%, #014A1A 50%, #012D10 100%)',
          border: '2px solid #1EA63D', boxShadow: '0 0 16px #4BFF63',
        }}>
          <div className="icon">🦸</div>
          <div className="content">
            <strong>WITH FRIEND</strong>
            <small>Play With Your Friends</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #5CE87A, #0D6B2E)', boxShadow: '0 0 8px #4BFF63' }}>➤</div>
        </div>

        {/* Computer — available to all */}
        <div className="mode-card" style={{
          background: 'linear-gradient(180deg, #4A177B 0%, #2A0A4F 50%, #18062F 100%)',
          border: '2px solid #8B27D9', boxShadow: '0 0 16px #C33BFF',
        }}>
          <div className="icon">🤖</div>
          <div className="content">
            <strong>COMPUTER</strong>
            <small>Play Against Computer</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #C97BFF, #4A177B)', boxShadow: '0 0 8px #C33BFF' }}>➤</div>
        </div>

        {/* Tournament — requires login */}
        <div
          className="mode-card"
          style={{
            background: 'linear-gradient(180deg, #6A3A1A 0%, #4B2815 50%, #2C170C 100%)',
            border: '2px solid #B76818', boxShadow: '0 0 16px #FFAE33',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={handleTournament}
        >
          <div className="icon">🏆</div>
          <div className="content">
            <strong>TOURNAMENT</strong>
            <small>Show the talent and Get The reward</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #FFC873, #6A3A1A)', boxShadow: '0 0 8px #FFAE33' }}>➤</div>
          {/* Lock badge for guests */}
          {!user && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '42px',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid #B76818',
              borderRadius: '20px',
              fontSize: '10px',
              color: '#FFC873',
              padding: '2px 8px',
              fontWeight: 700,
            }}>
              🔒 লগইন লাগবে
            </div>
          )}
        </div>
      </div>

      {/* INVITE & EARN */}
      <div className="invite">
        <div className="invite-content">
          <strong>INVITE &amp; EARN</strong><br />
          <small style={{ fontSize: '12px', color: '#FFFFFF' }}>
            Invite your friends and earn exciting rewards
          </small>
        </div>
        <div className="coin-scatter">
          💰
          <span className="mini-coin c1">🪙</span>
          <span className="mini-coin c2">🪙</span>
          <span className="mini-coin c3">🪙</span>
          <span className="mini-coin c4">🪙</span>
          <span className="mini-coin c5">🪙</span>
          <span className="mini-coin c6">🪙</span>
        </div>
        <button className="invite-btn" onClick={handleInvite}>INVITE NOW</button>
      </div>

      {/* RANKINGS TEASERS */}
      <div className="rankings mt-2">
        <div
          className="ranking-card"
          style={{
            background: 'linear-gradient(180deg, #0E4A9A 0%, #082A68 50%, #051C49 100%)',
            border: '2px solid #1E6EDB', boxShadow: '0 0 16px #2FAEFF',
            cursor: 'pointer',
          }}
          onClick={() => setLocation('/rankings')}
        >
          <div className="icon">🏆</div>
          <div className="content">
            <strong>GLOBAL RANKING</strong>
            <small>see top players around the world</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #4FA6FF, #0E4A9A)', boxShadow: '0 0 8px #2FAEFF' }}>➤</div>
        </div>
        <div
          className="ranking-card"
          style={{
            background: 'linear-gradient(180deg, #0F6B2A 0%, #02501A 50%, #013816 100%)',
            border: '2px solid #179C3E', boxShadow: '0 0 16px #2EEB5B',
            cursor: 'pointer',
          }}
          onClick={() => setLocation('/rankings')}
        >
          <div className="icon">🏅</div>
          <div className="content">
            <strong>FRIENDS RANKING</strong>
            <small>see the ranking of your friends</small>
          </div>
          <div className="card-arrow" style={{ background: 'linear-gradient(180deg, #5CE87A, #0F6B2A)', boxShadow: '0 0 8px #2EEB5B' }}>➤</div>
        </div>
      </div>

      {showLoginGate && (
        <LoginGate message={loginGateMsg} onClose={() => setShowLoginGate(false)} />
      )}
      {showInvite && user && (
        <InviteModal onClose={() => setShowInvite(false)} />
      )}
    </motion.div>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const { data: inviteInfo, isLoading } = useGetInviteCode();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm glass-panel p-6 rounded-2xl neon-border text-center text-white"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">Invite Friends</h2>
        <p className="text-sm text-gray-300 mb-6">
          Share your code and earn coins when they join!
        </p>

        {isLoading ? (
          <div className="py-8 animate-pulse text-[#4FA6FF]">Loading your code...</div>
        ) : (
          <>
            <div className="bg-[#060A2D] border-2 border-[#3A2A9D] rounded-xl p-4 mb-4">
              <div className="text-xs text-gray-400 mb-1">Your Invite Code</div>
              <div className="text-3xl font-mono tracking-widest text-[#FFC92C] font-bold">
                {inviteInfo?.inviteCode}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0B1038] border border-[#5D53B8] p-3 rounded-xl">
                <div className="text-xs text-gray-400">Total Invited</div>
                <div className="text-xl font-bold text-white">{inviteInfo?.totalInvited}</div>
              </div>
              <div className="bg-[#0B1038] border border-[#5D53B8] p-3 rounded-xl">
                <div className="text-xs text-gray-400">Coins Earned</div>
                <div className="text-xl font-bold text-[#FFC92C]">🪙 {inviteInfo?.coinsEarned}</div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mb-4">
              New member gets 1,000 coins · You get 100 coins per invite
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 font-bold"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
