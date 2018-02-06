import taxonomyJson from '../../data/exportTaxonomy.json';

export const taxonomy = taxonomyJson;

export const getLeaves = (t = taxonomy, parentStack = []) => {
  if (Array.isArray(t)) {
    return t.map(leaf => {
      return Object.assign({}, leaf, {parents: [...parentStack]});
    });
  }
  let result = [];
  Object.entries(t).forEach(([key, value]) => {
    parentStack.push(key);
    const tmp = getLeaves(value, parentStack);
    parentStack.pop();
    result = result.concat(tmp);
  });
  return result;
};

export const getLeavesMap = (t = taxonomy) => {
  const res = {};
  getLeaves(t).forEach(leaf => {
    res[leaf.id] = leaf;
  });
  return res;
};
