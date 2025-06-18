import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../styles/home.scss';
import MinimalNavbar from '../components/MinimalNavbar';


const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    console.log('Redirection vers /login');
  };

  const features = [
    {
      icon: 'mdi:home-city-outline',
      title: 'Biens',
      description: 'Tous vos biens immobiliers centralisés',
      color: '#00A2FF'
    },
    {
      icon: 'mdi:account-heart-outline',
      title: 'Locataires',
      description: 'Suivi simple et efficace des locataires',
      color: '#FF9EC7'
    },
    {
      icon: 'mdi:note-text-outline',
      title: 'Mémos',
      description: 'Notes organisées et accessibles',
      color: '#B8E6B8'
    },
    ];

  return (
    <> 
    <MinimalNavbar />
    <div className="home-container">
      <div className="home-background"></div>

      <div className={`home-content ${isVisible ? 'visible' : ''}`}>
        <header className="home-header">
          <Icon icon="mdi:home-heart" className="logo-icon" />
          <h1 className="main-title">My Happy mo</h1>
          <Icon icon="mdi:home-heart" className="logo-icon bounce" />
          <p className="subtitle">L'application pour gérer vos biens avec le sourire ✨</p>
        </header>

        <section className="main-card">
          <div className="card-icon">
            <Icon icon="mdi:city-variant-outline" />
          </div>
          <h2>Simplifiez votre gestion</h2>
          <p>Un outil professionnel et joyeux pour gérer vos biens efficacement.</p>
          <button onClick={handleLogin} className="login-button">
            <Icon icon="mdi:login" className="mr-2" /> Se connecter
          </button>
        </section>

        <section className="features">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                transitionDelay: `${i * 100}ms`,
                boxShadow: `0 6px 20px ${f.color}44`
              }}
            >
              <Icon icon={f.icon} style={{ color: f.color }} className="feature-icon" />
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </>
  );
};

export default Home;