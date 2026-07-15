import React from 'react';
import { motion } from 'framer-motion';
import {
  useListNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useGetMe,
  getGetMeQueryKey,
  getListNotificationsQueryKey,
  getGetUnreadCountQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Gift, Users, Trophy, BellRing, Check, LogIn } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const { data: notifications, isLoading } = useListNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const markOneMutation = useMarkNotificationRead();
  const queryClient = useQueryClient();

  // Guest wall
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔔</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Notifications</h2>
        <p style={{ fontSize: '14px', color: '#7080B0', marginBottom: '28px', lineHeight: '1.6' }}>
          নোটিফিকেশন দেখতে আপনার অ্যাকাউন্টে লগইন করুন।
        </p>
        <button
          onClick={() => setLocation('/register')}
          style={{
            width: '220px',
            padding: '13px',
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
            background: 'none',
            border: '1.5px solid #3A2A7D',
            borderRadius: '50px',
            color: '#8090C0',
            padding: '10px 28px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  const handleMarkAll = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() });
      },
    });
  };

  const handleMarkOne = (id: number) => {
    markOneMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() });
      },
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Gift size={20} className="text-[#FFC92C]" />;
      case 'invite':   return <Users size={20} className="text-[#4BFF63]" />;
      case 'welcome':  return <BellRing size={20} className="text-[#4FA6FF]" />;
      default:         return <Trophy size={20} className="text-[#C33BFF]" />;
    }
  };

  const unread = (notifications ?? []).filter(n => !n.isRead).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-6">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
          Notifications {unread > 0 && (
            <span style={{ fontSize: '12px', background: '#C33BFF', borderRadius: '20px', padding: '2px 8px', marginLeft: '6px' }}>
              {unread}
            </span>
          )}
        </h2>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(79,166,255,0.15)', border: '1px solid #3A6AC0',
              borderRadius: '20px', padding: '5px 12px',
              color: '#4FA6FF', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Check size={13} /> Mark all read
          </button>
        )}
      </div>

      {isLoading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#4FA6FF' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FA6FF] mx-auto" />
        </div>
      )}

      {!isLoading && (notifications ?? []).length === 0 && (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#6070A0' }}>
          <BellRing size={40} style={{ margin: '0 auto 12px' }} />
          <p>কোনো নোটিফিকেশন নেই।</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
        {(notifications ?? []).map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => !n.isRead && handleMarkOne(n.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px',
              borderRadius: '14px',
              cursor: n.isRead ? 'default' : 'pointer',
              background: n.isRead
                ? 'rgba(255,255,255,0.03)'
                : 'linear-gradient(135deg, rgba(79,166,255,0.12) 0%, rgba(123,79,255,0.08) 100%)',
              border: n.isRead ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(79,166,255,0.3)',
              boxShadow: n.isRead ? 'none' : '0 0 12px rgba(79,166,255,0.08)',
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
            }}>
              {getIcon(n.notifType)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: n.isRead ? '#B0B8D8' : '#fff' }}>
                  {n.title}
                </span>
                {!n.isRead && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4FA6FF', flexShrink: 0 }} />
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#6878A8', margin: 0, lineHeight: '1.5' }}>{n.message}</p>
              <p style={{ fontSize: '11px', color: '#3D4870', margin: '4px 0 0', }}>
                {new Date(n.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
