import config from 'config';

export const getConfig = (property) => {
  return property ? config[property] : config;
}

export const getRestUrl = (string = '') => {
  return getSiteUrl() + string;
}

export const getSiteUrl = () => {
  let selector = getConfig('appSelector'),
    appDom = document.querySelector(selector),
    root = appDom ? appDom.getAttribute('data-url') : '';
  return root;
}