import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Icon } from '@iconify/react';
import './Navbar.scss';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Titre */}
      
          <NavLink to={localStorage.getItem('token') ? '/appartements' : '/'} className="navbar-brand">
          <Icon icon="game-icons:house" className="logo-icon" />
          <span className="brand-text">My Happy mo</span>
          <span className="brand-emoji">🏠</span>
          </NavLink>
      

        {/* Menu central visible uniquement si ce n'est PAS la page d'accueil */}
        {!isHomePage && (
          <div className="navbar-menu">
            <button className="nav-button active" onClick={() => navigate ('/appartements')}>
              <Icon icon="game-icons:village" width="26" />
              <span>Appartements</span>
            </button>

            <NavLink
            to="/contacts"
            className={({ isActive }) => "nav-button" + (isActive ? "active" : "")}
            style={{ color: ' #00D4FF' }}
          >
            <Icon icon="mdi:card-account-details-outline" width="26" />
              <span>Contacts</span>
            </NavLink>

            <NavLink
            to="/memos"
            className={({ isActive })=> "nav-button" + (isActive ? "active" : "")}
            style={{ color: ' #B8E6B8'}}
              >
              <Icon icon="mdi:note-text-outline" width="26" />
              <span>Mémos</span>
            </NavLink>
          </div>
        )}

        {/* Profil visible sur toutes les pages */}
        <div className="navbar-profile">
          <button type="button" className="profile-button" onClick={handleLogout} title="Déconnexion">
            <Icon icon="mdi:logout" className="logout-icon" />
            <div className="avatar">👩‍💼</div>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
