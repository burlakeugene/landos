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
  item = clearData(item);
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
  let newFields = [];
  for (let field in fields) {
    if (!fields[field].name) continue;
    let newField = {};
    if (fields[field].value) newField.value = fields[field].value;
    if (fields[field].name) newField.name = fields[field].name;
    if (fields[field].fields)
      newField.fields = getClearFields(fields[field].fields);
    newFields.push(newField);
  }
  return newFields;
};

export const getClearData = (data) => {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      delete data[i].nameUniq;
      data[i].fields = getClearFields(data[i].fields);
    }
  }
  return data;
};

export const clearData = (item) => {
  if (item?.data?.sections) {
    item.data.sections = getClearData(item.data.sections);
  }
  return item;
};

export const mergeFields = (savedFields, structureFields) => {
  console.log(savedFields, structureFields);
  for (let index in structureFields) {
    let savedField = savedFields.find((field) => {
      return field.name === structureFields[index].name;
    });
    if (savedField?.value) structureFields[index].value = savedField.value;
    if (structureFields[index].fields) {
      structureFields[index].fields = mergeFields(
        savedField.fields,
        structureFields[index].fields
      );
    }
  }
  return structureFields;
};

export const mergeWithStructure = (item) => {
  let sectionsStructure = getSectionsStructure();
  if (item?.data?.sections) {
    let newSections = [];
    for (let section in item.data.sections) {
      let currentSection = item.data.sections[section],
        sectionStructure = sectionsStructure.list.find((section) => {
          return section.name === currentSection.name;
        });
      sectionStructure = JSON.parse(JSON.stringify(sectionStructure));
      if (
        sectionsStructure.displayedList.indexOf(currentSection.name) >= 0 &&
        sectionStructure
      ) {
        let newSection = {
          ...currentSection,
          fields: mergeFields(currentSection.fields, sectionStructure.fields),
        };
        newSections.push(generateUniqSection(newSection));
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

export const generateUniqFields = (fields) => {
  for (let field in fields) {
    fields[field]['nameUniq'] = fields[field].name + '_' + generateHash();
    if (fields[field].fields)
      fields[field].fields = generateUniqFields(fields[field].fields);
  }
  return fields;
};

export const generateUniqSection = (section) => {
  section['nameUniq'] = section.name + '_' + generateHash();
  if (section.fields) {
    section.fields = generateUniqFields(section.fields);
  }
  return section;
};
