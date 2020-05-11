import initialState from './defaultsState/app.js';

var appReducer = function (state = initialState, action) {
  let newState = Object.assign({}, state);
  if (action.type === 'LOAD_SWITCH') {
    if (state.preloader.visible !== action.payload.visible) {
      newState.preloader.visible = action.payload.visible;
    }
    return newState;
  }
  return state;
};

export default appReducer;
