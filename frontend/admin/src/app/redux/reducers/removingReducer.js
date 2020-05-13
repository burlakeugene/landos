import initialState from './defaultsState/removing.js';

var appReducer = function (state = initialState, action) {
  let newState = Object.assign({}, state);
  if (action.type === 'REMOVING_CHANGE') {
    newState.removing = { ...newState.removing, ...action.payload };
    return newState;
  }
  return state;
};

export default appReducer;
