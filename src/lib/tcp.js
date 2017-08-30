'use strict';

function normalizePort (str) {
  const port = parseInt(str, 10);
  if (isNaN(port) || port <= 0) {
    return null;
  }
  return port;
}
exports.normalizePort = normalizePort;
