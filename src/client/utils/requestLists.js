// import request from 'superagent';
import {setItem, getItem} from '../utils/localstorage';

const LIST_KEY = 'contentFirstLists';
const CURRENT_LIST_KEY = 'contentFirstCurrentList';
const LIST_VERSION = 1;

export const saveLists = (lists, isLoggedIn = false) => {
  setItem(LIST_KEY, lists, LIST_VERSION);
  if (isLoggedIn) {
    // Save on database
  }
};

export const loadLists = async isLoggedIn => {
  const localStorageElements = getItem(LIST_KEY, LIST_VERSION, []);
  if (!isLoggedIn) {
    return localStorageElements;
  }
  // Load from database
};
export const saveCurrentList = currentList => {
  setItem(CURRENT_LIST_KEY, currentList, LIST_VERSION);
};

export const loadCurrentlist = () => {
  return getItem(CURRENT_LIST_KEY, LIST_VERSION, {title: '', list: []});
};
