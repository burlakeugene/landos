import history from 'core/history';

export const historyReplace = (url) => {
  history.replace(url);
};

export const historyPush = (url) => {
  history.push(url);
};
