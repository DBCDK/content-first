import {setItem, getItem} from '../utils/localstorage';

const REPLAY_BEGIN = 'REPLAY_BEGIN';
const REPLAY_END = 'REPLAY_END';

const LOCAL_STORAGE_REPLAY_KEY = 'contentfirstreplay';
const LOCAL_STORAGE_REPLAY_VERSION = 1;

const REPLAY_PATH = '/replay';

const IGNORED_PATHS = {'/replay': true, '/profile/opret': true};

// Put actions here, which should be listened for
// and put in replay queue
const replayableActions = {
  ORDER: action => action,
  ON_LOCATION_CHANGE: action => {
    // Add to history if not included in the ignored paths
    return !IGNORED_PATHS[action.path]
      ? {type: 'HISTORY_REPLACE', path: action.path + action.location.search}
      : null;
  }
};

// Some times we want to clear the replay queue,
// for instance, at page changes and when modal closes
const clearActions = {
  CLOSE_MODAL: () => true,
  ON_LOCATION_CHANGE: action => !IGNORED_PATHS[action.path]
};

// Actions which will never be deleted from replay queue
// For isntance, we always want to replay the latest location
const keepAfterClear = {
  ON_LOCATION_CHANGE: true
};

// Actions which will be replaced. I.e. Multiple entries not allowed
const replaceExisting = {
  ON_LOCATION_CHANGE: true
};

// Actions which will trigger dispatch of actions in replay queue
const replayBeginWhen = {
  ON_USER_DETAILS_ERROR: state => {
    // return false if user dont have an account
    return state.routerReducer.path === REPLAY_PATH;
  },
  ON_USER_DETAILS_RESPONSE: state => {
    // return false if user dont have an account
    return state.routerReducer.path === REPLAY_PATH;
  }
};

export const replayReducer = (
  state = getItem(LOCAL_STORAGE_REPLAY_KEY, LOCAL_STORAGE_REPLAY_VERSION, {
    isReplaying: false,
    actions: [
      {
        type: 'ON_LOCATION_CHANGE',
        path: '/',
        location: {pathname: '/', search: '', hash: ''}
      }
    ]
  }),
  action
) => {
  if (action.type === REPLAY_BEGIN) {
    return {...state, isReplaying: true};
  }
  if (action.type === REPLAY_END) {
    return {
      ...state,
      isReplaying: false,
      actions: state.actions.filter(a => keepAfterClear[a.type])
    };
  }
  if (state.isReplaying) {
    return state;
  }
  if (clearActions[action.type] && clearActions[action.type](action)) {
    state = {
      ...state,
      actions: state.actions.filter(a => keepAfterClear[a.type])
    };
  }
  if (
    replayableActions[action.type] &&
    replayableActions[action.type](action)
  ) {
    const actions = replaceExisting[action.type]
      ? state.actions.filter(a => a.type !== action.type)
      : state.actions;
    state = {...state, actions: [...actions, action]};
  }
  return state;
};

export const replayMiddleware = store => next => action => {
  const prevReplay = store.getState().replay;
  const res = next(action);
  const {replay} = store.getState();
  if (
    replayBeginWhen[action.type] &&
    replayBeginWhen[action.type](store.getState())
  ) {
    store.dispatch({type: REPLAY_BEGIN});
    replay.actions.forEach(a => store.dispatch(replayableActions[a.type](a)));
    store.dispatch({type: REPLAY_END});
  }

  if (prevReplay !== replay) {
    setItem(LOCAL_STORAGE_REPLAY_KEY, replay, LOCAL_STORAGE_REPLAY_VERSION);
  }
  return res;
};
