const recommendations = [
  {pid: '870970-basis:52038014'},
  {pid: '870970-basis:52530423'},
  {pid: '870970-basis:52387078'},
  {pid: '870970-basis:52939321'},
  {pid: '870970-basis:51591046'},
  {pid: '870970-basis:52788226'},
  {pid: '870970-basis:51861213'},
  {pid: '870970-basis:24281922'},
  {pid: '870970-basis:51704185'},
  {pid: '870970-basis:20665823'},
  {pid: '870970-basis:51735692'},
  {pid: '870970-basis:51263146'},
  {pid: '870970-basis:29259178'},
  {pid: '870970-basis:52236126'},
  {pid: '870970-basis:51319079'}
];

function getRandomValues(arr, count) {
  var result = [];
  var _tmp = arr.slice();
  for (var i = 0; i < count; i++) {
    var index = Math.ceil(Math.random() * 10) % _tmp.length;
    result.push(_tmp.splice(index, 1)[0]);
  }
  return result;
}

export default () =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(getRandomValues(recommendations, 6));
    }, Math.random() * 1000 + 500)
  );
