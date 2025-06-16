'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::autres-contact.autres-contact', ({ strapi }) => ({
    
  async rechercheIntelligente(ctx) {
    try {
      const {
        categorie,
        tags,
        evaluationMin,
        appartementId,
        dateDepuis,
        urgent,
        weekend,
        zone,
        specialite,
        limit = 25,
        start = 0,
      } = ctx.query;

      let filters = {};
      let populate = {
        tags: true,
        appartements_travailles: true,
        criteres_recherche: {
          populate: {
            tags_requis: true,
            appartements_concernes: true
          }
        }
      };

      if (categorie) {
        filters.categorie_principale = { $eq: categorie };
      }
      
      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];
        filters.tags = {
          nom: { $in: tagsArray }
        };
      }

      if (evaluationMin) {
        filters.evaluation = { $gte: parseInt(evaluationMin) };
      }
      
      if (appartementId) {
        filters.appartements_travailles = {
          id: { $eq: parseInt(appartementId) }
        };
      }
      
      if (dateDepuis) {
        filters.derniere_utilisation = {
          $gte: new Date(dateDepuis)
        };
      }
      
      if (zone) {
        filters.zone_intervention = { $containsi: zone };
      }
      
      if (specialite) {
        filters.specialites = { $contains: specialite };
      }
      
      // CORRECTION: entityService au lieu de entifyService
      const contacts = await strapi.entityService.findMany('api::autres-contact.autres-contact', {
        filters,
        populate,
        limit: parseInt(limit),
        start: parseInt(start),
        sort: { derniere_utilisation: 'desc', evaluation: 'desc' }
      });

      let filteredContacts = contacts;

      if (urgent === 'true') {
        filteredContacts = filteredContacts.filter(contact =>
          contact.tags?.some(tag => tag.nom.toLowerCase().includes('urgent')) ||
          contact.criteres_recherche?.urgence_requise
        );
      }

      if (weekend === 'true') {
        filteredContacts = filteredContacts.filter(contact =>
          contact.tags?.some(tag => tag.nom.toLowerCase().includes('weekend')) ||
          contact.criteres_recherche?.disponible_weekends
        );
      }

      const scoredContacts = filteredContacts.map(contact => ({
        ...contact,
        score_pertinence: this.calculerScorePertinence(contact, ctx.query)
      }));

      scoredContacts.sort((a, b) => b.score_pertinence - a.score_pertinence);

      return {
        data: scoredContacts,
        meta: {
          total: scoredContacts.length,
          criteres_appliques: Object.keys(filters),
          suggestions: await this.genererSuggestions(ctx.query)
        }
      };

    } catch (error) {
      ctx.throw(500, `Erreur recherche intelligente: ${error.message}`);
    }
  },

  calculerScorePertinence(contact, criteres) {
    let score = 0;

    if (contact.evaluation) {
      score += contact.evaluation * 5;
    }

    if (criteres.tags && contact.tags) {
      const critereTags = Array.isArray(criteres.tags) ? criteres.tags : [criteres.tags];
      const matchingTags = contact.tags.filter(tag => 
        critereTags.some(ct => tag.nom.toLowerCase().includes(ct.toLowerCase()))
      );
      score += matchingTags.length * 10;
    }

    if (criteres.appartementId && contact.appartements_travailles) {
      const hasWorkedOnApartment = contact.appartements_travailles.some(
        apt => apt.id === parseInt(criteres.appartementId)
      );
      if (hasWorkedOnApartment) score += 25;
    }

    return Math.round(score);
  },

  async genererSuggestions(criteres) {
    const suggestions = [];

    if (criteres.categorie) {
      // CORRECTION: nom du modèle cohérent
      const contactsSimilaires = await strapi.entityService.findMany('api::autres-contact.autres-contact', {
        filters: { categorie_principale: { $eq: criteres.categorie } },
        populate: { tags: true },
        limit: 10
      });

      const tagsFrequents = {};
      contactsSimilaires.forEach(contact => {
        contact.tags?.forEach(tag => {
          tagsFrequents[tag.nom] = (tagsFrequents[tag.nom] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagsFrequents)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

      if (topTags.length > 0) {
        suggestions.push({
          type: 'tags_populaires',
          message: `Tags populaires pour ${criteres.categorie}:`,
          options: topTags
        });
      }
    }

    return suggestions;
  },

  async rechercheProximite(ctx) {
    try {
      const { latitude, longitude, rayon = 10 } = ctx.query;

      if (!latitude || !longitude) {
        return ctx.badRequest('Coordonnées GPS requises');
      }

      // CORRECTION: nom du modèle cohérent
      const contacts = await strapi.entityService.findMany('api::autres-contact.autres-contact', {
        populate: { tags: true, appartements_travailles: true }
      });

      return {
        data: contacts,
        meta: {
          centre: { latitude, longitude },
          rayon: `${rayon}km`
        }
      };

    } catch (error) {
      ctx.throw(500, `Erreur recherche proximité: ${error.message}`);
    }
  },

  async analyticsRecherche(ctx) {
    try {
      // CORRECTION: nom du modèle cohérent
      const contacts = await strapi.entityService.findMany('api::autres-contact.autres-contact', {
        populate: { tags: true }
      });

      const stats = {
        total_contacts: contacts.length,
        par_categorie: {},
        tags_plus_utilises: {},
        evaluations_moyennes: {},
        derniere_utilisation: {}
      };

      contacts.forEach(contact => {
        const cat = contact.categorie_principale || 'Non classé';
        stats.par_categorie[cat] = (stats.par_categorie[cat] || 0) + 1;

        contact.tags?.forEach(tag => {
          stats.tags_plus_utilises[tag.nom] = (stats.tags_plus_utilises[tag.nom] || 0) + 1;
        });
        
        if (contact.evaluation) {
          if (!stats.evaluations_moyennes[cat]) {
            stats.evaluations_moyennes[cat] = { total: 0, count: 0 };
          }
          stats.evaluations_moyennes[cat].total += contact.evaluation;
          stats.evaluations_moyennes[cat].count += 1;
        }
      });

      Object.keys(stats.evaluations_moyennes).forEach(cat => {
        const data = stats.evaluations_moyennes[cat];
        stats.evaluations_moyennes[cat] = Math.round((data.total / data.count) * 10) / 10;
      });

      return { data: stats };

    } catch (error) {
      ctx.throw(500, `Erreur analytics: ${error.message}`);
    }
  }
}));