import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetGlobalRankings, useGetFriendsRankings, getGetGlobalRankingsQueryKey, getGetFriendsRankingsQueryKey } from '@workspace/api-client-react';
import { Trophy, Crown, Medal } from 'lucide-react';

export default function Rankings() {
  const [tab, setTab] = useState<'GLOBAL' | 'FRIENDS'>('GLOBAL');
  
  const { data: globalData, isLoading: loadingGlobal } = useGetGlobalRankings({
    query: { enabled: tab === 'GLOBAL', queryKey: getGetGlobalRankingsQueryKey() }
  });
  
  const { data: friendsData, isLoading: loadingFriends } = useGetFriendsRankings({
    query: { enabled: tab === 'FRIENDS', queryKey: getGetFriendsRankingsQueryKey() }
  });

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
    if (rank === 2) return 'bg-gradient-to-r from-[#2A3F5A] to-[#111A2C] border-[#546E94]';
    if (rank === 3) return 'bg-gradient-to-r from-[#5A2C1A] to-[#2C1208] border-[#A85834]';
    return 'bg-[#0B1038] border-[#3A2A9D]';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0 sticky top-0 z-10 bg-[#0F0C1F]">
        <h1 className="text-2xl font-black text-white italic tracking-wider text-center mb-4 flex items-center justify-center gap-2">
          <Trophy className="text-[#FFC92C]" /> LEADERBOARD
        </h1>
        
        <div className="flex rounded-xl p-1 bg-[#060A2D] border border-[#3A2A9D] mb-4">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'GLOBAL' ? 'bg-[#2A7FEF] text-white shadow-[0_0_10px_#2A7FEF]' : 'text-gray-400'}`}
            onClick={() => setTab('GLOBAL')}
          >
            GLOBAL
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'FRIENDS' ? 'bg-[#1EA63D] text-white shadow-[0_0_10px_#1EA63D]' : 'text-gray-400'}`}
            onClick={() => setTab('FRIENDS')}
          >
            FRIENDS
          </button>
        </div>
      </div>

      <div className="p-3 pb-20 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC92C]"></div>
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No rankings available.</div>
        ) : (
          <div className="space-y-2">
            {data?.map((entry, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={`${entry.userId}-${tab}`}
                className={`flex items-center p-3 rounded-xl border ${getRowBg(entry.rank)}`}
              >
                <div className="w-10 flex justify-center items-center flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="avatar w-10 h-10 border-2 mx-3 flex-shrink-0" style={{ transform: 'scale(0.8)' }}>
                  <div className="avatar-inner text-sm">👤</div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[15px] truncate">{entry.username}</div>
                  <div className="text-[11px] text-[#4FA6FF] font-mono">Lv. {entry.level}</div>
                </div>
                
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="text-[#FFC92C] font-bold text-sm flex items-center gap-1">
                    🪙 {entry.coins >= 1000 ? `${(entry.coins/1000).toFixed(1)}k` : entry.coins}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}