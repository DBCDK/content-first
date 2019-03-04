import {difference} from 'lodash';
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

export const getFromTitleMap = (t = taxonomy) => {
  const res = {};
  getLeaves(t).forEach(leaf => {
    res[leaf.title.toLowerCase()] = leaf;
  });
  return res;
};
let fromTitleMap;
export const fromTitle = title => {
  if (!fromTitleMap) {
    fromTitleMap = getFromTitleMap();
  }
  return fromTitleMap[title.toLowerCase()];
};

export const isRange = tagId => Array.isArray(tagId) && tagId.length === 2;
export const isFullRange = (tagId, fullRange) =>
  fullRange[0] === tagId[0] && fullRange[fullRange.length - 1] === tagId[1];

export const isSameRange = (tagId, fullRange) =>
  isRange(tagId) && difference(tagId, fullRange).length === 0;
export const getFullRange = (tagId, filterCards, filtersMapAll) => {
  const filter = filtersMapAll[tagId] || filtersMapAll[tagId[0]];
  if (!filter) {
    return false;
  }
  const parent = filtersMapAll[filter.id].parents[0];
  const range = (filterCards[parent] && filterCards[parent].range) || false;
  return range;
};
export const findRangeLocation = (tagId, tags = [], fullRange) => {
  for (let i = 0; i < tags.length; i++) {
    if (isSameRange(tags[i], fullRange)) {
      return i;
    }
  }
  return -1;
};
export const getDistances = (tagId, fullRange) => {
  const index = fullRange.indexOf(tagId);
  return {begin: index, end: fullRange.length - index};
};
export const getQueryType = (
  selectedTagIdss,
  selectedCreators,
  selectedTitles
) => {
  if (selectedTagIdss.length > 0) {
    return 'tags';
  }
  if (selectedCreators.length > 0 || selectedTitles.length > 0) {
    return 'titlecreator';
  }
  return false;
};
export const getSelectedRange = (tagId, selectedRange, fullRange) => {
  if (isRange(tagId)) {
    return tagId;
  }
  if (!selectedRange) {
    return [tagId, tagId];
  }
  if (fullRange.indexOf(tagId) <= fullRange.indexOf(selectedRange[0])) {
    return [tagId, selectedRange[1]];
  } else if (fullRange.indexOf(tagId) >= fullRange.indexOf(selectedRange[0])) {
    return [selectedRange[0], tagId];
  }
  const distances = getDistances(tagId, fullRange);
  if (distances.begin < distances.end) {
    return [tagId, selectedRange[1]];
  }
  return [selectedRange[0], tagId];
};
export const tagsToUrlParams = tags =>
  tags.map(id => (isRange(id) ? id.join(':') : id)).join(',');

const upperCaseFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const subjectsToTaxonomyDescription = subjects => {
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
