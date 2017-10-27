'use strict';

const constants = {
  apiHealth: '/health',
  apiGetTicket: '/getTicket'
};

module.exports = () => {
  return Object.assign({}, constants);
};
