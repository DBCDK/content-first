export const getLeaves = (filters) => {
  let leaves = [];
  filters.forEach(filter => {
    if (filter.children) {
      leaves = [...leaves, ...getLeaves(filter.children)];
    }
    else {
      leaves.push(filter);
    }
  });
  return leaves;
};
