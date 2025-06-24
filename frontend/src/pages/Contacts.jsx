import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:1337/api/contacts')
      .then(response => {
        setContacts(response.data.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des contacts :', error);
      });
  }, []);

  return (
    <div className="page-container">
      <h1>Contacts utiles</h1>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <strong>{contact.attributes.nom}</strong><br />
            {contact.attributes.telephone} – {contact.attributes.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
