'use strict';

const constants = {
  communityName: 'Læsekompasset',
  apiHealth: '/howru',
  apiCommunity: '/v1/community',
  healthyResponse: {
    ok: true
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
