import React from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/minimalNavbar.scss';


const MinimalNavbar = () => {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    const token = localStorage.getItem('token');
    if(token) {
      navigate('/appartement');
    }else {
      navigate('/');
    }
  };
 
  


  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo/Titre  transformé en logo cliquable today! :)*/}
        <div className="navbar-brand" onClick={handleHomeClick} style={{cursor:'pointer'}}>
          <Icon icon="game-icons:house" className="logo-icon" />
          <span className="brand-text">My Happy mo</span>
          <span className="brand-emoji">🏠</span>
        </div>

       

        {/* Profil visible sur toutes les pages */}
        <div className="navbar-profile">
            <Link to="/login" className="profile-button">
                <Icon icon="game-icons:pixel-heart" className="heart-icon" />
            <div className="avatar">👩‍💼</div>
            <span>Admin</span>
        </Link>
        </div>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
