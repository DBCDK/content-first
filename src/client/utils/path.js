// https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
export function eventPath(evt) {
  var path = (evt.composedPath && evt.composedPath()) || evt.path,
    target = evt.target;

  if (path !== null) {
    // Safari doesn't include Window, but it should.
    return path.indexOf(window) < 0 ? path.concat(window) : path;
  }

  if (target === window) {
    return [window];
  }

  function getParents(node, memo) {
    memo = memo || [];
    var parentNode = node.parentNode;

    if (!parentNode) {
      return memo;
    }
    return getParents(parentNode, memo.concat(parentNode));
  }

  return [target].concat(getParents(target), window);
}
