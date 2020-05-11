import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import reducers from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();
const middleware = routerMiddleware(history);
export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, middleware))
);
