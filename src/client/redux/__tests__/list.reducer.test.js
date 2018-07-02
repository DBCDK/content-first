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

const booksState = {
  books: {
    pid1: {
      book: {
        pid: 'pid1',
        title: 'title1',
        description: 'lorem ipsum...'
      }
    },
    pid2: {
      book: {
        pid: 'pid2',
        title: 'title2',
        description: 'lorem ipsum...'
      }
    },
    pid3: {
      book: {
        pid: 'pid3',
        title: 'title3',
        description: 'lorem ipsum...'
      }
    }
  }
};

describe('listReducer', () => {
  test('add position to list elements if none given', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'list1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addElementToList(
        {
          book: {pid: 'pid1'}
        },
        'list1'
      )
    );

    const state = {listReducer: listState, booksReducer: booksState};

    // Expects, if a book dont have a position, a position will be added in LIST_LOAD_RESPONSE
    expect(getListById(state, 'list1').list[0].position);
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
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        description: 'a description 1',
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 2',
        description: 'a description 2',
        id: 'some-id-2',
        _created: '1234'
      })
    );
    const state = {listReducer: listState, booksReducer: booksState};

    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove list', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 2',
        type: CUSTOM_LIST,
        id: 'some-id-2',
        _created: '1234'
      })
    );
    listState = listReducer(listState, removeList('some-id-1'));

    const state = {listReducer: listState, booksReducer: booksState};

    expect(getLists(state)).toMatchSnapshot();
  });
  test('get lists by type', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 2',
        type: SYSTEM_LIST,
        id: 'some-id-2',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 3',
        type: CUSTOM_LIST,
        id: 'some-id-3',
        _created: '1234'
      })
    );

    const state = {listReducer: listState, booksReducer: booksState};

    expect(getLists(state, {type: CUSTOM_LIST})).toMatchSnapshot();
  });
  test('get lists for owner', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        owner: 'some-owner',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 2',
        type: SYSTEM_LIST,
        id: 'some-id-2',
        owner: 'some-owner-2',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addList({
        title: 'some list 3',
        type: CUSTOM_LIST,
        id: 'some-id-3',
        owner: 'some-owner',
        _created: '1234'
      })
    );

    const state = {listReducer: listState, booksReducer: booksState};

    expect(getListsForOwner(state, {owner: 'some-owner'})).toMatchSnapshot(); // owned lists
    expect(getListsForOwner(state)).toMatchSnapshot(); // no lists
  });
  test('add element to list', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'list2',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addElementToList({book: {pid: 'pid1'}, position: {x: 0, y: 0}}, 'list2')
    );

    const state = {listReducer: listState, booksReducer: booksState};
    expect(getLists(state)).toMatchSnapshot();
  });
  test('add element to list twice - no duplicates allowed', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addElementToList(
        {
          book: {pid: 'pid1'},
          position: {x: 0, y: 0},
          description: 'some-description-1'
        },
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      addElementToList(
        {book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    const state = {listReducer: listState, booksReducer: booksState};
    expect(getLists(state)).toMatchSnapshot();
  });
  test('remove element from list', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addElementToList(
        {_id: '123', book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      addElementToList(
        {_id: '456', book: {pid: 'pid2'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      removeElementFromList({_id: '123', book: {pid: 'pid1'}}, 'some-id-1')
    );
    const state = {listReducer: listState, booksReducer: booksState};
    expect(getLists(state)).toMatchSnapshot();
  });
  test('toggle element in list', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1')
    );

    const state = {listReducer: listState, booksReducer: booksState};

    expect(getLists(state)).toMatchSnapshot();

    listState = listReducer(
      listState,
      toggleElementInList({book: {pid: 'pid1'}}, 'some-id-1')
    );

    state.listReducer = listState;

    expect(getLists(state)).toMatchSnapshot();
  });
  test('insert element at specific pos in list', () => {
    let listState = listReducer(
      {lists: {}},
      addList({
        title: 'some list 1',
        type: CUSTOM_LIST,
        id: 'some-id-1',
        _created: '1234'
      })
    );
    listState = listReducer(
      listState,
      addElementToList(
        {book: {pid: 'pid1'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      addElementToList(
        {book: {pid: 'pid2'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      addElementToList(
        {book: {pid: 'pid3'}, position: {x: 0, y: 0}},
        'some-id-1'
      )
    );
    listState = listReducer(
      listState,
      insertElement({book: {pid: 'pid3'}}, 1, 'some-id-1')
    );

    const state = {listReducer: listState, booksReducer: booksState};

    expect(getLists(state)).toMatchSnapshot();
  });
});
