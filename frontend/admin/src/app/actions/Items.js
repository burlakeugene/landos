import { store } from 'store';
import Request from 'modules/Request';
import { loaderOn, loaderOff, messagePush } from 'actions/Status';
import { goTo } from 'actions/App';
import Emitter from 'core/emitter';
export const getItems = () => {
  return new Promise((resolve, reject) => {
    Request.get({
      url: '/items',
    }).then((resp) => {
      resolve(resp);
    });
  });
};

export const getItem = (id) => {
  return new Promise((resolve, reject) => {
    Request.get({
      url: '/item/' + id,
    }).then((resp) => {
      resolve(resp);
    });
  });
};

export const editItem = (item) => {
  return new Promise((resolve, reject) => {
    Request.post({
      url: '/item/edit',
      data: {
        item,
      },
    })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const addItem = (item) => {
  return new Promise((resolve, reject) => {
    Request.post({
      url: '/item/add',
      data: {
        item,
      },
    })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveItem = (item) => {
  loaderOn();
  let action = item.id ? editItem : addItem;
  return new Promise((resolve, reject) => {
    action(item)
      .then((resp) => {
        goTo('/');
        messagePush({
          type: 'success',
          message: resp,
          delay: 3000,
        });
        resolve(resp);
      })
      .catch((error) => {
        messagePush({
          type: 'error',
          message: error,
          delay: 3000,
        });
        reject(error);
      })
      .finally(() => {
        loaderOff();
      });
  });
};

export const setRemovingItem = (id) => {
  store.dispatch({
    type: 'REMOVING_CHANGE',
    payload: {
      id,
    },
  });
};

export const removeItem = (id) => {
  loaderOn();
  return new Promise((resolve, reject) => {
    Request.post({
      url: '/item/remove',
      data: {
        id,
      },
    })
      .then((resp) => {
        goTo('/');
        Emitter.emit('listReload');
        messagePush({
          type: 'success',
          message: resp,
          delay: 3000,
        });
        resolve(resp);
      })
      .catch((error) => {
        messagePush({
          type: 'error',
          message: error,
          delay: 3000,
        });
        reject(error);
      })
      .finally(() => {
        loaderOff();
      });
  });
};

export const saveItems = (items) => {
  loaderOn();
  return new Promise((resolve, reject) => {
    Request.post({
      url: '/items',
      data: {
        items,
      },
    })
      .then((message) => {
        messagePush({
          type: 'success',
          message: message,
          delay: 3000,
        });
        resolve(message);
      })
      .catch((error) => {
        messagePush({
          type: 'error',
          message: error,
          delay: 3000,
        });
        reject(error);
      })
      .finally(() => {
        loaderOff();
      });
  });
};
