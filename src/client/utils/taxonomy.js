import taxonomyJson from '../data/exportTaxonomy.json';
import {getLeaves} from './filters';

export const taxonomy = taxonomyJson;
export const taxonomyMap = {};

getLeaves(taxonomy).forEach(l => {
  taxonomyMap[l.id] = l;
});

export const getById = (id, items) => {
  items = items ? items : taxonomy;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === id) {
      return item;
    }
    if (item.items) {
      const res = getById(id, item.items);
      if (res) {
        return res;
      }
    }
  }
  return null;
};
