'use strict';

const constants = {
  apiHealth: '/howru',
  healthyResponse: {
    ok: true
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
