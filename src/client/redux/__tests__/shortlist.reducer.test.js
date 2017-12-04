import shortListReducer, {SHORTLIST_LOAD_RESPONSE} from '../shortlist.reducer';

const createTestState = () => ({
  expanded: false,
  elements: [],
  isLoading: false,
  pendingMerge: null
});

describe('shortListReducer', () => {

  test('when load response include only local storage elements, pendingMerge is null', () => {
    const state = createTestState();
    const action = {
      type: SHORTLIST_LOAD_RESPONSE,
      localStorageElements: [
        {book: {pid: 'pid1'}},
        {book: {pid: 'pid2'}}
      ]
    };
    const result = shortListReducer(state, action);
    expect(result).toMatchSnapshot();
  });

  test('when load response include elements from local storage and database, pendingMerge with diff is created', () => {
    const state = createTestState();
    const action = {
      type: SHORTLIST_LOAD_RESPONSE,
      localStorageElements: [
        {book: {pid: 'pid1'}},
        {book: {pid: 'pid2'}}
      ],
      databaseElements: [
        {book: {pid: 'pid2'}},
        {book: {pid: 'pid3'}}
      ]
    };
    const result = shortListReducer(state, action);
    expect(result).toMatchSnapshot();
  });
});
