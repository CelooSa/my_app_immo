import React from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.scss';


const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
              <Icon icon="fluent-emoji:speech-balloon" width="30" />
              <span>Contacts</span>
            </button>

            <button className="nav-button">
              <Icon icon="fluent-emoji:scroll" width="23" />
              <span>Mémos</span>
            </button>
          </div>
        )}

        {/* Profil visible sur toutes les pages */}
        <div className="navbar-profile">
            <Link to="login" className="profile-button">
                <Icon icon="game-icons:pixel-heart" className="heart-icon" />
            <div className="avatar">👩‍💼</div>
            <span>Admin</span>
        </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
