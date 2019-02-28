import T, {lang, units} from '../components/base/T';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

const monthsShort = units.shortMonths[lang];

export const monthsLong = [
  'januar',
  'februar',
  'marts',
  'april',
  'maj',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'december'
];

/**
 * Local function to construct a Date object using either a date string or a numeric number
 * consisting of a number of seconds since January 01, 1970
 *
 * @param timestamp
 * @returns {Date}
 */
function makeDate(timestamp) {
  return typeof timestamp === 'number'
    ? new Date(timestamp * 1000)
    : new Date(timestamp);
}

/**
 * Formats a delta time between a past date and now
 * The format is plain danish
 *
 * @param past The past date
 * @returns {string}
 * @constructor
 */
export default function TimeToString(past) {
  const delta = Math.abs(Date.now() / 1000 - past);
  const years = Math.floor(delta / YEAR);
  const months = Math.floor(delta / MONTH);
  const days = Math.floor(delta / DAY);
  const hours = Math.floor(delta / HOUR);
  const minutes = Math.floor(delta / MINUTE);
  if (years) {
    return `${years} ${units[years === 1 ? 'year' : 'years'][lang]}`;
  }
  if (months) {
    return `${months} ${units[months === 1 ? 'month' : 'months'][lang]}`;
  }
  if (days) {
    return `${days} ${units[days === 1 ? 'day' : 'days'][lang]}`;
  }
  if (hours) {
    return `${hours} ${units[hours === 1 ? 'hour' : 'hours'][lang]}`;
  }
  if (minutes) {
    return `${minutes} ${units[minutes === 1 ? 'minute' : 'minutes'][lang]}`;
  }
  return T({component: 'post', name: 'now'});
}

/**
 *
 * @param timestamp
 * @returns {string}
 */
export function timestampToDateTime(timestamp) {
  const a = makeDate(timestamp);
  const year = a.getFullYear();
  const month = monthsShort[a.getMonth()];
  const date = a.getDate();

  // zerofill time (12:1 = 12:01)
  const hour = ('0' + a.getHours()).slice(-2);
  const min = ('0' + a.getMinutes()).slice(-2);
  // const sec = ('0' + a.getSeconds()).slice(-2);

  return date + '. ' + month + ' ' + year + ' kl. ' + hour + ':' + min;
}

/**
 *
 * @param timestamp
 * @returns {string}
 */
export function timestampToLongDate(timestamp) {
  const a = makeDate(timestamp);
  const year = a.getFullYear();
  const month = monthsLong[a.getMonth()];
  const date = a.getDate();

  return date + '. ' + month + ' ' + year;
}
