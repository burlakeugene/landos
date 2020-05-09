import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { getConfig } from 'modules/app';
function init() {
  let appDOM = document.querySelector(getConfig('appSelector'));
  if (!appDOM) return;
  ReactDOM.render(<App />, appDOM);
}
init();
