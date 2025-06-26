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
    // D'abord essayer de charger depuis localStorage
    const savedContacts = localStorage.getItem('contacts');
    const savedColors = localStorage.getItem('contactColors');
    
    if (savedContacts) {
      try {
        const parsedContacts = JSON.parse(savedContacts);
        const parsedColors = savedColors ? JSON.parse(savedColors) : {};
        setContacts(parsedContacts);
        setColors(parsedColors);
      } catch (error) {
        console.error('Erreur lecture localStorage:', error);
      }
    }
    
    // Puis charger depuis l'API (optionnel - tu peux commenter cette partie si tu veux)
    fetch('http://localhost:1337/api/autres-contacts?populate=*')
      .then(res => res.json())
      .then(json => {
        const loadedContacts = json.data.map(item => ({
          id: item.id,
          ...item.attributes,
        }));
        
        // Fusionner avec les contacts locaux (éviter les doublons)
        setContacts(prevContacts => {
          const existingIds = prevContacts.map(c => c.id);
          const newContacts = loadedContacts.filter(c => !existingIds.includes(c.id));
          return [...prevContacts, ...newContacts];
        });

        // Couleurs pour les nouveaux contacts
        const newColors = {};
        loadedContacts.forEach(c => {
          if (!colors[c.id]) {
            newColors[c.id] = randomPastelColor();
          }
        });
        
        if (Object.keys(newColors).length > 0) {
          setColors(prevColors => ({ ...prevColors, ...newColors }));
        }
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

  // Ajout d'une nouvelle fiche vide
  const handleAddNew = () => {
    const newId = 'new_' + Date.now();
    const newContact = { id: newId, ...defaultFields };
    setContacts(prev => [...prev, newContact]); // Ajout à la fin au lieu du début
    setOpenId(null); // Ne pas ouvrir automatiquement
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

  // Sauvegarder un contact
  const handleSave = async (contact) => {
    try {
      // Sauvegarder dans localStorage
      const savedContacts = contacts.map(c => 
        c.id === contact.id ? contact : c
      );
      localStorage.setItem('contacts', JSON.stringify(savedContacts));
      localStorage.setItem('contactColors', JSON.stringify(colors));
      
      console.log('Contact sauvegardé localement:', contact);
      alert('Contact sauvegardé !');
      
      // TODO: Ici tu peux ajouter la sauvegarde vers ton API Strapi
      // if (contact.id.toString().startsWith('new_')) {
      //   // Créer nouveau contact dans Strapi
      // } else {
      //   // Mettre à jour contact existant dans Strapi
      // }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Supprimer un contact
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      const updatedContacts = contacts.filter(c => c.id !== id);
      setContacts(updatedContacts);
      
      // Supprimer aussi du localStorage
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      
      // Supprimer la couleur associée
      const updatedColors = { ...colors };
      delete updatedColors[id];
      setColors(updatedColors);
      localStorage.setItem('contactColors', JSON.stringify(updatedColors));
      
      if (openId === id) {
        setOpenId(null);
      }
    }
  };

  // Affichage des contacts - ne pas afficher de placeholder si on est en train de charger
  const displayContacts = contacts;

  return (
    <div className="page-container">
      <h1>Carnet de contacts</h1>

      <button className="add-new-button" onClick={handleAddNew}>
        + Nouveau contact
      </button>

      <div className="contacts-grid">
        {displayContacts.length > 0 ? (
          displayContacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-card ${openId === contact.id ? 'expanded' : ''}`}
              style={{ backgroundColor: colors[contact.id] || '#fff7d1' }}
            >
              <div
                className="contact-header"
                onClick={() => toggleOpen(contact.id)}
              >
                <h2>{contact.nom || 'Nouveau contact'}</h2>
                <button 
                  className="toggle-button" 
                  aria-label="Afficher / Masquer détails"
                  type="button"
                >
                  {openId === contact.id ? '−' : '+'}
                </button>
              </div>

              {openId === contact.id && (
                <div className="contact-details">
                  <form className="contact-info" onSubmit={e => e.preventDefault()}>
                    <div className="form-row">
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
                    </div>

                    <label>
                      Entreprise:
                      <input
                        type="text"
                        value={contact.entreprise}
                        onChange={e => handleChange(contact.id, 'entreprise', e.target.value)}
                      />
                    </label>

                    <div className="form-row">
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
                    </div>

                    <label>
                      Email:
                      <input
                        type="email"
                        value={contact.email}
                        onChange={e => handleChange(contact.id, 'email', e.target.value)}
                      />
                    </label>

                    <label>
                      Notes:
                      <textarea
                        value={contact.notes}
                        onChange={e => handleChange(contact.id, 'notes', e.target.value)}
                        rows={3}
                      />
                    </label>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="save-button"
                        onClick={() => handleSave(contact)}
                      >
                        💾 Sauvegarder
                      </button>
                      <button 
                        type="button" 
                        className="delete-button-small"
                        onClick={() => handleDelete(contact.id)}
                        title="Supprimer ce contact"
                      >
                        🗑️
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-message">
            <p>Aucun contact pour le moment.</p>
            <p>Cliquez sur "+ Nouveau contact" pour commencer !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;