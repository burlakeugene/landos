import { combineReducers } from 'redux';
import statusReducer from './statusReducer';
import removingReducer from './removingReducer';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  routing: routerReducer,
  statusReducer,
  removingReducer
});
