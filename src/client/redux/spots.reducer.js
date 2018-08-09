import spots from '../../client/components/spots/spotsMockData.json';

const defaultState = {
  spots: spots ? spots : []
};
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
const spotsReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
export default spotsReducer;
