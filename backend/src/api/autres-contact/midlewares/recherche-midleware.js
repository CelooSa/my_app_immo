module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    
    if (ctx.url.includes('/recherche-intelligente')) {
     
      if (ctx.query.tags) {
        if (typeof ctx.query.tags === 'string') {
          ctx.query.tags = ctx.query.tags.split(',').map(tag => tag.trim());
        }
      }

      if (ctx.query.evaluationMin) {
        const eval = parseInt(ctx.query.evaluationMin);
        if (isNaN(eval) || eval < 1 || eval > 5) {
          return ctx.badRequest('evaluationMin doit être entre 1 et 5');
        }
      }
      strapi.log.info('Recherche intelligente:', ctx.query);
    }
    
    await next();
  };
};
      