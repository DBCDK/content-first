import listReducer, {addList, getLists, removeList, addElementToList, removeElementFromList, toggleElementInList, CUSTOM_LIST, SYSTEM_LIST} from '../list.reducer';

// in production id will be augmented by middleware by fetching it with a POST to backend
const idAugmenterMock = (action, id) => {
  action.list.links.self = id;
  return action;
};

describe('listReducer', () => {
  test('add list throws when id is missing', () => {
    expect(() => {
      listReducer(undefined, addList({title: 'some list 1', description: 'a description 1'}), 'some-id-1');
    }).toThrow();
  });
  test('add lists', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', description: 'a description 1'}), 'some-id-1'));
    state = listReducer(state, idAugmenterMock(addList({title: 'some list 2', description: 'a description 2'}), 'some-id-2'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove list', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, idAugmenterMock(addList({title: 'some list 2', type: CUSTOM_LIST}), 'some-id-2'));
    state = listReducer(state, removeList('some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('get lists by type', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, idAugmenterMock(addList({title: 'some list 2', type: SYSTEM_LIST}), 'some-id-2'));
    state = listReducer(state, idAugmenterMock(addList({title: 'some list 3', type: CUSTOM_LIST}), 'some-id-3'));
    expect(getLists(state, {type: CUSTOM_LIST})).toMatchSnapshot();
  });
  test('add element to list', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, addElementToList({book: {pid: 'pid1'}}, 'some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('add element to list twice - no duplicates allowed', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, addElementToList({book: {pid: 'pid1'}}, 'some-id-1'));
    state = listReducer(state, addElementToList({book: {pid: 'pid1'}}, 'some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove element from list', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, addElementToList({book: {pid: 'pid1'}}, 'some-id-1'));
    state = listReducer(state, addElementToList({book: {pid: 'pid2'}}, 'some-id-1'));
    state = listReducer(state, removeElementFromList({book: {pid: 'pid1'}}, 'some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('toggle element in list', () => {
    let state = listReducer(undefined, idAugmenterMock(addList({title: 'some list 1', type: CUSTOM_LIST}), 'some-id-1'));
    state = listReducer(state, toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
    state = listReducer(state, toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
});
