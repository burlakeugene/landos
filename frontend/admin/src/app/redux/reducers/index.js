import { combineReducers } from 'redux';
import statusReducer from './statusReducer';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  routing: routerReducer,
  statusReducer
});
