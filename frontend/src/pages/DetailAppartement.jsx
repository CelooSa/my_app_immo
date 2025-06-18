import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/detailAppartement.scss';

const API_URL = 'http://localhost:1337/api/appartements';

function DetailAppartement() {
  const { id } = useParams();
  const [appart, setAppart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}?populate=*`)
      .then(res => setAppart(res.data.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!appart) return <p>Chargement...</p>;

  const { attributes } = appart;
  const locataires = attributes.locataires || [];
  const trousseaux = attributes.trousseau || [];
  const memo = attributes.memo || null;
  const le_bien = attributes.le_bien || null;

  return (
    <div className="detail-appartement">
      <button onClick={() => navigate(-1)}>← Retour</button>

      <h2>{attributes.nom}</h2>

      {le_bien?.photo?.data?.attributes?.url && (
        <img 
          src={le_bien.photo.data.attributes.url} 
          alt={attributes.nom} 
          className="photo-principale"
        />
      )}

      <section>
        <h3>Description du bien</h3>
        <p>{le_bien?.description || "Pas de description disponible."}</p>
      </section>

      <section>
        <h3>Locataires</h3>
        {locataires.length === 0 && <p>Aucun locataire enregistré.</p>}
        {locataires.map((loc, idx) => (
          <div key={idx}>
            <p><strong>Nom :</strong> {loc.nom}</p>
            <p><strong>Email :</strong> {loc.email}</p>
            <p><strong>Téléphone :</strong> {loc.telephone}</p>
            {/* Ajoute ici d'autres infos si besoin */}
          </div>
        ))}
      </section>

      <section>
        <h3>Trousseau</h3>
        {trousseaux.length === 0 && <p>Aucun trousseau enregistré.</p>}
        {trousseaux.map((clef, idx) => (
          <div key={idx}>
            <p><strong>Type de clé :</strong> {clef.type || "Inconnu"}</p>
            <p><strong>Commentaires :</strong> {clef.commentaires || "Aucun"}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Mémo</h3>
        <p>{memo?.texte || "Aucun mémo disponible."}</p>
      </section>
    </div>
  );
}

export default DetailAppartement;
