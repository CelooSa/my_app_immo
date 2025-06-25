import React, { useEffect, useState } from 'react';
import '../styles/contacts.scss';

const randomPastelColor = () => {
  const r = Math.floor((Math.random() * 127) + 127);
  const g = Math.floor((Math.random() * 127) + 127);
  const b = Math.floor((Math.random() * 127) + 127);
  return `rgb(${r}, ${g}, ${b})`;
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [colors, setColors] = useState({});

  useEffect(() => {
    fetch('http://localhost:1337/api/autres-contacts?populate=*')
      .then(res => res.json())
      .then(json => {
        const loadedContacts = json.data.map(item => ({
          id: item.id,
          ...item.attributes,
        }));
        setContacts(loadedContacts);

        // Couleurs pour les contacts récupérés
        const newColors = {};
        loadedContacts.forEach(c => {
          newColors[c.id] = randomPastelColor();
        });
        setColors(newColors);
      })
      .catch(err => console.error('Erreur chargement contacts:', err));
  }, []);

  // Schéma vide (formulaire vide) pour nouvelle fiche
  const defaultFields = {
    nom: '',
    prenom: '',
    entreprise: '',
    telephone_fixe: '',
    telephone_mobile: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    categorie_principale: '',
    sous_categorie: '',
    specialites: '',
    zone_intervention: '',
    notes: '',
    recommande_par: '',
    date_ajout: '',
    derniere_utilisation: '',
    evaluation: '',
    actif: false,
    site_web: '',
    siret: '',
    horaires: '',
    tarifs_indicatifs: '',
  };

  // Ajout d’une nouvelle fiche vide
  const handleAddNew = () => {
    const newId = 'new_' + Date.now();
    const newContact = { id: newId, ...defaultFields };
    setContacts(prev => [newContact, ...prev]);
    setOpenId(newId);
    setColors(prevColors => ({
      ...prevColors,
      [newId]: randomPastelColor(),
    }));
  };

  // Gestion changement formulaire
  const handleChange = (id, field, value) => {
    setContacts(prevContacts =>
      prevContacts.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Toggle ouverture fiche
  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Affichage des contacts ou placeholder si vide
  const displayContacts = contacts.length > 0 ? contacts : [{ id: 'placeholder', ...defaultFields }];

  return (
    <div className="page-container">
      <h1>Carnet de contacts</h1>

      <button className="add-new-button" onClick={handleAddNew}>
        + Nouveau contact
      </button>

      <div className="contacts-grid">
        {displayContacts.map(contact => (
          <div
            key={contact.id}
            className="contact-card"
            style={{ backgroundColor: colors[contact.id] || '#fff7d1' }}
          >
            <div
              className="contact-header"
              onClick={() => toggleOpen(contact.id)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h2>{contact.nom || 'Nom'}</h2>
              <button className="toggle-button" aria-label="Afficher / Masquer détails">
                {openId === contact.id ? '−' : '+'}
              </button>
            </div>

            {openId === contact.id && (
              <form className="contact-info" onSubmit={e => e.preventDefault()}>
                <label>
                  Nom:
                  <input
                    type="text"
                    value={contact.nom}
                    onChange={e => handleChange(contact.id, 'nom', e.target.value)}
                  />
                </label>

                <label>
                  Prénom:
                  <input
                    type="text"
                    value={contact.prenom}
                    onChange={e => handleChange(contact.id, 'prenom', e.target.value)}
                  />
                </label>

                <label>
                  Entreprise:
                  <input
                    type="text"
                    value={contact.entreprise}
                    onChange={e => handleChange(contact.id, 'entreprise', e.target.value)}
                  />
                </label>

                <label>
                  Téléphone fixe:
                  <input
                    type="text"
                    value={contact.telephone_fixe}
                    onChange={e => handleChange(contact.id, 'telephone_fixe', e.target.value)}
                  />
                </label>

                <label>
                  Téléphone mobile:
                  <input
                    type="text"
                    value={contact.telephone_mobile}
                    onChange={e => handleChange(contact.id, 'telephone_mobile', e.target.value)}
                  />
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    value={contact.email}
                    onChange={e => handleChange(contact.id, 'email', e.target.value)}
                  />
                </label>

                {/* Tu peux rajouter d'autres champs ici de la même façon */}

                <label>
                  Notes:
                  <textarea
                    value={contact.notes}
                    onChange={e => handleChange(contact.id, 'notes', e.target.value)}
                    rows={3}
                  />
                </label>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
