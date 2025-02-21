import { createServer } from 'json-server';
const server = createServer();
const router = server.router('db.json');
const middlewares = server.defaults();

server.use(middlewares);
server.use(router);

export default (req, res) => {
  server(req, res);
};