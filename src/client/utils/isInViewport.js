// check if an element is inside the viewport

export default function isInViewport(elem, offset = 0) {
  var bounding = elem.getBoundingClientRect();

  return (
    bounding.top >= offset &&
    bounding.left >= offset &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}
