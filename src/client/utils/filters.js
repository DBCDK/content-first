/**
 * Recursively collects the leaves of the filters-tree.
 * @return list of filters
 */
export const getLeaves = (filters, titleStack=[]) => {
  let leaves = [];
  filters.forEach(filter => {
    if (filter.children) {
      titleStack.push(filter.title);
      leaves = [...leaves, ...getLeaves(filter.children, titleStack)];
      titleStack.pop();
    }
    else if (filter.items) {
      titleStack.push(filter.title);
      leaves = [...leaves, ...getLeaves(filter.items, titleStack)];
      titleStack.pop();
    }
    else {
      leaves.push(Object.assign({}, filter, {parents: [...titleStack]}));
    }
  });
  return leaves;
};
