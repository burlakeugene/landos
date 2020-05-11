import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { getConfig } from 'modules/app';
import { store } from 'store';
import { Provider } from 'react-redux';

function init() {
  let appDOM = document.querySelector(getConfig('appSelector'));
  if (!appDOM) return;
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    appDOM
  );
}
init();
