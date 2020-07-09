import { getItems, prepareFields, saveItem } from 'actions/Items';
import { getSectionsStructure } from 'core/structures';
import { genHash } from 'actions/App';
export const getSections = () => {
  return new Promise((resolve, reject) => {
    getItems('section')
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveSection = (data) => {
  return new Promise((resolve, reject) => {
    saveItem({...data, type: 'section'});
  })
}

export const generateUniqSection = (name) => {
  let section = getSectionsStructure(name);
  if (section) section = JSON.parse(JSON.stringify(section));
  section.nameUniq = name + '_' + genHash();
  section.fields = prepareFields(section.nameUniq, section.fields, 'sections');
  return section || false;
};
