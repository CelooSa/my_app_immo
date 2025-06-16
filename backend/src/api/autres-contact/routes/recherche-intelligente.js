module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/autres-contacts/recherche-intelligente',
      handler: 'autres-contact.rechercheIntelligente',
      config: {
        auth: false, 
      }
    },
    {
      method: 'GET',
      path: '/autres-contacts/proximite',
      handler: 'autres-contact.rechercheProximite',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/autres-contacts/analytics',
      handler: 'autres-contact.analyticsRecherche',
      config: {
        auth: false,
      }
    }
]
};