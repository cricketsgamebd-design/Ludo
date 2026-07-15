import ludoBanner from '/ludo-banner.png';

export default function App() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1A0F2E, #2A0066);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }

        .container {
          width: 100%;
          max-width: 420px;
          background: #0F0C1F;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
          display: grid;
          grid-template-columns: 60px 1fr 90px 90px;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(180deg, #0D1C58 0%, #060A2D 50%, #02041A 100%);
          height: 68px;
          gap: 8px;
          border-bottom: 3px solid #3A2A9D;
          box-shadow: 0 2px 12px rgba(107,76,255,0.25), inset 0 0 20px rgba(24,22,74,0.6);
        }

        .avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #D7DBE6;
          border: 4px solid transparent;
          background-clip: padding-box;
          position: relative;
        }
        .avatar::before {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF5CE8, #B82BFF, #6D1CC9);
          z-index: -1;
          filter: blur(1px);
        }
        .avatar-inner {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #8b00ff, #ff00cc);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: white;
        }
        .level-badge {
          position: absolute; bottom: -2px; right: -2px;
          background: linear-gradient(135deg, #F8B400, #FFE16A);
          color: #4B2A00; font-size: 10px; font-weight: bold;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #060A2D;
          box-shadow: 0 2px 6px rgba(168,100,0,0.5);
        }

        .coins, .money {
          height: 34px;
          display: flex; align-items: center; justify-content: center;
          gap: 5px; font-weight: bold; font-size: 13.5px;
          border-radius: 25px; padding: 0 10px; white-space: nowrap;
          border: 2px solid #5D53B8; background: #0B1038;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          color: #FFFFFF;
        }
        .plus {
          background: linear-gradient(180deg, #8BFF45, #53D22E, #2F961B);
          color: #000; font-size: 15px; font-weight: bold;
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #B8FF78; margin-left: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        /* GAME BOARD — 16:9 */
        .game-board {
          aspect-ratio: 16 / 9;
          width: calc(100% - 20px);
          margin: 10px;
          border-radius: 16px;
          position: relative; overflow: hidden;
          border: 1px solid #545C75;
          box-shadow: 0 8px 25px rgba(0,0,0,0.8), inset 0 0 60px rgba(35,40,58,0.6);
          flex-shrink: 0;
        }
        .game-board img {
          display: block; width: 100%; height: 100%;
          object-fit: cover; object-position: center;
        }

        /* MODES */
        .modes {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; padding: 0 15px;
        }
        .mode-card {
          height: 92px; border-radius: 14px; padding: 12px 4px;
          color: white; display: flex; align-items: center; gap: 14px;
          transition: transform 0.2s; border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5); position: relative;
        }
        .card-arrow {
          position: absolute; bottom: 7px; right: 7px;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: #fff;
          border: 1.5px solid rgba(255,255,255,0.6);
        }
        .mode-card:hover { transform: scale(1.03); }
        .mode-card .icon {
          font-size: 46px; width: 50px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .mode-card .content { flex: 1; padding-right: 20px; }
        .mode-card strong { font-size: 15px; display: block; margin-bottom: 2px; }
        .mode-card small { font-size: 11.5px; opacity: 0.9; line-height: 1.25; }

        .mode-card:nth-child(1) {
          background: linear-gradient(180deg, #0D4EA6 0%, #082A68 50%, #041C48 100%);
          border: 2px solid #2A7FEF; box-shadow: 0 0 16px #3FC5FF;
        }
        .mode-card:nth-child(1) .card-arrow { background: linear-gradient(180deg, #4FA6FF, #0D4EA6); box-shadow: 0 0 8px #3FC5FF; }
        .mode-card:nth-child(2) {
          background: linear-gradient(180deg, #0D6B2E 0%, #014A1A 50%, #012D10 100%);
          border: 2px solid #1EA63D; box-shadow: 0 0 16px #4BFF63;
        }
        .mode-card:nth-child(2) .card-arrow { background: linear-gradient(180deg, #5CE87A, #0D6B2E); box-shadow: 0 0 8px #4BFF63; }
        .mode-card:nth-child(3) {
          background: linear-gradient(180deg, #4A177B 0%, #2A0A4F 50%, #18062F 100%);
          border: 2px solid #8B27D9; box-shadow: 0 0 16px #C33BFF;
        }
        .mode-card:nth-child(3) .card-arrow { background: linear-gradient(180deg, #C97BFF, #4A177B); box-shadow: 0 0 8px #C33BFF; }
        .mode-card:nth-child(4) {
          background: linear-gradient(180deg, #6A3A1A 0%, #4B2815 50%, #2C170C 100%);
          border: 2px solid #B76818; box-shadow: 0 0 16px #FFAE33;
        }
        .mode-card:nth-child(4) .card-arrow { background: linear-gradient(180deg, #FFC873, #6A3A1A); box-shadow: 0 0 8px #FFAE33; }

        /* INVITE */
        .invite {
          min-height: 105px; width: 95%; margin: 12px auto;
          background: linear-gradient(180deg, #6A18A8 0%, #3A0A5D 50%, #210534 100%);
          border-radius: 16px; padding: 12px 13px 14px;
          display: grid; grid-template-columns: 1fr 58px;
          align-items: center; gap: 7px;
          border: 2px solid #B129E9; box-shadow: 0 0 18px #E83DFF;
          flex-shrink: 0; position: relative; overflow: hidden;
        }
        .coin-scatter {
          position: relative; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 35px;
        }
        .coin-scatter .mini-coin {
          position: absolute; font-size: 13px;
          filter: drop-shadow(0 0 3px rgba(255,214,64,0.9));
          animation: coinFloat 2.4s ease-in-out infinite;
        }
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-4px) rotate(var(--r, 0deg)); }
        }
        .mini-coin.c1 { top: -8px; left: -10px; font-size: 15px; --r: -15deg; animation-delay: 0s; }
        .mini-coin.c2 { top: 2px; right: -12px; font-size: 12px; --r: 20deg; animation-delay: 0.4s; }
        .mini-coin.c3 { bottom: -6px; left: -2px; font-size: 11px; --r: 10deg; animation-delay: 0.8s; }
        .mini-coin.c4 { bottom: -10px; right: -4px; font-size: 14px; --r: -20deg; animation-delay: 1.2s; }
        .mini-coin.c5 { top: -12px; left: 16px; font-size: 10px; --r: 30deg; animation-delay: 1.6s; }
        .mini-coin.c6 { bottom: 6px; right: -18px; font-size: 11px; --r: -10deg; animation-delay: 0.2s; }
        .invite-content { grid-column: 1; color: white; text-align: left; padding-left: 2px; }
        .invite-content strong { color: #FFE96A; font-size: 15px; letter-spacing: 0.3px; }
        .invite-btn {
          background: linear-gradient(180deg, #FFD95A 0%, #FFC41C 50%, #E59B00 100%);
          color: #000; font-weight: bold; font-size: 13px;
          height: 34px; width: 140px; border-radius: 30px; border: none;
          grid-column: 1 / -1; margin: 8px auto 0;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer;
        }

        /* RANKINGS */
        .rankings {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; padding: 0 5px 5px;
        }
        .ranking-card {
          min-height: 100px; border-radius: 14px; padding: 6px 4px;
          color: white; display: flex; align-items: center; gap: 6px;
          border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5); position: relative;
        }
        .ranking-card .icon { font-size: 38px; width: 40px; flex-shrink: 0; }
        .ranking-card .content { flex: 1; min-width: 0; padding-right: 20px; }
        .ranking-card:nth-child(1) {
          background: linear-gradient(180deg, #0E4A9A 0%, #082A68 50%, #051C49 100%);
          border: 2px solid #1E6EDB; box-shadow: 0 0 16px #2FAEFF;
        }
        .ranking-card:nth-child(1) .card-arrow { background: linear-gradient(180deg, #4FA6FF, #0E4A9A); box-shadow: 0 0 8px #2FAEFF; }
        .ranking-card:nth-child(2) {
          background: linear-gradient(180deg, #0F6B2A 0%, #02501A 50%, #013816 100%);
          border: 2px solid #179C3E; box-shadow: 0 0 16px #2EEB5B;
        }
        .ranking-card:nth-child(2) .card-arrow { background: linear-gradient(180deg, #5CE87A, #0F6B2A); box-shadow: 0 0 8px #2EEB5B; }
        .ranking-card strong {
          font-size: 12.5px; display: block; margin-bottom: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ranking-card small { font-size: 10.5px; opacity: 0.9; line-height: 1.25; }

        /* BOTTOM NAV */
        .bottom-nav {
          display: grid; grid-template-columns: repeat(5, 1fr);
          background: linear-gradient(180deg, #10266A 0%, #060D33 50%, #03071E 100%);
          padding: 8px 0 6px; margin-top: auto;
          border-top: 2px solid #2E7EFF;
          box-shadow: 0 -3px 10px rgba(66,200,255,0.3);
        }
        .nav-item {
          text-align: center; color: #C3C7D5;
          font-size: 22px; line-height: 1.1; position: relative;
        }
        .nav-item.active { color: #FFC92C; text-shadow: 0 0 8px #42C8FF; }
        .nav-item:nth-child(4)::after {
          content: '3'; position: absolute;
          background: #F12D2D; color: #FFFFFF; font-size: 8px;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          top: -3px; right: 26%; font-weight: bold;
          box-shadow: 0 0 6px rgba(241,45,45,0.9);
        }
      `}</style>

      <div className="container">

        {/* HEADER */}
        <div className="header">
          <div className="avatar">
            <div className="avatar-inner">👤</div>
            <div className="level-badge">12</div>
          </div>
          <div style={{color:'#FFFFFF', fontWeight:600, fontSize:'15px', paddingLeft:'6px'}}>
            Niloy
            <div style={{fontSize:'11px', color:'#F0F2F8', marginTop:'2px'}}>Level 12</div>
          </div>
          <div className="coins">
            🪙 11,400 <span className="plus">+</span>
          </div>
          <div className="money">
            💵 12,300 <span className="plus">+</span>
          </div>
        </div>

        {/* GAME BOARD — 16:9 with uploaded banner */}
        <div className="game-board">
          <img src={ludoBanner} alt="Ludo Banner" />
        </div>

        {/* MODES */}
        <div className="modes">
          <div className="mode-card">
            <div className="icon">🌍</div>
            <div className="content">
              <strong>ONLINE</strong>
              <small>Play With Real Players</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
          <div className="mode-card">
            <div className="icon">🦸</div>
            <div className="content">
              <strong>WITH FRIEND</strong>
              <small>Play With Your Friends</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
          <div className="mode-card">
            <div className="icon">🤖</div>
            <div className="content">
              <strong>COMPUTER</strong>
              <small>Play Against Computer</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
          <div className="mode-card">
            <div className="icon">🏆</div>
            <div className="content">
              <strong>TOURNAMENT</strong>
              <small>Show the talent and Get The reward</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
        </div>

        {/* INVITE & EARN */}
        <div className="invite">
          <div className="invite-content">
            <strong>INVITE &amp; EARN</strong><br />
            <small style={{fontSize:'12px', color:'#FFFFFF'}}>Invite your friends and earn exciting rewards</small>
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
          <button className="invite-btn">INVITE NOW</button>
        </div>

        {/* RANKINGS */}
        <div className="rankings">
          <div className="ranking-card">
            <div className="icon">🏆</div>
            <div className="content">
              <strong>GLOBAL RANKING</strong>
              <small>see top players around the world</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
          <div className="ranking-card">
            <div className="icon">🏅</div>
            <div className="content">
              <strong>FRIENDS RANKING</strong>
              <small>see the ranking of your friends</small>
            </div>
            <div className="card-arrow">➤</div>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <div className="nav-item active">🏠<br /><span>HOME</span></div>
          <div className="nav-item">🛒<br /><span>STORE</span></div>
          <div className="nav-item">💬<br /><span>INBOX</span></div>
          <div className="nav-item">🔔<br /><span>NOTIF.</span></div>
          <div className="nav-item">👤<br /><span>PROFILE</span></div>
        </div>

      </div>
    </>
  );
}
