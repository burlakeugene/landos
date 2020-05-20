import initialState from './defaultsState/preloader.js';

var appReducer = function (state = initialState, action) {
  let newState = Object.assign({}, state);
  if (action.type === 'VISIBLE_CHANGE') {
    newState.status = action.payload;
    return newState;
  }
  return state;
};

export default appReducer;
