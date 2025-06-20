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
      color: 'rgb(65, 192, 187)'
    },
  
    {
      icon: 'mdi:notebook-edit-outline',
      title: 'Notes de visite',
      description: 'Notes organisées et accessibles',
      color: 'rgb(221, 173, 225)'
    },
    ];

  return (
    <> 
    <MinimalNavbar />
    <div className="home-container">
      <div className="home-background"></div>

      <div className={`home-content ${isVisible ? 'visible' : ''}`}>
        <header className="home-header">
          <Icon icon="mdi:home-heart" className="logo-icon" color=' #78c7df' />
          <h1 className="main-title" >My Happy mo</h1> 
          <Icon icon="mdi:home-heart" className="logo-icon bounce"  color=' #78c7df' />
          <p className="subtitle">L'application pour gérer vos biens avec le sourire ✨</p>
        </header>

        <section className="main-card">
          <div className="card-icon">
            <Icon icon="mdi:city-variant-outline"  color=' #78c7df'  />
          </div>
          <h2>Simplifiez votre gestion</h2>
          <p>Un outil professionnel et joyeux pour gérer vos biens efficacement.</p>
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