module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;


        data.derniere_utilisation = new Date();

        if (data.tags && data.tags.lengh > 0) {
            data.specialites = [];
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        const fieldsToTrack = ['telephone', 'email', 'notes', 'evaluation'];
        const hasRelevantChanges = fieldsToTrack.some(field => field in data);

        if (hasRelevantChanges) {
            data.derniere_utilisation = new Date();
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        strapi.log.info(`Contact ${result.id} mis à jour - ${result.nom_complet}`);
    }
};