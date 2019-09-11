import {intersectionBy} from 'lodash';

/**
 * Sort function which takes a list of tags - sorts them - and returns a list of tags
 *
 * @param {array} tags list af tags
 * @returns {array} list of sorted tags
 */

export default function intersectTags(works) {
  const tags = works.map(work => {
    return work.book.tags;
  });

  return intersectionBy(...tags, 'id');
}
