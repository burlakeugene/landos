import history from 'core/history';
export const goTo = (url) => {
  history.replace(url);
};
