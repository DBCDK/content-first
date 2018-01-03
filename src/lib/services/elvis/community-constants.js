'use strict';

const constants = {
  apiHealth: '/howru',
  apiCommunity: '/v1/community',
  healthyResponse: {
    ok: true
  }
};

module.exports = () => {
  return Object.assign(
    {
      apiQuery: communityId => {
        return `${constants.apiCommunity}/${communityId}/query`;
      },
      apiProfileId: (communityId, profileId) => {
        return `${constants.apiCommunity}/${communityId}/profile/${profileId}`;
      },
      apiPostProfile: communityId => {
        return `${constants.apiCommunity}/${communityId}/profile`;
      },
      apiEntityId: (communityId, entityId) => {
        return `${constants.apiCommunity}/${communityId}/entity/${entityId}`;
      },
      apiPostEntity: communityId => {
        return `${constants.apiCommunity}/${communityId}/entity`;
      }
    },
    constants
  );
};
