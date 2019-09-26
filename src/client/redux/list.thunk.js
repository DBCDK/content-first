import {get} from 'lodash';

import {
  REMOVE_LIST,
  REMOVE_LIST_SUCCESS,
  REMOVE_LIST_ERROR,
  LISTS_EXPAND,
  LIST_LOAD_RESPONSE,
  ADD_ELEMENT_TO_LIST,
  UPDATE_LIST_DATA,
  LIST_TOGGLE_ELEMENT
} from './list.reducer';

export const storeList = (_id, openplatformId, cb) => {
  return async (dispatch, getState, {listRequester}) => {
    try {
      const list = get(getState(), `listReducer.lists[${_id}]`);
      await listRequester.saveList(list, openplatformId);
      if (cb) {
        cb(list);
      }
    } catch (e) {
      // ignored for now
    }
  };
};

export const addElementToList = (work, _id) => {
  return async dispatch => {
    dispatch({type: ADD_ELEMENT_TO_LIST, element: work, _id});
  };
};

export const toggleElement = (work, _id) => {
  return async dispatch => {
    dispatch({type: LIST_TOGGLE_ELEMENT, element: work, _id});
  };
};

export const updateListData = data => {
  return async dispatch => {
    dispatch({type: UPDATE_LIST_DATA, data});
  };
};

export const deleteList = _id => {
  return async (dispatch, getState, {listRequester}) => {
    try {
      dispatch({type: REMOVE_LIST, _id});
      await listRequester.deleteList(_id);
      dispatch({type: REMOVE_LIST_SUCCESS, _id});
    } catch (e) {
      dispatch({type: REMOVE_LIST_ERROR, _id});
    }
  };
};

export const fetchList = _id => {
  return async (dispatch, getState, {listRequester}) => {
    try {
      const list = await listRequester.fetchList(_id);
      dispatch({type: LISTS_EXPAND, lists: [list]});
    } catch (e) {
      dispatch({
        type: LIST_LOAD_RESPONSE,
        list: {_id: _id, error: e}
      });
    }
  };
};
