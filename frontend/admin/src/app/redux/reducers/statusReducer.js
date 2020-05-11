import initialState from './defaultsState/status.js';

var appReducer = function (state = initialState, action) {
  let newState = Object.assign({}, state);
  if (action.type === 'STATUS_CHANGE') {
    newState.status = { ...newState.status, ...action.payload };
    return newState;
  }
  return state;
};

export default appReducer;
