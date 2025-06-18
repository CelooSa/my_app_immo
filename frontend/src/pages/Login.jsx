import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.scss';

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState(''); // ici on utilise "identifier" email ou username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
      if(token){
        navigate('/appartements');
      }else {
        setIsVisible(true); // sinon c'est ici que ça va rediriger vers la page de login
      }
  }, [navigate]); // ici on met le navigate ds le tab pr dire à react q si la fonction navigate change rééxecute le use effect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: username,
        password: password,
      });

      // Récupérer token et user
      const { jwt, user } = response.data;

      // Stockage token
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger vers page protégée (exemple appartements)
      navigate('/appartements');
    } catch (err) {
      setError('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-page">
      <div className="background-blobs"></div>

      <div className={`login-content ${isVisible ? 'visible' : ''}`}>
        <img src="/images/ARALE.jpg" alt="Arale" className="arale-image" />

        <h2>Connexion Admin</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d'utilisateur ou email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
