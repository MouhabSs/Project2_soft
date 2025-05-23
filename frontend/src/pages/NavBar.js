import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserInjured, FaCalendarAlt, FaAppleAlt, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef}>
      <button
        className="profile-avatar-btn"
        style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
      >
        <FaUserCircle size={36} color="#4ea8de" />
      </button>
      {open && (
        <div className="profile-dropdown" style={{position: 'absolute', right: 0, top: 44, background: '#23272f', borderRadius: 10, boxShadow: '0 4px 24px rgba(78,168,222,0.18)', minWidth: 160, zIndex: 10}}>
          <div style={{padding: '1rem', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center'}}>
            <FaUserCircle size={28} color="#4ea8de" style={{marginRight: 8}} />
            <span style={{color: '#e0eafc', fontWeight: 500}}>User</span>
          </div>
          <Link to="/settings" style={{display: 'flex', alignItems: 'center', color: '#4ea8de', textDecoration: 'none', padding: '0.8rem 1rem'}} onClick={() => setOpen(false)}>
            <FaCog style={{marginRight: 8}} /> Settings
          </Link>
          <button style={{display: 'flex', alignItems: 'center', color: '#ff6b6b', background: 'none', border: 'none', width: '100%', padding: '0.8rem 1rem', cursor: 'pointer'}}>
            <FaSignOutAlt style={{marginRight: 8}} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  return (
    <nav className="navbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <ul className="navbar-list" style={{marginBottom: 0}}>
        <li>
          <Link to="/" className="navbar-home-icon" aria-label="Home">
            {/* Simple SVG Home Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ea8de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12L12 3l9 9"/>
              <path d="M9 21V9h6v12"/>
            </svg>
          </Link>
        </li>
        <li><Link to="/dashboard" className="navbar-link"><FaTachometerAlt style={{marginRight: '8px'}}/>Dashboard</Link></li>
        <li><Link to="/patients" className="navbar-link"><FaUserInjured style={{marginRight: '8px'}}/>Patients</Link></li>
        <li><Link to="/appointments" className="navbar-link"><FaCalendarAlt style={{marginRight: '8px'}}/>Appointments</Link></li>
        <li><Link to="/nutrition-plan" className="navbar-link"><FaAppleAlt style={{marginRight: '8px'}}/>Nutrition Plan</Link></li>
      </ul>
      <div className="navbar-profile" style={{position: 'relative', marginRight: 32}}>
        <ProfileMenu />
      </div>
    </nav>
  );
}