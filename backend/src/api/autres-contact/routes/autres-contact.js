'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::autres-contact.autres-contact', {
  config: {
    'recherche-intelligente': {
      method: 'GET',
      path: '/autres-contact/recherche-intelligente',
      handler: 'autres-contact.rechercheIntelligente',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  },
});
