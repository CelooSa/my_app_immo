import React,{ useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


import '../styles/listeAppartements.scss';


const colors = ['#F8D7DA', '#D1ECF1', '#D4EDDA', '#FFF3CD', '#E2E3E5', '#F0D9FF', '#FFEFD5'];
/*const colors = [
  '#FADADD', // rose poudré
  '#D0F4DE', // menthe douce
  '#CDE7F0', // bleu ciel
  '#E3D4F3', // lavande
  '#FFF6C5', // jaune crème
  '#FFE0B2', // pêche
  '#E8ECEF', // gris bleuté
];*/



const ListeAppartements = () => {
  const [appartements, setAppartements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Pour l'instant on ne récupère pas du backend
    // On crée un tableau fictif de 6 appartements vides
    const mockAppartements = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      attributes: {
      nom: `Appartement #${i + 1}`,
      image: null, // pas d'image pour l'instant
      }
    }));
    setAppartements(mockAppartements);
  }, []);

  return (
    <div className="grid-appartements">
      {appartements.map((item, index) => (
        <div
          key={item.id}
          className="appartement-card"
          style={{ backgroundColor: colors[index % colors.length] }}
          onClick={() => navigate(`/detail/${item.id}`)}
          >

          <h3>{item.attributes.nom || 'Nom non défini'}</h3>

          {item.attributes.image?.data? (
            <img src={`http://localhost:1337${item.attributes.image.data.attributes.url}`}
            alt={item.attributes.nom}
            className='image-appartement'
            />

          ) : (
          <div className="placeholder-image">
            {/* Ici une box vide en attendant l’image */}
            <p>Image vide</p>
          </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListeAppartements;
