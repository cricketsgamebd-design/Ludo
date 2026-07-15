import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, ShoppingCart, MessageSquare, Bell, User, Settings } from 'lucide-react';
import type { User as UserType } from '@workspace/api-client-react';
import { useGetUnreadCount, getGetUnreadCountQueryKey } from '@workspace/api-client-react';

export default function Layout({ children, user }: { children: React.ReactNode, user: UserType }) {
  const [location, setLocation] = useLocation();
  const { data: unreadData } = useGetUnreadCount({
    query: {
      refetchInterval: 10000,
      queryKey: getGetUnreadCountQueryKey(),
    }
  });

  const unreadCount = unreadData?.count || 0;

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <div className="header">
        <div className="avatar">
          <div className="avatar-inner">👤</div>
          <div className="level-badge">{user.level}</div>
        </div>
        <div style={{color:'#FFFFFF', fontWeight:600, fontSize:'15px', paddingLeft:'6px', display: 'flex', flexDirection: 'column'}}>
          <div className="flex items-center gap-2">
            {user.username}
            {user.isAdmin && <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded-sm">ADMIN</span>}
          </div>
          <div style={{fontSize:'11px', color:'#F0F2F8', marginTop:'2px'}}>Level {user.level}</div>
        </div>
        <div className="coins-badge">
          🪙 {user.coins.toLocaleString()} <Link href="/store" className="plus cursor-pointer flex items-center justify-center hover:scale-110 transition-transform">+</Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="page-content bg-gradient-to-b from-[#0F0C1F] to-[#160B30] relative">
        {children}
      </main>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <Link href="/" className={`nav-item ${location === '/' ? 'active' : ''}`}>
          <Home size={22} className={location === '/' ? "text-[#FFC92C]" : ""} />
          <span>HOME</span>
        </Link>
        <Link href="/store" className={`nav-item ${location === '/store' ? 'active' : ''}`}>
          <ShoppingCart size={22} className={location === '/store' ? "text-[#FFC92C]" : ""} />
          <span>STORE</span>
        </Link>
        <Link href="/rankings" className={`nav-item ${location === '/rankings' ? 'active' : ''}`}>
          <div className="text-[22px]">🏆</div>
          <span>RANKS</span>
        </Link>
        <Link href="/notifications" className={`nav-item ${location === '/notifications' ? 'active' : ''}`}>
          <div className="relative">
            <Bell size={22} className={location === '/notifications' ? "text-[#FFC92C]" : ""} />
            {unreadCount > 0 && (
              <div className="nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</div>
            )}
          </div>
          <span>NOTIF.</span>
        </Link>
        <div 
          className={`nav-item ${location === '/admin' ? 'active' : ''}`}
          onClick={() => {
            if (user.isAdmin) {
              setLocation('/admin');
            } else {
              // Logout logic for demo
              localStorage.removeItem("ludo_token");
              window.location.href = '/login';
            }
          }}
        >
          {user.isAdmin ? <Settings size={22} className={location === '/admin' ? "text-[#FFC92C]" : ""} /> : <User size={22} />}
          <span>{user.isAdmin ? 'ADMIN' : 'LOGOUT'}</span>
        </div>
      </div>
    </div>
  );
}