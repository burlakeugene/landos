import config from 'config';

export const getConfig = (property) => {
  return property ? config[property] : config;
}

export const getRestUrl = (string = '') => {
  let selector = getConfig('appSelector'),
    appDom = document.querySelector(selector),
    root = appDom ? appDom.getAttribute('data-url') : '';
  return root + string;
}