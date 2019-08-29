import {intersectionBy} from 'lodash';

/**
 * Sort function which takes a list of tags - sorts them - and returns a list of tags
 *
 * @param {array} tags list af tags
 * @returns {array} list of sorted tags
 */

export default function intersectTags(works) {
  const aaa = works.map(work => {
    return work.book.tags;
  });

  console.log('1.', JSON.stringify(aaa[0]));
  console.log('2.', JSON.stringify(aaa[1]));

  return intersectionBy(...aaa, 'id');
}
