'use strict';

const constants = {
  apiHealth: '/health',
  apiGetToken: '/oauth/token',
  s_OneHour: 60 * 60,
  s_OneMonth: 30 * 24 * 60 * 60,
  healthyResponse: {
    ok: {
      clientStore: {responseTime: 1},
      configStore: {responseTime: 2},
      agencyStore: {responseTime: 3},
      tokenStore: {responseTime: 4}
    }
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
