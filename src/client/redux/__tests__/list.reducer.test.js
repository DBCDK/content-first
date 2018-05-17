import listReducer, {
  addList,
  getLists,
  getListById,
  getListsForOwner,
  removeList,
  addElementToList,
  removeElementFromList,
  toggleElementInList,
  insertElement,
  CUSTOM_LIST,
  SYSTEM_LIST
} from '../list.reducer';

describe('listReducer', () => {
  test('add position to list elements if none given', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addElementToList(
        {
          book: {pid: 'pid1'},
          description: 'some-description-1'
        },
        'some-id-1'
      )
    );
    // Expects, if a book dont have a position, a position will be added in LIST_LOAD_RESPONSE
    expect(getListById(state, 'some-id-1').list[0].position);
  });
  test('add list throws when id is missing', () => {
    expect(() => {
      listReducer(
        {lists: {}},
        addList({
          title: 'some list 1',
          description: 'a description 1',
          _created: '1234'
        })
      );
    }).toThrow();
  });
  test('add lists', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        description: 'a description 1',
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 2',
        description: 'a description 2',
        id: 'some-id-2',
        _created: '1234'
      })
    );
    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove list', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 2',
        type: CUSTOM_LIST,
        id: 'some-id-2',
        _created: '1234'
      })
    );
    state = listReducer(state, removeList('some-id-1'));
    expect(getLists(state)).toMatchSnapshot();
  });
  test('get lists by type', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 2',
        type: SYSTEM_LIST,
        id: 'some-id-2',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 3',
        type: CUSTOM_LIST,
        id: 'some-id-3',
        _created: '1234'
      })
    );
    expect(getLists(state, {type: CUSTOM_LIST})).toMatchSnapshot();
  });
  test('get lists for owner', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        owner: 'some-owner',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 2',
        type: SYSTEM_LIST,
        id: 'some-id-2',
        owner: 'some-owner-2',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addList({
        title: 'some list 3',
        type: CUSTOM_LIST,
        id: 'some-id-3',
        owner: 'some-owner',
        _created: '1234'
      })
    );
    expect(getListsForOwner(state, {owner: 'some-owner'})).toMatchSnapshot(); // owned lists
    expect(getListsForOwner(state)).toMatchSnapshot(); // no lists
  });
  test('add element to list', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addElementToList(
        {book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    expect(getLists(state)).toMatchSnapshot();
  });
  test('add element to list twice - no duplicates allowed', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addElementToList(
        {
          book: {pid: 'pid1'},
          position: {x: 0, y: 0},
          description: 'some-description-1'
        },
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      addElementToList(
        {book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove element from list', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addElementToList(
        {_id: '123', book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      addElementToList(
        {_id: '456', book: {pid: 'pid2'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      removeElementFromList({_id: '123', book: {pid: 'pid1'}}, 'some-id-1')
    );
    expect(getLists(state)).toMatchSnapshot();
  });
  test('toggle element in list', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1')
    );
    expect(getLists(state)).toMatchSnapshot();
    state = listReducer(
      state,
      toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1')
    );
    expect(getLists(state)).toMatchSnapshot();
  });
  test('insert element at specific pos in list', () => {
    let state = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    state = listReducer(
      state,
      addElementToList(
        {book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      addElementToList(
        {book: {pid: 'pid2'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      addElementToList(
        {book: {pid: 'pid3'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    state = listReducer(
      state,
      insertElement({book: {pid: 'pid3'}}, 1, 'some-id-1')
    );
    expect(getLists(state)).toMatchSnapshot();
  });
});
