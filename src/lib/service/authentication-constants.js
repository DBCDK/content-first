'use strict';

const constants = {
  apiHealth: '/health',
  apiGetToken: '/oauth/token',
  s_OneHour: 60 * 60,
  s_OneMonth: 30 * 24 * 60 * 60
};

module.exports = () => {
  return Object.assign({}, constants);
};
