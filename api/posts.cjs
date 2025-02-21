const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = (req, res) => {
  try {
    server(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};