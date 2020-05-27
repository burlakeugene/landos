import { store } from 'store';
import Request from 'modules/Request';
import { loaderOn, loaderOff, messagePush } from 'actions/Status';
import { historyReplace } from 'actions/App';
import { getSectionsStructure } from 'core/structures';
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
      if (resp.data) resp.data = JSON.parse(resp.data);
      resp = mergeWithStructure(resp);
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
  item = JSON.parse(JSON.stringify(item));
  item = getClearData(item);
  if (item.data) item.data = JSON.stringify(item.data);
  loaderOn();
  let action = item.id ? editItem : addItem;
  return new Promise((resolve, reject) => {
    action(item)
      .then((resp) => {
        historyReplace('/');
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

export const getClearFields = (fields) => {
  let newFields = {};
  for (let field in fields) {
    if (fields[field].fields) {
      newFields = { ...newFields, ...getClearFields(fields[field].fields) };
    } else {
      if (fields[field].name) {
        newFields = {
          ...newFields,
          [fields[field].name]: {
            name: fields[field].name,
            value: fields[field].value,
          },
        };
      }
    }
  }
  return newFields;
};

export const getClearData = (item) => {
  if (item?.data?.sections) {
    for (let i = 0; i < item.data.sections.length; i++) {
      item.data.sections[i].fields = getClearFields(item.data.sections[i].fields);
    }
  }
  return item;
};

export const mergeFields = (saved, structure) => {
  for (let index in structure.fields) {
    structure.fields[index].sectionNameUniq = saved.nameUniq;
    if(saved.fields[structure.fields[index].name]){
      structure.fields[index].value = saved.fields[structure.fields[index].name].value;
    }
    if (structure.fields[index].fields) {
      structure.fields[index].fields = mergeFields(
        saved,
        structure.fields[index]
      );
    }
  }
  return structure.fields;
};

export const mergeWithStructure = (item) => {
  let sectionsStructure = getSectionsStructure();
  if (item?.data?.sections) {
    let newSections = [];
    for (let section in item.data.sections) {
      let currentSection = item.data.sections[section],
        sectionStructure = getSectionsStructure(currentSection.name);
      if(sectionStructure){
        sectionStructure = JSON.parse(JSON.stringify(sectionStructure));
        let newSection = {
          ...currentSection,
          fields: mergeFields(currentSection, sectionStructure),
        };
        newSections.push(newSection);
      }
    }
    item.data.sections = newSections;
  }
  return item;
};

export const generateHash = () => {
  let rand = window.Math.floor(window.Math.random() * 0x10000000000000),
    result;
  (rand = rand.toString(16).substring(1)),
    (result = rand.split('').splice(0, 10).join(''));
  return result;
};

export const prepareFields = (sectionNameUniq, fields) => {
  for (let field in fields) {
    fields[field]['sectionNameUniq'] = sectionNameUniq;
    if (fields[field].fields)
      fields[field].fields = prepareFields(
        sectionNameUniq,
        fields[field].fields
      );
  }
  return fields;
};

export const generateUniqSection = (name) => {
  let section = getSectionsStructure(name);
  section.nameUniq = name + '_' + generateHash();
  section.fields = prepareFields(section.nameUniq, section.fields);
  return section || false;
};
