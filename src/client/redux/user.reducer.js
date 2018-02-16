const defaultState = {
  profileImageIsLoading: false,
  profileImage: null,
  isLoading: false,
  isLoggedIn: false
};

export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';
export const ON_LOGOUT_REQUEST = 'ON_LOGOUT_REQUEST';
export const ON_LOGOUT_RESPONSE = 'ON_LOGOUT_RESPONSE';
export const ADD_PROFILE_IMAGE = 'ADD_PROFILE_IMAGE';
export const ADD_PROFILE_IMAGE_SUCCESS = 'ADD_PROFILE_IMAGE_SUCCESS';
export const ADD_PROFILE_IMAGE_ERROR = 'ADD_PROFILE_IMAGE_ERROR';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const ADD_USER_AGENCY = 'ADD_USER_AGENCY';
export const SAVE_USER_PROFILE = 'SAVE_USER_PROFILE';
export const SAVE_USER_PROFILE_ERROR = 'SAVE_USER_PROFILE_ERROR';
export const SAVE_USER_PROFILE_SUCCESS = 'SAVE_USER_PROFILE_SUCCESS';

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_USER_DETAILS_REQUEST:
      return Object.assign({}, state, {isLoading: true});
    case ON_USER_DETAILS_RESPONSE:
      if (!action.user) {
        return Object.assign({}, defaultState);
      }
      return Object.assign({}, state, action.user, {
        isLoggedIn: true,
        isLoading: false
      });
    case ON_LOGOUT_REQUEST:
      return Object.assign({}, {isLoading: true});
    case ON_LOGOUT_RESPONSE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        isLoading: false
      });
    case ADD_PROFILE_IMAGE: {
      return Object.assign({}, state, {
        profileImageIsLoading: true,
        profileImage: null
      });
    }
    case ADD_PROFILE_IMAGE_SUCCESS: {
      return Object.assign({}, state, {
        profileImageIsLoading: false,
        tempImageId: action.image.id
      });
    }
    case ADD_PROFILE_IMAGE_ERROR: {
      return Object.assign({}, state, {
        profileImageIsLoading: false,
        imageError: action.error
      });
    }
    case UPDATE_USER_PROFILE: {
      return Object.assign({}, state, action.profile);
    }
    case SAVE_USER_PROFILE: {
      return Object.assign({}, state, {isSaving: true});
    }
    case SAVE_USER_PROFILE_ERROR: {
      return Object.assign({}, state, {
        saveUserError: action.error.status,
        isSaving: false
      });
    }
    case SAVE_USER_PROFILE_SUCCESS: {
      return Object.assign({}, state, action.user, {isSaving: false});
    }
    case ADD_USER_AGENCY: {
      return Object.assign({}, state, {agencyName: action.agencyName});
    }
    default:
      return state;
  }
};

export default userReducer;
