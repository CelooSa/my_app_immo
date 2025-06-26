import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import strapiClient from '../api/strapiClient';
import '../styles/detailAppartement.scss';

function DetailAppartement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appart, setAppart] = useState(null);

  useEffect(() => {
    strapiClient
      .get(`/appartements/${id}?populate=deep,5`)
      .then((res) => setAppart(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!appart) return <p>Chargement...</p>;

  const { attributes } = appart;
  const {
    le_bien,
    locataires,
    loyer_et_charges,
    trousseau,
    dossier_en_cours,
    syndic,
    memo,
    autres_contacts,
  } = attributes;

  return (
    <div className="detail-appartement">
      <button onClick={() => navigate(-1)}>← Retour</button>
      <h2>{attributes.nom || "Nom non défini"}</h2>

      {/* Fiche Le Bien */}
      <section>
        <h3>🏠 Le bien</h3>
        <p><strong>Propriétaire :</strong> {le_bien?.proprietaire || "Non renseigné"}</p>
        <p><strong>Adresse :</strong> {le_bien?.adresse || "Non renseignée"}</p>
        {/* ... autres champs à insérer avec ton schéma */}
      </section>

      {/* Fiche Locataires */}
      <section>
        <h3>👤 Locataire(s)</h3>
        {locataires?.length > 0 ? (
          locataires.map((loc, i) => (
            <div key={i}>
              <p><strong>Nom :</strong> {loc.nom}</p>
              <p><strong>Email :</strong> {loc.email}</p>
              {/* ... on ajoutera tout à l'étape suivante */}
            </div>
          ))
        ) : (
          <p>Aucun locataire renseigné.</p>
        )}
      </section>

      {/* Fiche Loyer & Charges */}
      <section>
        <h3>💶 Loyer et charges</h3>
        <p><strong>Loyer HC :</strong> {loyer_et_charges?.loyerHc || "Non renseigné"}</p>
        {/* On complètera plus tard */}
      </section>

      {/* Fiche Trousseau */}
      <section>
        <h3>🔑 Trousseau</h3>
        {trousseau?.length > 0 ? (
          trousseau.map((t, i) => (
            <div key={i}>
              <p><strong>ID :</strong> {t.identifiantTrousseau}</p>
            </div>
          ))
        ) : (
          <p>Aucun trousseau enregistré.</p>
        )}
      </section>

      {/* Fiche Dossier en cours */}
      <section>
        <h3>📂 Dossier en cours</h3>
        {/* À compléter plus tard avec litiges/travaux */}
        <p>Aucun dossier renseigné.</p>
      </section>

      {/* Fiche Syndic */}
      <section>
        <h3>🏢 Syndic</h3>
        <p>Coordonnées : {syndic?.coordonnees_syndic || "Non renseignées"}</p>
      </section>

      {/* Fiche Mémos */}
      <section>
        <h3>📝 Mémos</h3>
        <p>{memo?.texte || "Aucun mémo pour cet appartement."}</p>
      </section>

      {/* Fiche Autres contacts */}
      <section>
        <h3>📇 Autres contacts</h3>
        <p>À venir.</p>
      </section>
    </div>
  );
}

export default DetailAppartement;
