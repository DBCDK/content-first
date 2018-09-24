export default function timestampToDateTime(timestamp) {
  const a = new Date(timestamp * 1000);
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'maj',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec'
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  //const sec = a.getSeconds();
  const time = date + '. ' + month + ' ' + year + ' kl. ' + hour + ':' + min;
  return time;
}
