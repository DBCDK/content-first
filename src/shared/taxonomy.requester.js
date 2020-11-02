import {get} from 'lodash';

let taxonomy = {};
if (typeof window === 'undefined') {
  (async () => {
    const Taxonomy = require('../lib/services/taxonomy');
    const taxonomyClient = new Taxonomy();
    taxonomy = await taxonomyClient.getTaxonomy();
  })();
} else {
  // eslint-disable-next-line no-undef
  taxonomy = get(window, 'TAXONOMY') || {};
}

export const getTaxonomy = () => {
  return taxonomy;
};
