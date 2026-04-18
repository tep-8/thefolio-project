import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Navbar = ({ isDark, setIsDark }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();         
    navigate('/');    
  };

  const IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

  return (
    <nav style={styles.nav}>
      {/* 1. Branding Section */}
      <div style={styles.brandGroup}>
        <Link to="/" style={styles.logoLink}>
          <span style={styles.logoSparkle}>✦</span>
          <div style={styles.logoTextWrapper}>
            <h1 style={styles.logoTitle}>STEPHANIE MAE</h1>
            <p style={styles.logoSub}>GUBATAN</p>
          </div>
        </Link>
      </div>

      {/* 2. Central Navigation Links */}
      <div style={styles.linksGroup}>
        <Link to="/home" style={isActive('/home') ? styles.activeLink : styles.link}>HOME</Link>
        <Link to="/about" style={isActive('/about') ? styles.activeLink : styles.link}>MY JOURNEY</Link>
        <Link to="/projects" style={isActive('/projects') ? styles.activeLink : styles.link}>LIFE & INTERESTS</Link>
        <Link to="/contact" style={isActive('/contact') ? styles.activeLink : styles.link}>CONNECT</Link>
      </div>

      {/* 3. User Actions Section */}
      <div style={styles.actionGroup}>
        {user && <Link to="/create-post" style={styles.postBtn}>+ POST</Link>}
        
        {user ? (
          <div style={styles.userSection}>
            {/* PROFILE PICTURE & NAME LINK */}
            <Link to="/profile" style={styles.profileLink}>
              <img 
                src={user.profilePic ? `${IMAGE_BASE_URL}${user.profilePic}` : 'https://via.placeholder.com/35'} 
                alt="Nav Avatar" 
                style={styles.navAvatar}
              />
              <span style={styles.userName}>
                {user.role === 'admin' ? 'ADMIN' : user.name.toUpperCase()}
              </span>
            </Link>

            {/* If admin, show Dashboard link specifically */}
            {user.role === 'admin' && (
              <Link to="/admin" style={isActive('/admin') ? styles.activeAdminLink : styles.adminLink}>
                DASHBOARD
              </Link>
            )}
            
            <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>LOGIN</Link>
        )}

        <button 
          onClick={() => setIsDark(!isDark)} 
          style={styles.themeToggle}
          title="Switch Theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

const COLORS = {
  gold: '#D4AF37',
  champagne: '#E5D1B1',
  dark: '#1A1A1A',
  border: 'rgba(212, 175, 55, 0.3)',
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 3rem',
    backgroundColor: COLORS.dark,
    borderBottom: `1px solid ${COLORS.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: '80px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
  },
  brandGroup: { display: 'flex', alignItems: 'center' },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' },
  logoSparkle: { color: COLORS.gold, fontSize: '1.4rem' },
  logoTextWrapper: { display: 'flex', flexDirection: 'column', lineHeight: '1.2' },
  logoTitle: { color: '#FFF', fontSize: '0.95rem', margin: 0, letterSpacing: '3px', fontWeight: '800' },
  logoSub: { color: COLORS.champagne, fontSize: '0.65rem', margin: 0, letterSpacing: '2px', fontWeight: '400' },
  linksGroup: { display: 'flex', gap: '30px' },
  link: { color: '#999', textDecoration: 'none', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1.5px', transition: 'all 0.3s ease', padding: '5px 0' },
  activeLink: { color: COLORS.gold, textDecoration: 'none', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1.5px', borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: '5px' },
  actionGroup: { display: 'flex', alignItems: 'center', gap: '25px' },
  postBtn: { color: COLORS.gold, textDecoration: 'none', fontSize: '0.7rem', fontWeight: '700', border: `1px solid ${COLORS.gold}`, padding: '6px 12px', borderRadius: '2px', transition: '0.3s' },
  
  userSection: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    borderLeft: '1px solid rgba(255,255,255,0.1)', 
    paddingLeft: '20px' 
  },

  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  navAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `1.5px solid ${COLORS.gold}`
  },
  
  adminLink: {
    color: COLORS.champagne,
    textDecoration: 'none',
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '1px',
    padding: '4px 8px',
    border: `1px dashed ${COLORS.gold}`
  },
  activeAdminLink: {
    color: COLORS.gold,
    textDecoration: 'none',
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '1px',
    padding: '4px 8px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: `1px solid ${COLORS.gold}`
  },

  userName: { color: '#FFF', textDecoration: 'none', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1px', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #666', color: '#999', padding: '4px 12px', borderRadius: '2px', cursor: 'pointer', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '1px' },
  themeToggle: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 },
  loginBtn: { color: COLORS.gold, textDecoration: 'none', fontSize: '0.7rem', fontWeight: '700' }
};

export default Navbar;