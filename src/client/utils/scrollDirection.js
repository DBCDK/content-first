let lastScrollTop = 0;

export default function scrollDirection() {
  let direction = null;
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    direction = 'down';
  } else {
    direction = 'up';
  }
  lastScrollTop = st <= 0 ? 0 : st;
  return direction;
}
