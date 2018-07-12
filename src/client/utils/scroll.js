export default function scroll(top, left = 0, behavior = 'smooth') {
  window.scroll({
    top,
    left,
    behavior
  });
}
