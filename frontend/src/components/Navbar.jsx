import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
        <div className="navbar-brand">
          <Icon icon="game-icons:house" className="logo-icon" />
          <span className="brand-text">My Happy mo</span>
          <span className="brand-emoji">🏠</span>
        </div>

        {/* Menu central visible uniquement si ce n'est PAS la page d'accueil */}
        {!isHomePage && (
          <div className="navbar-menu">
            <button className="nav-button active">
              <Icon icon="game-icons:village" width="26" />
              <span>Appartements</span>
            </button>

            <button className="nav-button">
              <Icon icon="mdi:card-account-details-outline" width="26" style={{color: ' #00D4FF' }} />
              <span>Contacts</span>
            </button>

            <button className="nav-button">
              <Icon icon="mdi:note-text-outline" width="26" style={{color: ' #B8E6B8'}} />
              <span>Mémos</span>
            </button>
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
