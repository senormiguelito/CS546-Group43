import allRoutes from './routes.js';

const constructorMethod = (app) => {
  app.use('/', allRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;