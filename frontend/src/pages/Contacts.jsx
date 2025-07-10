import React, { useEffect, useState } from 'react';
import '../styles/contacts.scss';

const extractTextFromBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map(block =>
      block.children?.map(child => child.text).join('') ?? ''
    )
    .join('\n');
};

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
    // Charger depuis localStorage
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
    
    // Charger depuis l'API
    fetch('http://localhost:1337/api/autres-contacts?populate=*')
      .then(res => res.json())
      .then(json => {
        const loadedContacts = json.data.map(item => ({
          id: item.id,
          ...item.attributes,
          specialites: Array.isArray(item.attributes.specialites) ? item.attributes.specialites : [],
          tags: Array.isArray(item.attributes.tags?.data) ? item.attributes.tags.data.map(tag => tag.attributes.name) : [],
          documents: Array.isArray(item.attributes.documents?.data) ? item.attributes.documents.data.map(doc => ({
            name: doc.attributes.name,
            url: doc.attributes.url
          })) : []
        }));
        
        setContacts(prevContacts => {
          const existingIds = prevContacts.map(c => c.id);
          const newContacts = loadedContacts.filter(c => !existingIds.includes(c.id));
          return [...prevContacts, ...newContacts];
        });

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

  // Schéma vide pour nouvelle fiche
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
    specialites: [],
    zone_intervention: '',
    tags: [],
    notes: '',
    recommande_par: '',
    date_ajout: new Date().toISOString(),
    criteres_recherche: '',
    derniere_utilisation: '',
    evaluation: '',
    actif: true,
    site_web: '',
    siret: '',
    horaires: '',
    tarifs_indicatifs: '',
    documents: []
  };

  // Ajout d'une nouvelle fiche vide
  const handleAddNew = () => {
    const newId = 'new_' + Date.now();
    const newContact = { id: newId, ...defaultFields };
    setContacts(prev => [...prev, newContact]);
    setOpenId(null);
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

  // Gestion changement pour les tableaux (specialites, tags, documents)
  const handleArrayChange = (id, field, value) => {
    setContacts(prevContacts =>
      prevContacts.map(c => {
        if (c.id === id) {
          const newValue = typeof value === 'string' ? value.split(',').map(item => item.trim()) : value;
          return { ...c, [field]: newValue };
        }
        return c;
      })
    );
  };

  // Toggle ouverture fiche
  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Sauvegarder un contact
  const handleSave = async (contact) => {
    try {
      const savedContacts = contacts.map(c => 
        c.id === contact.id ? contact : c
      );
      localStorage.setItem('contacts', JSON.stringify(savedContacts));
      localStorage.setItem('contactColors', JSON.stringify(colors));
      
      console.log('Contact sauvegardé localement:', contact);
      alert('Contact sauvegardé !');
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
      
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      
      const updatedColors = { ...colors };
      delete updatedColors[id];
      setColors(updatedColors);
      localStorage.setItem('contactColors', JSON.stringify(updatedColors));
      
      if (openId === id) {
        setOpenId(null);
      }
    }
  };

  // Affichage des contacts
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
                    {/* Section Contact */}
                    <div className="section-title">Contact</div>
                    <div className="form-row">
                      <label>
                        Prénom
                        <input
                          type="text"
                          value={contact.prenom || ''}
                          onChange={e => handleChange(contact.id, 'prenom', e.target.value)}
                        />
                      </label>
                      <label>
                        Nom
                        <input
                          type="text"
                          value={contact.nom || ''}
                          onChange={e => handleChange(contact.id, 'nom', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Entreprise
                        <input
                          type="text"
                          value={contact.entreprise || ''}
                          onChange={e => handleChange(contact.id, 'entreprise', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Téléphone Fixe
                        <input
                          type="text"
                          value={contact.telephone_fixe || ''}
                          onChange={e => handleChange(contact.id, 'telephone_fixe', e.target.value)}
                        />
                      </label>
                      <label>
                        Téléphone Mobile
                        <input
                          type="text"
                          value={contact.telephone_mobile || ''}
                          onChange={e => handleChange(contact.id, 'telephone_mobile', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Email
                        <input
                          type="email"
                          value={contact.email || ''}
                          onChange={e => handleChange(contact.id, 'email', e.target.value)}
                        />
                      </label>
                      <label>
                        Site Web
                        <input
                          type="text"
                          value={contact.site_web || ''}
                          onChange={e => handleChange(contact.id, 'site_web', e.target.value)}
                        />
                      </label>
                    </div>

                    {/* Section Adresse */}
                    <div className="section-title">Adresse</div>
                    <div className="form-row">
                      <label>
                        Adresse
                        <textarea
                          value={contact.adresse || ''}
                          onChange={e => handleChange(contact.id, 'adresse', e.target.value)}
                          rows={3}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Ville
                        <input
                          type="text"
                          value={contact.ville || ''}
                          onChange={e => handleChange(contact.id, 'ville', e.target.value)}
                        />
                      </label>
                      <label>
                        Code Postal
                        <input
                          type="text"
                          value={contact.code_postal || ''}
                          onChange={e => handleChange(contact.id, 'code_postal', e.target.value)}
                        />
                      </label>
                    </div>

                    {/* Section Professionnel */}
                    <div className="section-title">Professionnel</div>
                    <div className="form-row">
                      <label>
                        Catégorie Principale
                        <select
                          value={contact.categorie_principale || ''}
                          onChange={e => handleChange(contact.id, 'categorie_principale', e.target.value)}
                        >
                          <option value="">Sélectionner</option>
                          {[
                            "Entrepreneurs",
                            "Plombiers",
                            "Electriciens",
                            "Assureurs",
                            "Comptables",
                            "Notaires",
                            "Architectes",
                            "Avocats",
                            "Syndics",
                            "Agents immobiliers",
                            "Diagnostiqueurs",
                            "Autres"
                          ].map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Sous-catégorie
                        <input
                          type="text"
                          value={contact.sous_categorie || ''}
                          onChange={e => handleChange(contact.id, 'sous_categorie', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Spécialités
                        <input
                          type="text"
                          value={Array.isArray(contact.specialites) ? contact.specialites.join(', ') : ''}
                          onChange={e => handleArrayChange(contact.id, 'specialites', e.target.value)}
                          placeholder="Séparées par des virgules"
                        />
                      </label>
                      <label>
                        Zone d'intervention
                        <input
                          type="text"
                          value={contact.zone_intervention || ''}
                          onChange={e => handleChange(contact.id, 'zone_intervention', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        SIRET
                        <input
                          type="text"
                          value={contact.siret || ''}
                          onChange={e => handleChange(contact.id, 'siret', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Horaires
                        <textarea
                          value={contact.horaires || ''}
                          onChange={e => handleChange(contact.id, 'horaires', e.target.value)}
                          rows={3}
                        />
                      </label>
                      <label>
                        Tarifs indicatifs
                        <textarea
                          value={contact.tarifs_indicatifs || ''}
                          onChange={e => handleChange(contact.id, 'tarifs_indicatifs', e.target.value)}
                          rows={3}
                        />
                      </label>
                    </div>

                    {/* Section Supplémentaire */}
                    <div className="section-title">Supplémentaire</div>
                    <div className="form-row">
                      <label>
                        Tags
                        <input
                          type="text"
                          value={Array.isArray(contact.tags) ? contact.tags.join(', ') : ''}
                          onChange={e => handleArrayChange(contact.id, 'tags', e.target.value)}
                          placeholder="Séparés par des virgules"
                        />
                      </label>
                      <label>
                        Notes
                        <textarea
                          value={contact.notes || ''}
                          onChange={e => handleChange(contact.id, 'notes', e.target.value)}
                          rows={3}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Recommandé par
                        <input
                          type="text"
                          value={contact.recommande_par || ''}
                          onChange={e => handleChange(contact.id, 'recommande_par', e.target.value)}
                        />
                      </label>
                      <label>
                        Évaluation
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={contact.evaluation || ''}
                          onChange={e => handleChange(contact.id, 'evaluation', parseInt(e.target.value) || '')}
                        />
                        <div className="evaluation-field">
                          {contact.evaluation ? '★'.repeat(contact.evaluation) + '☆'.repeat(5 - contact.evaluation) : 'Non évalué'}
                        </div>
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Actif
                        <input
                          type="checkbox"
                          checked={contact.actif !== false}
                          onChange={e => handleChange(contact.id, 'actif', e.target.checked)}
                        />
                      </label>
                      <label>
                        Date d'ajout
                        <input
                          type="text"
                          value={contact.date_ajout ? new Date(contact.date_ajout).toLocaleString() : ''}
                          readOnly
                          className="readonly-field"
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Dernière utilisation
                        <input
                          type="text"
                          value={contact.derniere_utilisation ? new Date(contact.derniere_utilisation).toLocaleString() : ''}
                          readOnly
                          className="readonly-field"
                        />
                      </label>
                      <label>
                        Critères de recherche
                        <input
                          type="text"
                          value={contact.criteres_recherche || ''}
                          onChange={e => handleChange(contact.id, 'criteres_recherche', e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Documents
                        <div className="documents-field">
                          {Array.isArray(contact.documents) && contact.documents.length > 0 ? (
                            contact.documents.map((doc, index) => (
                              <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer">
                                {doc.name}
                              </a>
                            ))
                          ) : (
                            <span>Aucun document</span>
                          )}
                        </div>
                      </label>
                    </div>

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