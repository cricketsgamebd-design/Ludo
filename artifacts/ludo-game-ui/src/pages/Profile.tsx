import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetMe, getGetMeQueryKey,
} from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import {
  User, Edit3, Camera, Globe, Volume2, Music, Vibrate,
  Monitor, Shield, Link2, ArrowDownCircle, ArrowUpCircle,
  Clock, Share2, HelpCircle, FileText, Lock, LogOut,
  ChevronRight, Settings, Crown, Gamepad2,
} from 'lucide-react';

// ─── Local settings hook ─────────────────────────────────────────────────────
function useSetting<T>(key: string, def: T): [T, (v: T) => void] {
  const stored = localStorage.getItem(key);
  const [val, setVal] = useState<T>(stored !== null ? JSON.parse(stored) : def);
  const set = (v: T) => { localStorage.setItem(key, JSON.stringify(v)); setVal(v); };
  return [val, set];
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({
  icon, label, sublabel, value, onChange,
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', cursor: 'pointer' }}
      onClick={() => onChange(!value)}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79,166,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4FA6FF', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#E0E8FF' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '11px', color: '#5060A0', marginTop: '1px' }}>{sublabel}</div>}
      </div>
      {/* Toggle switch */}
      <div style={{
        width: '44px', height: '24px', borderRadius: '12px', position: 'relative', flexShrink: 0,
        background: value ? 'linear-gradient(90deg, #4FA6FF, #7B4FFF)' : 'rgba(255,255,255,0.1)',
        transition: 'background 0.25s',
      }}>
        <div style={{
          position: 'absolute', top: '3px', left: value ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)', transition: 'left 0.25s',
        }} />
      </div>
    </div>
  );
}

// ─── Select row ──────────────────────────────────────────────────────────────
function SelectRow({
  icon, label, value, options, onChange,
}: {
  icon: React.ReactNode; label: string;
  value: string; options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value)?.label ?? value;
  return (
    <div style={{ padding: '14px 0', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79,166,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4FA6FF', flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E0E8FF' }}>{label}</div>
        </div>
        <span style={{ fontSize: '12px', color: '#4FA6FF', fontWeight: 600 }}>{current}</span>
        <ChevronRight size={14} style={{ color: '#4060A0', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginLeft: '48px', marginTop: '4px' }}
          >
            {options.map(o => (
              <div
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  padding: '8px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
                  color: value === o.value ? '#4FA6FF' : '#8090C0',
                  background: value === o.value ? 'rgba(79,166,255,0.1)' : 'transparent',
                  fontWeight: value === o.value ? 700 : 400,
                }}
              >
                {o.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Arrow row ────────────────────────────────────────────────────────────────
function ArrowRow({
  icon, label, sublabel, onClick, accent, danger,
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  onClick?: () => void; accent?: boolean; danger?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? 'rgba(255,82,82,0.12)' : accent ? 'rgba(75,255,99,0.12)' : 'rgba(79,166,255,0.12)',
        color: danger ? '#FF5252' : accent ? '#4BFF63' : '#4FA6FF',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: danger ? '#FF5252' : '#E0E8FF' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '11px', color: '#5060A0', marginTop: '1px' }}>{sublabel}</div>}
      </div>
      {onClick && <ChevronRight size={14} style={{ color: danger ? '#FF5252' : '#3050A0' }} />}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '0 12px 14px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#4060A0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', paddingLeft: '4px' }}>
        {title}
      </div>
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '0 14px',
      }}>
        {React.Children.map(children, (child, i) => (
          <>
            {i > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 -2px' }} />}
            {child}
          </>
        ))}
      </div>
    </div>
  );
}

// ─── Coming Soon modal ────────────────────────────────────────────────────────
function ComingSoonModal({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
    >
      <motion.div
        initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: 'linear-gradient(180deg, #1A1040 0%, #100830 100%)', borderRadius: '24px 24px 0 0', padding: '28px 20px 40px', border: '1px solid rgba(79,166,255,0.2)', borderBottom: 'none' }}
      >
        <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2060', margin: '0 auto 20px' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚀</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{label}</h3>
          <p style={{ fontSize: '13px', color: '#6878A8', marginBottom: '24px' }}>এই ফিচারটি শীঘ্রই আসছে!</p>
          <button
            onClick={onClose}
            style={{ padding: '12px 40px', borderRadius: '50px', background: 'linear-gradient(90deg, #4FA6FF, #7B4FFF)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            ঠিক আছে
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Avatar picker ────────────────────────────────────────────────────────────
const AVATARS = ['👤','🦁','🐯','🐼','🦊','🐺','🦅','🐉','🦋','🌟','🔥','💎'];
function AvatarModal({ current, onSelect, onClose }: { current: string; onSelect: (a: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
    >
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: 'linear-gradient(180deg, #1A1040 0%, #100830 100%)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', border: '1px solid rgba(79,166,255,0.2)', borderBottom: 'none' }}
      >
        <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2060', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '20px' }}>অ্যাভাটার বেছে নিন</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          {AVATARS.map(a => (
            <button
              key={a}
              onClick={() => { onSelect(a); onClose(); }}
              style={{
                fontSize: '28px', padding: '10px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: a === current ? 'rgba(79,166,255,0.25)' : 'rgba(255,255,255,0.06)',
                outline: a === current ? '2px solid #4FA6FF' : 'none',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Edit Profile modal ───────────────────────────────────────────────────────
function EditProfileModal({ username: initialUsername, onClose }: { username: string; onClose: () => void }) {
  const [username, setUsername] = useState(initialUsername);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
    >
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', background: 'linear-gradient(180deg, #1A1040 0%, #100830 100%)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', border: '1px solid rgba(79,166,255,0.2)', borderBottom: 'none' }}
      >
        <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2060', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '20px' }}>প্রোফাইল এডিট করুন</h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#6070A0', fontWeight: 600, display: 'block', marginBottom: '6px' }}>ইউজারনেম</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(79,166,255,0.2)', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <p style={{ fontSize: '11px', color: '#4060A0', marginBottom: '20px', textAlign: 'center' }}>
          আরো সম্পাদনা ফিচার শীঘ্রই আসছে
        </p>
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '13px', borderRadius: '50px', background: 'linear-gradient(90deg, #4FA6FF, #7B4FFF)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
        >
          সংরক্ষণ করুন
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Profile() {
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });

  // Settings state
  const [sound, setSound]       = useSetting('s_sound',    true);
  const [music, setMusic]       = useSetting('s_music',    true);
  const [vibration, setVibration] = useSetting('s_vibration', true);
  const [graphics, setGraphics] = useSetting('s_graphics', 'high');
  const [language, setLanguage] = useSetting('s_language', 'bn');
  const [profileVisible, setProfileVisible] = useSetting('s_profile_visible', true);
  const [onlineStatus, setOnlineStatus]     = useSetting('s_online_status', true);
  const [avatar, setAvatar]     = useSetting('s_avatar', '👤');

  // Modal states
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showEditProfile,  setShowEditProfile]  = useState(false);
  const [comingSoon, setComingSoon] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Guest view
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '64px', marginBottom: '20px' }}>👤</motion.div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>প্রোফাইল</h2>
        <p style={{ fontSize: '14px', color: '#7080B0', marginBottom: '28px', lineHeight: '1.6' }}>
          প্রোফাইল দেখতে লগইন করুন।
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

  const handleLogout = () => {
    localStorage.removeItem('ludo_token');
    window.location.href = '/';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-8">

      {/* ── Hero section ── */}
      <div style={{
        margin: '12px 12px 20px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #1A0E40 0%, #2A1060 50%, #1A0E40 100%)',
        border: '1px solid rgba(123,79,255,0.3)',
        padding: '24px 16px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '80px', background: 'rgba(123,79,255,0.2)', borderRadius: '50%', filter: 'blur(30px)' }} />

        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto',
            background: 'linear-gradient(135deg, #3A1A70, #201060)',
            border: '3px solid rgba(123,79,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
          }}>
            {avatar}
          </div>
          <button
            onClick={() => setShowAvatarPicker(true)}
            style={{
              position: 'absolute', bottom: 0, right: -4,
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4FA6FF, #7B4FFF)',
              border: '2px solid #100830', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Camera size={12} color="#fff" />
          </button>
        </div>

        {/* Name & badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>{user.username}</h2>
          {user.isAdmin && (
            <span style={{ background: 'rgba(255,82,82,0.2)', color: '#FF5252', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(255,82,82,0.4)' }}>ADMIN</span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: '#6070A0', marginBottom: '18px' }}>{user.email}</div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {[
            { label: 'Level', value: user.level, icon: <Crown size={14} color="#FFC92C" /> },
            { label: 'Coins', value: user.coins.toLocaleString(), icon: <span style={{ fontSize: '14px' }}>🪙</span> },
            { label: 'Rank', value: '#—', icon: <span style={{ fontSize: '14px' }}>🏆</span> },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                {stat.icon}
                <span>{stat.value}</span>
              </div>
              <div style={{ fontSize: '10px', color: '#5060A0', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Account ── */}
      <Section title="অ্যাকাউন্ট">
        <ArrowRow icon={<Edit3 size={16} />} label="প্রোফাইল এডিট করুন" sublabel="নাম ও তথ্য পরিবর্তন করুন" onClick={() => setShowEditProfile(true)} />
        <ArrowRow icon={<Camera size={16} />} label="অ্যাভাটার পরিবর্তন করুন" sublabel="প্রোফাইল ছবি বেছে নিন" onClick={() => setShowAvatarPicker(true)} />
      </Section>

      {/* ── Game Settings ── */}
      <Section title="গেম সেটিংস">
        <SelectRow
          icon={<Globe size={16} />} label="ভাষা / Language"
          value={language} onChange={setLanguage}
          options={[{ value: 'bn', label: '🇧🇩 বাংলা' }, { value: 'en', label: '🇺🇸 English' }]}
        />
        <ToggleRow icon={<Volume2 size={16} />} label="সাউন্ড" sublabel="গেমের শব্দ চালু/বন্ধ" value={sound} onChange={setSound} />
        <ToggleRow icon={<Music size={16} />} label="মিউজিক" sublabel="ব্যাকগ্রাউন্ড সংগীত" value={music} onChange={setMusic} />
        <ToggleRow icon={<Vibrate size={16} />} label="ভাইব্রেশন" sublabel="স্পর্শ কম্পন" value={vibration} onChange={setVibration} />
        <SelectRow
          icon={<Monitor size={16} />} label="গ্রাফিক্স মান"
          value={graphics} onChange={setGraphics}
          options={[
            { value: 'low',    label: 'Low — কম ব্যাটারি' },
            { value: 'medium', label: 'Medium — সুষম' },
            { value: 'high',   label: 'High — সেরা মান' },
          ]}
        />
      </Section>

      {/* ── Privacy ── */}
      <Section title="প্রাইভেসি">
        <ToggleRow icon={<Shield size={16} />} label="প্রোফাইল দৃশ্যমান" sublabel="অন্যরা আপনার প্রোফাইল দেখতে পাবে" value={profileVisible} onChange={setProfileVisible} />
        <ToggleRow icon={<User size={16} />} label="অনলাইন স্ট্যাটাস" sublabel="বন্ধুরা দেখতে পাবেন আপনি অনলাইনে" value={onlineStatus} onChange={setOnlineStatus} />
      </Section>

      {/* ── Linked Accounts ── */}
      <Section title="লিঙ্কড অ্যাকাউন্ট">
        <ArrowRow icon={<span style={{ fontSize: '16px' }}>🇬</span>} label="Google" sublabel="সংযোগ করুন" onClick={() => setComingSoon('Google লিঙ্ক')} />
        <ArrowRow icon={<span style={{ fontSize: '16px' }}>📘</span>} label="Facebook" sublabel="সংযোগ করুন" onClick={() => setComingSoon('Facebook লিঙ্ক')} />
      </Section>

      {/* ── Finance ── */}
      <Section title="ফাইন্যান্স">
        <ArrowRow icon={<ArrowDownCircle size={16} />} label="ডিপোজিট" sublabel="কয়েন কিনুন বা যোগ করুন" accent onClick={() => setComingSoon('ডিপোজিট')} />
        <ArrowRow icon={<ArrowUpCircle size={16} />} label="উইথড্র" sublabel="ব্যালেন্স তুলুন" onClick={() => setComingSoon('উইথড্র')} />
        <ArrowRow icon={<Clock size={16} />} label="ট্রানজেকশন হিস্ট্রি" sublabel="আপনার সকল লেনদেন" onClick={() => setComingSoon('ট্রানজেকশন হিস্ট্রি')} />
        <ArrowRow icon={<Share2 size={16} />} label="রেফারেল হিস্ট্রি" sublabel="আপনার আমন্ত্রণের পুরস্কার" onClick={() => setComingSoon('রেফারেল হিস্ট্রি')} />
      </Section>

      {/* ── Admin (if admin) ── */}
      {user.isAdmin && (
        <Section title="অ্যাডমিন">
          <ArrowRow icon={<Settings size={16} />} label="অ্যাডমিন প্যানেল" sublabel="বান্ডেল ও ব্যবহারকারী পরিচালনা" onClick={() => setLocation('/admin')} />
        </Section>
      )}

      {/* ── Support ── */}
      <Section title="সাপোর্ট">
        <ArrowRow icon={<HelpCircle size={16} />} label="সাপোর্ট" sublabel="সমস্যায় সাহায্য পান" onClick={() => setComingSoon('সাপোর্ট')} />
        <ArrowRow icon={<Gamepad2 size={16} />} label="FAQ" sublabel="সচরাচর জিজ্ঞাসা" onClick={() => setComingSoon('FAQ')} />
        <ArrowRow icon={<FileText size={16} />} label="Terms & Conditions" sublabel="শর্তাবলী" onClick={() => setComingSoon('Terms & Conditions')} />
        <ArrowRow icon={<Lock size={16} />} label="Privacy Policy" sublabel="গোপনীয়তা নীতি" onClick={() => setComingSoon('Privacy Policy')} />
      </Section>

      {/* ── Logout ── */}
      <div style={{ margin: '0 12px 8px' }}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,82,82,0.25)',
            background: 'rgba(255,82,82,0.08)', color: '#FF5252', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <LogOut size={16} /> লগআউট
        </button>
      </div>

      {/* App version */}
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#2A3060', padding: '8px 0 4px' }}>
        Ludo Game v1.0.0 · Made with ❤️
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <AvatarModal current={avatar} onSelect={setAvatar} onClose={() => setShowAvatarPicker(false)} />
        )}
        {showEditProfile && user && (
          <EditProfileModal username={user.username} onClose={() => setShowEditProfile(false)} />
        )}
        {comingSoon && (
          <ComingSoonModal label={comingSoon} onClose={() => setComingSoon('')} />
        )}
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
          >
            <motion.div
              initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', background: 'linear-gradient(180deg, #1A1040 0%, #100830 100%)', borderRadius: '24px 24px 0 0', padding: '28px 20px 40px', border: '1px solid rgba(255,82,82,0.2)', borderBottom: 'none' }}
            >
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#2A2060', margin: '0 auto 20px' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>লগআউট করবেন?</h3>
                <p style={{ fontSize: '13px', color: '#6878A8', marginBottom: '24px' }}>আপনি কি নিশ্চিতভাবে লগআউট করতে চান?</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{ flex: 1, padding: '13px', borderRadius: '50px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{ flex: 1, padding: '13px', borderRadius: '50px', background: 'linear-gradient(90deg, #FF5252, #C33BFF)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                  >
                    লগআউট
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
