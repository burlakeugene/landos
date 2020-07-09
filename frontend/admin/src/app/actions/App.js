import history from 'core/history';

export const historyReplace = (url) => {
  history.replace(url);
};

export const historyPush = (url) => {
  history.push(url);
};

export const genHash = () => {
  let rand = window.Math.floor(window.Math.random() * 0x10000000000000),
    result;
  (rand = rand.toString(16).substring(1)),
    (result = rand.split('').splice(0, 10).join(''));
  return result;
};