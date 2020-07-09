import { store } from 'store';

export const loaderChange = (bool) => {
  store.dispatch({
    type: 'VISIBLE_CHANGE',
    payload: {
      visible: bool,
    },
  });
};