/*
 * Title: User Handler
 * Description: Handle to handle user requests
 * Author: Faiyaz Rahman
 * Date: 5/28/2021
 */

const handler = {};

handler.userHandler = (requestProps, callback) => {
   const arrayOfMethods = ['get', 'post', 'put', 'delete'];
   if (arrayOfMethods.indexOf(requestProps.method) > -1) {
      handler._user[requestProps.method](requestProps, callback);
   } else {
      callback(405);
   }
};

//private user handler scaffolding
handler._user = {};

handler._user.post = (requestProps, callback) => {};
handler._user.get = (requestProps, callback) => {};
handler._user.put = (requestProps, callback) => {};
handler._user.delete = (requestProps, callback) => {};

module.exports = handler;
