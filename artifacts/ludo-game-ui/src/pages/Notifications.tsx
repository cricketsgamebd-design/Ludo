import React from 'react';
import { motion } from 'framer-motion';
import { 
  useListNotifications, 
  useMarkAllNotificationsRead, 
  useMarkNotificationRead,
  getListNotificationsQueryKey,
  getGetUnreadCountQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Gift, Users, Trophy, BellRing, Check } from 'lucide-react';

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const markOneMutation = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const handleMarkAll = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() });
      }
    });
  };

  const handleMarkRead = (id: number, isRead: boolean) => {
    if (isRead) return;
    markOneMutation.mutate({ id }, {
      onSuccess: () => {
        // Update local cache optimistically
        queryClient.setQueryData(getListNotificationsQueryKey(), (old: any) => {
          if (!old) return old;
          return old.map((n: any) => n.id === id ? { ...n, isRead: true } : n);
        });
        queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() });
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'GIFT': return <Gift className="text-[#FFC92C]" size={24} />;
      case 'FRIEND_REQUEST': return <Users className="text-[#3FC5FF]" size={24} />;
      case 'TOURNAMENT': return <Trophy className="text-[#C33BFF]" size={24} />;
      default: return <BellRing className="text-gray-400" size={24} />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'GIFT': return 'from-[#6A3A1A] to-[#2C170C] border-[#B76818]';
      case 'FRIEND_REQUEST': return 'from-[#0D4EA6] to-[#041C48] border-[#2A7FEF]';
      case 'TOURNAMENT': return 'from-[#4A177B] to-[#18062F] border-[#8B27D9]';
      default: return 'from-[#181136] to-[#0A071A] border-[#3A2A9D]';
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-[#3A2A9D] bg-[#0F0C1F] sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          Inbox {unreadCount > 0 && <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
        </h1>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAll}
            disabled={markAllMutation.isPending}
            className="text-xs text-[#4FA6FF] font-bold flex items-center gap-1 hover:text-white transition-colors"
          >
            <Check size={14} /> MARK ALL READ
          </button>
        )}
      </div>

      <div className="p-3 pb-20 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FA6FF]"></div>
          </div>
        ) : notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <BellRing size={48} className="mb-4 opacity-20" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications?.map((notif, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={notif.id}
                onClick={() => handleMarkRead(notif.id, notif.isRead)}
                className={`relative p-4 rounded-xl border-2 bg-gradient-to-r ${getBgClass(notif.notifType)} cursor-pointer overflow-hidden ${!notif.isRead ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'opacity-70'}`}
              >
                {!notif.isRead && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_#f00]"></div>
                )}
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notif.notifType)}
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className={`font-bold text-[15px] mb-1 ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                      {notif.title}
                    </h3>
                    <p className="text-[13px] text-gray-400 leading-snug">
                      {notif.message}
                    </p>
                    <div className="text-[10px] text-gray-500 mt-2 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
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