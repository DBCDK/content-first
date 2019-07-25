const {difference} = require('lodash');

const taxonomyJson =
  process.env.NODE_ENV === 'ci'
    ? require('../../data/examples/exportTaxonomy.json')
    : require('../../data/exportTaxonomy.json');
const taxonomy = taxonomyJson;

const getLeaves = (t = taxonomy, parentStack = []) => {
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

const getFromTitleMap = (t = taxonomy) => {
  const res = {};
  getLeaves(t).forEach(leaf => {
    if (!leaf.parents.includes('Hovedperson(er)')) {
      res[leaf.title.toLowerCase()] = leaf;
    }
  });
  return res;
};
let fromTitleMap;
const fromTitle = title => {
  if (!fromTitleMap) {
    fromTitleMap = getFromTitleMap();
  }
  return fromTitleMap[title.toLowerCase()];
};

const upperCaseFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const subjectsToTaxonomyDescription = subjects => {
  if (!subjects) {
    return '';
  }
  subjects = subjects.slice(0, 6);
  switch (subjects.length) {
    case 1:
      return `${upperCaseFirst(subjects[0])}`;
    case 2:
      return `${upperCaseFirst(subjects[0])} og ${subjects[1]}`;
    case 3:
      return `${upperCaseFirst(subjects[0])}, ${subjects[1]} og ${subjects[2]}`;
    case 4:
      return `${upperCaseFirst(subjects[0])} og ${
        subjects[1]
      }\n${upperCaseFirst(subjects[2])} og ${subjects[3]}`;
    case 5:
      return `${upperCaseFirst(subjects[0])}, ${subjects[1]} og ${
        subjects[2]
      }\n${upperCaseFirst(subjects[3])} og ${subjects[4]}`;
    case 6:
      return `${upperCaseFirst(subjects[0])}, ${subjects[1]} og ${
        subjects[2]
      }\n${upperCaseFirst(subjects[3])}, ${subjects[4]} og ${subjects[5]}`;
    case 0:
    default:
      return '';
  }
};

module.exports = {
  fromTitle,
  subjectsToTaxonomyDescription
};
