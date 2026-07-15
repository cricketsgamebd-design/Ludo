import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Gift, Users, Trophy, BellRing, Check, LogIn,
  UserPlus, Gamepad2, MessageCircle, Swords, RefreshCw,
  Wrench, Megaphone, ArrowDownCircle, ArrowUpCircle,
  Star, Bell,
} from 'lucide-react';
import { useLocation } from 'wouter';

type TabKey = 'all' | 'friends' | 'match' | 'tournament' | 'rewards' | 'system';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'all',        label: 'সব',         emoji: '🔔' },
  { key: 'friends',    label: 'বন্ধু',       emoji: '👥' },
  { key: 'match',      label: 'ম্যাচ',       emoji: '⚔️' },
  { key: 'tournament', label: 'টুর্নামেন্ট', emoji: '🏆' },
  { key: 'rewards',    label: 'পুরস্কার',    emoji: '🎁' },
  { key: 'system',     label: 'সিস্টেম',     emoji: '⚙️' },
];

type NotifMeta = { icon: React.ReactNode; color: string; bg: string };

function getNotifMeta(type: string): NotifMeta {
  switch (type) {
    case 'friend_request':
      return { icon: <UserPlus size={18} />, color: '#4BFF63', bg: 'rgba(75,255,99,0.15)' };
    case 'friend_online':
      return { icon: <Users size={18} />, color: '#4BFF63', bg: 'rgba(75,255,99,0.12)' };
    case 'match_invite':
      return { icon: <Gamepad2 size={18} />, color: '#FF9020', bg: 'rgba(255,144,32,0.15)' };
    case 'match_ready':
      return { icon: <Swords size={18} />, color: '#FF9020', bg: 'rgba(255,144,32,0.12)' };
    case 'tournament_start':
      return { icon: <Trophy size={18} />, color: '#FFC92C', bg: 'rgba(255,201,44,0.15)' };
    case 'tournament_message':
      return { icon: <MessageCircle size={18} />, color: '#FFC92C', bg: 'rgba(255,201,44,0.12)' };
    case 'reward_received':
      return { icon: <Star size={18} />, color: '#C33BFF', bg: 'rgba(195,59,255,0.15)' };
    case 'gift':
      return { icon: <Gift size={18} />, color: '#FF4FA6', bg: 'rgba(255,79,166,0.15)' };
    case 'purchase':
      return { icon: <Gift size={18} />, color: '#FFC92C', bg: 'rgba(255,201,44,0.15)' };
    case 'deposit_success':
      return { icon: <ArrowDownCircle size={18} />, color: '#4BFF63', bg: 'rgba(75,255,99,0.12)' };
    case 'withdrawal_success':
      return { icon: <ArrowUpCircle size={18} />, color: '#4FA6FF', bg: 'rgba(79,166,255,0.12)' };
    case 'update_notice':
      return { icon: <RefreshCw size={18} />, color: '#00E5FF', bg: 'rgba(0,229,255,0.12)' };
    case 'maintenance_notice':
      return { icon: <Wrench size={18} />, color: '#FF5252', bg: 'rgba(255,82,82,0.15)' };
    case 'admin':
      return { icon: <Megaphone size={18} />, color: '#FF5252', bg: 'rgba(255,82,82,0.12)' };
    case 'invite':
      return { icon: <UserPlus size={18} />, color: '#4BFF63', bg: 'rgba(75,255,99,0.12)' };
    case 'welcome':
    default:
      return { icon: <BellRing size={18} />, color: '#4FA6FF', bg: 'rgba(79,166,255,0.12)' };
  }
}

function getTab(type: string): TabKey {
  if (['friend_request', 'friend_online', 'invite'].includes(type)) return 'friends';
  if (['match_invite', 'match_ready'].includes(type)) return 'match';
  if (['tournament_start', 'tournament_message'].includes(type)) return 'tournament';
  if (['reward_received', 'gift', 'purchase'].includes(type)) return 'rewards';
  if (['deposit_success', 'withdrawal_success', 'update_notice', 'maintenance_notice', 'admin', 'welcome'].includes(type)) return 'system';
  return 'system';
}

export default function Notifications() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const { data: user } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const { data: notifications, isLoading } = useListNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const markOneMutation = useMarkNotificationRead();
  const queryClient = useQueryClient();

  // Guest wall
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '64px', marginBottom: '20px' }}>🔔</motion.div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Notifications</h2>
        <p style={{ fontSize: '14px', color: '#7080B0', marginBottom: '28px', lineHeight: '1.6' }}>
          নোটিফিকেশন দেখতে আপনার অ্যাকাউন্টে লগইন করুন।
        </p>
        <button
          onClick={() => setLocation('/register')}
          style={{ width: '220px', padding: '13px', borderRadius: '50px', border: 'none', background: 'linear-gradient(90deg, #4FA6FF, #7B4FFF)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '10px' }}
        >
          রেজিস্ট্রেশন করুন
        </button>
        <button
          onClick={() => setLocation('/login')}
          style={{ background: 'none', border: '1.5px solid #3A2A7D', borderRadius: '50px', color: '#8090C0', padding: '10px 28px', fontSize: '14px', cursor: 'pointer' }}
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

  const allNotifs = notifications ?? [];
  const filtered = activeTab === 'all' ? allNotifs : allNotifs.filter(n => getTab(n.notifType) === activeTab);
  const unread = allNotifs.filter(n => !n.isRead).length;
  const tabUnread = (tab: TabKey) =>
    tab === 'all' ? unread : allNotifs.filter(n => !n.isRead && getTab(n.notifType) === tab).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-6">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 10px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
          নোটিফিকেশন
          {unread > 0 && (
            <span style={{ fontSize: '11px', background: '#C33BFF', borderRadius: '20px', padding: '2px 8px', marginLeft: '8px', fontWeight: 700 }}>
              {unread}
            </span>
          )}
        </h2>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(79,166,255,0.15)', border: '1px solid #3A6AC0', borderRadius: '20px', padding: '5px 12px', color: '#4FA6FF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Check size={13} /> সব পড়া হয়েছে
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 12px 12px', scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const cnt = tabUnread(tab.key);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '7px 12px',
                borderRadius: '20px',
                border: isActive ? '1px solid rgba(79,166,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(79,166,255,0.25), rgba(123,79,255,0.2))'
                  : 'rgba(255,255,255,0.04)',
                color: isActive ? '#fff' : '#6878A8',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {cnt > 0 && (
                <span style={{ background: '#FF3B5C', color: '#fff', fontSize: '10px', fontWeight: 800, borderRadius: '10px', padding: '1px 5px', marginLeft: '2px' }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FA6FF] mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '60px 24px', textAlign: 'center', color: '#6070A0' }}>
          <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontSize: '14px' }}>এই ক্যাটাগরিতে কোনো নোটিফিকেশন নেই।</p>
        </motion.div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 12px' }}>
        <AnimatePresence>
          {filtered.map((n, i) => {
            const meta = getNotifMeta(n.notifType);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.isRead && handleMarkOne(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '13px',
                  borderRadius: '14px',
                  cursor: n.isRead ? 'default' : 'pointer',
                  background: n.isRead
                    ? 'rgba(255,255,255,0.03)'
                    : 'linear-gradient(135deg, rgba(79,166,255,0.1) 0%, rgba(123,79,255,0.06) 100%)',
                  border: n.isRead ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(79,166,255,0.25)',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: meta.bg, color: meta.color,
                }}>
                  {meta.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: n.isRead ? '#909CC0' : '#fff' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4FA6FF', flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#6878A8', margin: 0, lineHeight: '1.5' }}>{n.message}</p>
                  <p style={{ fontSize: '10px', color: '#3D4870', margin: '4px 0 0' }}>
                    {new Date(n.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Type chip */}
                <div style={{
                  flexShrink: 0, fontSize: '9px', fontWeight: 700, padding: '3px 7px',
                  borderRadius: '8px', background: meta.bg, color: meta.color,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  alignSelf: 'flex-start',
                }}>
                  {n.notifType.replace(/_/g, ' ')}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
