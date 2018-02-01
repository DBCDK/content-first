import {getLeaves, getLeavesMap} from '../taxonomy';

const taxonomy = {
  a: {
    aa: [{id: 1, title: 'leaf1', score: 0}, {id: 2, title: 'leaf2', score: 0}, {id: 3, title: 'leaf3', score: 0}]
  },
  b: [{id: 4, title: 'leaf4', score: 0}, {id: 5, title: 'leaf5', score: 0}],
  c: {cc: {ccc: [{id: 6, title: 'leaf6', score: 0}, {id: 7, title: 'leaf7', score: 0}]}}
};

describe('getLeaves', () => {
  test('Get leaves of the tree', () => {
    expect(getLeaves(taxonomy)).toMatchSnapshot();
  });

  test('Get leaves of the tree as a map', () => {
    expect(getLeavesMap(taxonomy)).toMatchSnapshot();
  });
});
