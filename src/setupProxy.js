const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/v1', {target: 'http://localhost:3001/'}));
};
