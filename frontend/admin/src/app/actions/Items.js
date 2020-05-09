import Request from 'modules/Request';

export const getItems = () => {
  return new Promise((resolve, reject) => {
    Request.get({
      url: '/items',
    }).then((resp) => {
      resolve(resp);
    });
  });
};
