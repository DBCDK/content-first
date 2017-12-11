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
  return Object.assign({
    apiQuery: communityId => {
      return `${constants.apiCommunity}/${communityId}/query`;
    },
    apiProfile: (communityId, profileId) => {
      return `${constants.apiCommunity}/${communityId}/profile/${profileId}`;
    }
  }, constants);
};
