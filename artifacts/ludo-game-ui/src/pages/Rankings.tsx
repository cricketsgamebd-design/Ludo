import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  useGetGlobalRankings, useGetFriendsRankings,
  useGetMe,
  getGetGlobalRankingsQueryKey, getGetFriendsRankingsQueryKey, getGetMeQueryKey,
} from '@workspace/api-client-react';
import { Trophy, Crown, Medal } from 'lucide-react';
import LoginGate from '../components/LoginGate';

export default function Rankings() {
  const [tab, setTab] = useState<'GLOBAL' | 'FRIENDS'>('GLOBAL');
  const [showLoginGate, setShowLoginGate] = useState(false);

  const { data: user } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });

  const { data: globalData, isLoading: loadingGlobal } = useGetGlobalRankings({
    query: { enabled: tab === 'GLOBAL', queryKey: getGetGlobalRankingsQueryKey() }
  });

  const { data: friendsData, isLoading: loadingFriends } = useGetFriendsRankings({
    query: { enabled: tab === 'FRIENDS' && !!user, queryKey: getGetFriendsRankingsQueryKey() }
  });

  const handleFriendsTab = () => {
    if (!user) { setShowLoginGate(true); return; }
    setTab('FRIENDS');
  };

  const isLoading = tab === 'GLOBAL' ? loadingGlobal : loadingFriends;
  const data = tab === 'GLOBAL' ? globalData : friendsData;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-[#FFC92C] drop-shadow-[0_0_8px_rgba(255,201,44,0.8)]" size={24} />;
      case 2: return <Medal className="text-[#E0E0E0] drop-shadow-[0_0_8px_rgba(224,224,224,0.6)]" size={24} />;
      case 3: return <Medal className="text-[#CD7F32] drop-shadow-[0_0_8px_rgba(205,127,50,0.6)]" size={24} />;
      default: return <span className="text-gray-400 font-bold font-mono text-lg">{rank}</span>;
    }
  };

  const getRowBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-[#6A3A1A] to-[#2C170C] border-[#B76818]';
    if (rank === 2) return 'bg-gradient-to-r from-[#2A2A3A] to-[#18182A] border-[#707090]';
    if (rank === 3) return 'bg-gradient-to-r from-[#3A2A0E] to-[#22160A] border-[#7A5020]';
    return 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-6">
      {/* Tab Switcher */}
      <div style={{ display: 'flex', margin: '14px 12px 12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2A2060', background: '#0A0720' }}>
        <button
          onClick={() => setTab('GLOBAL')}
          style={{
            flex: 1, padding: '11px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
            background: tab === 'GLOBAL' ? 'linear-gradient(90deg, #4FA6FF, #7B4FFF)' : 'transparent',
            color: tab === 'GLOBAL' ? '#fff' : '#5060A0',
            transition: 'all 0.2s',
          }}
        >
          🌍 GLOBAL
        </button>
        <button
          onClick={handleFriendsTab}
          style={{
            flex: 1, padding: '11px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
            background: tab === 'FRIENDS' ? 'linear-gradient(90deg, #4BFF63, #0D6B2E)' : 'transparent',
            color: tab === 'FRIENDS' ? '#fff' : '#5060A0',
            transition: 'all 0.2s',
          }}
        >
          🏅 FRIENDS {!user && <span style={{ fontSize: '10px' }}>🔒</span>}
        </button>
      </div>

      {isLoading && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FA6FF] mx-auto" />
        </div>
      )}

      {tab === 'FRIENDS' && !user && (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6070A0' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <p>Friends ranking দেখতে লগইন করুন।</p>
        </div>
      )}

      {!isLoading && (data ?? []).length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6070A0' }}>
          <Trophy size={40} style={{ margin: '0 auto 12px' }} />
          <p>কোনো তথ্য পাওয়া যায়নি।</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 10px' }}>
        {(data ?? []).map((entry, i) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 p-3 rounded-xl border ${getRowBg(entry.rank)}`}
          >
            {/* Rank */}
            <div style={{ width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2A1060, #0A0520)',
              border: entry.rank <= 3 ? '2px solid #C33BFF' : '1px solid #2A2060',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0,
            }}>
              👤
            </div>

            {/* Name + level */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px', fontWeight: 700,
                color: entry.rank === 1 ? '#FFC92C' : '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {entry.username}
                {user && entry.userId === user.id && (
                  <span style={{ fontSize: '10px', color: '#4FA6FF', marginLeft: '6px' }}>YOU</span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#6070A0' }}>Level {entry.level}</div>
            </div>

            {/* Coins */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFC92C' }}>
                🪙 {entry.coins.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showLoginGate && (
        <LoginGate
          message="Friends ranking দেখতে প্রথমে লগইন করুন।"
          onClose={() => setShowLoginGate(false)}
        />
      )}
    </motion.div>
  );
}
