import { store } from 'store';
import Request from 'modules/Request';
import { loaderOn, loaderOff, messagePush } from 'actions/Status';
import { loaderChange } from 'actions/Preloader';
import { historyReplace } from 'actions/App';
import Emitter from 'core/emitter';

export const getItems = (type) => {
  loaderChange(true);
  return new Promise((resolve, reject) => {
    Request.get({
      url: '/items',
      data: {
        type,
      },
    })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        loaderChange(false);
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

export const saveItem = (item) => {
  item = JSON.parse(JSON.stringify(item));
  item = getClearItem(item);
  item.data = JSON.stringify(item);
  item = {
    data: item.data,
    title: item.title,
    type: item.type
  };
  loaderOn();
  let action = item.id ? editItem : addItem;
  return new Promise((resolve, reject) => {
    action(item)
      .then((resp) => {
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

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    Request.post({
      url: '/upload',
      data: {
        file,
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
        historyReplace('/');
        Emitter.emit('listReload', true);
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

export const prepareFields = (parentNameUniq, fields, parentType) => {
  for (let field in fields) {
    fields[field]['parentNameUniq'] = parentNameUniq;
    fields[field]['parentType'] = parentType;
    if (fields[field].fields)
      fields[field].fields = prepareFields(
        parentNameUniq,
        fields[field].fields,
        parentType
      );
  }
  return fields;
};

export const getClearItem = (item) => {
  item.fields = getClearFields(item.fields);
  return item;
};

export const getClearFields = (fields) => {
  let newFields = {};
  for (let field in fields) {
    if (fields[field].fields) {
      newFields = { ...newFields, ...getClearFields(fields[field].fields) };
    } else {
      if (fields[field].name) {
        newFields = {
          ...newFields,
          [fields[field].name]: fields[field].value,
        };
      }
    }
  }
  return newFields;
};