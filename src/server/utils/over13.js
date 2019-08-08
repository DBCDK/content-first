const moment = require('moment');

const over13 = cpr => {
  if (cpr.length !== 10) {
    return 'misformed cpr';
  }
  let bd = cpr.substr(0, 6);

  let now = moment();
  let n = now.format('DDMMYYYY');
  let yearNow = n.substr(6, 2);

  let dayMonth = bd.substr(0, 4);
  let yearCheck = bd.substr(4, 2);

  let fullBirthYear = yearCheck > yearNow ? '19' + yearCheck : '20' + yearCheck;

  let fullDate = dayMonth + fullBirthYear;
  let bdMoment = moment(fullDate, 'DDMMYYYY');

  let age = now.diff(bdMoment, 'years');

  return age >= 13 ? true : false;
};

module.exports = over13;
