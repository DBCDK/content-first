const defaultState = {};

export const ROLES_RESPONSE = 'ROLES_RESPONSE';

const rolesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ROLES_RESPONSE: {
      const nextState = {};
      if (Array.isArray(action.roles)) {
        action.roles.forEach(role => {
          nextState[role.machineName] = role;
        });
      }
      return nextState;
    }
    default:
      return state;
  }
};

export default rolesReducer;
