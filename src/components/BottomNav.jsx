import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Clock, User, Camera, Plus } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Verstecke Nav auf bestimmten Screens
  const hiddenPaths = ['/onboarding', '/result', '/edit'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        id="nav-home"
      >
        <div className="nav-icon-wrap">
          <Home size={22} />
        </div>
        <span className="nav-label">Home</span>
      </NavLink>

      {/* Verlauf */}
      <NavLink
        to="/history"
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        id="nav-verlauf"
      >
        <div className="nav-icon-wrap">
          <Clock size={22} />
        </div>
        <span className="nav-label">Verlauf</span>
      </NavLink>

      {/* === SCAN CENTER BUTTON === */}
      <button
        className="nav-scan-center"
        onClick={() => navigate('/scan')}
        id="nav-scan-center"
        aria-label="Mahlzeit erfassen"
      >
        <div className="nav-scan-center__glow" />
        <div className="nav-scan-center__inner">
          <Plus size={28} strokeWidth={2.5} />
        </div>
      </button>

      {/* Statistik (placeholder, redirects to home weekly) */}
      <NavLink
        to="/scan"
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        id="nav-scan"
      >
        <div className="nav-icon-wrap">
          <Camera size={22} />
        </div>
        <span className="nav-label">Scan</span>
      </NavLink>

      {/* Profil */}
      <NavLink
        to="/profile"
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        id="nav-profil"
      >
        <div className="nav-icon-wrap">
          <User size={22} />
        </div>
        <span className="nav-label">Profil</span>
      </NavLink>
    </nav>
  );
}
