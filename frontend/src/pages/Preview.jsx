import React, { useEffect, useState } from 'react';
import MinimalNavbar from '../components/MinimalNavbar';


import { useNavigate } from 'react-router-dom';

import '../styles/preview.scss';

const colors = ['#F8D7DA', '#D1ECF1', '#D4EDDA', '#FFF3CD', '#E2E3E5', '#F0D9FF', '#FFEFD5'];


const Preview = () => {
  const [appartements, setAppartements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const mockAppartements = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      attributes: { nom: `Appartement #${i + 1}`, image: null },
    }));
    setAppartements(mockAppartements);
  }, []);

  return (
    <>
    <MinimalNavbar />
    <div className="preview-container">
      <div className={`preview-content ${isVisible ? 'visible' : ''}`}>
        <header className="preview-header">
          <h1>Les Biens</h1>
        </header>

        <div className="grid-appartements">
          {appartements.map((item, index) => (
            <div
              key={item.id}
              className="appartement-card"
              style={{ backgroundColor: colors[index % colors.length] }}
              onClick={() => navigate(`/appartements/${item.id}`)}
            >
              <h3>{item.attributes.nom || 'Nom non défini'}</h3>
              <div className="placeholder-image">
                <p>Image vide</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
</>
  );
};

export default Preview;
