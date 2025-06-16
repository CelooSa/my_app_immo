import strapiClient from './strapiClient';

// Appartements
export const getAppartements = () => {
  return strapiClient.get('/appartements');
};

export const createAppartement = (data) => {
  return strapiClient.post('/appartements', { data });
};

export const updateAppartement = (id, data) => {
  return strapiClient.put(`/appartements/${id}`, { data });
};

export const deleteAppartement = (id) => {
  return strapiClient.delete(`/appartements/${id}`);
};

// Contacts
export const getContacts = () => {
  return strapiClient.get('/contacts');
};

export const createContact = (data) => {
  return strapiClient.post('/contacts', { data });
};

export const updateContact = (id, data) => {
  return strapiClient.put(`/contacts/${id}`, { data });
};

export const deleteContact = (id) => {
  return strapiClient.delete(`/contacts/${id}`);
};

// Tags
export const getTags = () => {
  return strapiClient.get('/tags');
};

export const createTag = (data) => {
  return strapiClient.post('/tags', { data });
};

// Fonction de test pour vérifier la connexion
export const testConnection = () => {
  return strapiClient.get('/appartements');
};