'use strict';

const constants = {
  apiHealth: '/health',
  healthyResponse: [
    {
      name: 'db',
      state: 'ok'
    },
    {
      name: 'borchk',
      state: 'ok'
    },
    {
      name: 'culr',
      state: 'ok'
    },
    {
      name: 'smaug',
      state: 'ok'
    },
    {
      name: 'openAgency',
      state: 'ok'
    }
  ],
  apiGetTicket: '/getTicket',
  apiGetUser: '/v2/user'
};

module.exports = () => {
  return Object.assign(
    {
      apiGetUserIdByToken: token => {
        return `${constants.apiGetUser}?access_token=${token}`;
      }
    },
    constants
  );
};
