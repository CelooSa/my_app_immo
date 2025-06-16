import React from 'react';
import { Icon } from '@iconify/react';
import './Navbar.scss'; // Extension .scss

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Titre avec petit clin d'œil gaming */}
        <div className="navbar-brand">
          <Icon icon="game-icons:house" className="logo-icon" />
          <span className="brand-text">My Happy mo</span>
          <span className="brand-emoji">🏠</span>
        </div>

        {/* Navigation centrale */}
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

        {/*pour le  Profil utilisateur */}
        <div className="navbar-profile">
          <button className="profile-button">
            <Icon icon="game-icons:pixel-heart" className="heart-icon" />
            <div className="avatar">👩‍💼</div>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;