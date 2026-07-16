import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, ShoppingCart, Bell, Settings, LogIn } from 'lucide-react';
import type { User as UserType } from '@workspace/api-client-react';
import { useGetUnreadCount, getGetUnreadCountQueryKey } from '@workspace/api-client-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
}

function UnreadBadge() {
  const { data: unreadData } = useGetUnreadCount({
    query: {
      refetchInterval: 10000,
      queryKey: getGetUnreadCountQueryKey(),
    }
  });
  const count = unreadData?.count ?? 0;
  if (count === 0) return null;
  return (
    <div className="nav-badge">{count > 99 ? '99+' : count}</div>
  );
}

export default function Layout({ children, user }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        {user ? (
          <>
            <Link href="/settings">
              <div style={{ cursor: 'pointer', position: 'relative' }}>
                <div className="avatar">
                  <div className="avatar-inner">👤</div>
                  <div className="level-badge">{user.level}</div>
                </div>
              </div>
            </Link>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '15px', paddingLeft: '6px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="flex items-center gap-2">
                {user.username}
                {user.isAdmin && (
                  <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded-sm">ADMIN</span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#F0F2F8', marginTop: '2px' }}>Level {user.level}</div>
            </div>
            <div className="coins-badge">
              🪙 {user.coins.toLocaleString()}
              <Link href="/store" className="plus cursor-pointer flex items-center justify-center hover:scale-110 transition-transform">+</Link>
            </div>
          </>
        ) : (
          <>
            <div className="avatar">
              <div className="avatar-inner">👤</div>
              <div className="level-badge" style={{ background: '#555' }}>?</div>
            </div>
            <div style={{ color: '#B0B8D8', fontWeight: 600, fontSize: '15px', paddingLeft: '6px', flex: 1 }}>
              <div>Guest Player</div>
              <div style={{ fontSize: '11px', color: '#6070A8', marginTop: '2px' }}>Login to earn coins</div>
            </div>
            <Link href="/login">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '50px',
                border: '2px solid #4FA6FF',
                background: 'rgba(79,166,255,0.12)',
                color: '#4FA6FF',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                <LogIn size={14} /> Login
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="page-content bg-gradient-to-b from-[#0F0C1F] to-[#160B30] relative">
        {children}
      </main>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <Link href="/" className={`nav-item ${location === '/' ? 'active' : ''}`}>
          <Home size={22} className={location === '/' ? 'text-[#FFC92C]' : ''} />
          <span>HOME</span>
        </Link>

        <Link href="/store" className={`nav-item ${location === '/store' ? 'active' : ''}`}>
          <ShoppingCart size={22} className={location === '/store' ? 'text-[#FFC92C]' : ''} />
          <span>STORE</span>
        </Link>

        <Link href="/rankings" className={`nav-item ${location === '/rankings' ? 'active' : ''}`}>
          <div className="text-[22px]">🏆</div>
          <span>RANKS</span>
        </Link>

        <Link href="/notifications" className={`nav-item ${location === '/notifications' ? 'active' : ''}`}>
          <div className="relative">
            <Bell size={22} className={location === '/notifications' ? 'text-[#FFC92C]' : ''} />
            {user && <UnreadBadge />}
          </div>
          <span>NOTIF.</span>
        </Link>

        {user ? (
          user.isAdmin ? (
            <Link href="/admin" className={`nav-item ${location === '/admin' ? 'active' : ''}`}>
              <Settings size={22} className={location === '/admin' ? 'text-[#FFC92C]' : ''} />
              <span>ADMIN</span>
            </Link>
          ) : (
            <Link href="/settings" className={`nav-item ${location === '/settings' ? 'active' : ''}`}>
              <Settings size={22} className={location === '/settings' ? 'text-[#FFC92C]' : ''} />
              <span>SETTINGS</span>
            </Link>
          )
        ) : (
          <Link href="/register" className="nav-item">
            <LogIn size={22} />
            <span>JOIN</span>
          </Link>
        )}
      </div>
    </div>
  );
}
