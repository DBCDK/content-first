/**
 * Recursively collects the leaves of the filters-tree.
 * @return list of filters
 */
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

/**
 * Will do some client-side filtering of works
 */
// export const filterWorks = (works, filters) => {
// };

/**
 * Will do some client-side sorting of works
 */
// export const sortWorks = (works, sortBy) => {
// };
