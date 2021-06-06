/*
 * Title: Token Handler
 * Description: handler to handle token releated routes
 * Author: Faiyaz Rahman
 * Date: 6/6/2021
 */

const { jsonParse, randomStr, hash } = require('../../helpers/utilities');
const data = require('../../lib/data');

//dependencies

//module scaffolding
const handler = {};

handler.tokenHandler = (requestProps, callback) => {
   const arrayOfMethods = ['get', 'post', 'put', 'delete'];
   if (arrayOfMethods.indexOf(requestProps.method) > -1) {
      handler._token[requestProps.method](requestProps, callback);
   } else {
      callback(405);
   }
};

//private user handler scaffolding
handler._token = {};

handler._token.post = (requestProps, callback) => {
   const phone =
      typeof requestProps.body.phone === 'string' && requestProps.body.phone.trim().length === 11
         ? requestProps.body.phone
         : false;

   const password =
      typeof requestProps.body.password === 'string' && requestProps.body.password.trim().length > 0
         ? requestProps.body.password
         : false;

   if (phone && password) {
      data.read('users', phone, (error, userData) => {
         if (!error) {
            const hashedPassword = hash(password);
            if (hashedPassword === jsonParse(userData).password) {
               const tokenId = randomStr(20);
               const expires = Date.now() + 60 * 60 * 1000;
               const tokenObject = { phone, id: tokenId, expires };

               //create token
               data.create('tokens', tokenId, tokenObject, (error) => {
                  if (!error) {
                     callback(200, tokenObject);
                  } else {
                     callback(500, { error: 'There was an error while creating the token' });
                  }
               });
            } else {
               callback(400, { error: 'Invalid password' });
            }
         } else {
            callback(400, { error: 'No Users found' });
         }
      });
   } else {
      callback(400, {
         error: 'There is a problem with your request',
      });
   }
};
handler._token.get = (requestProps, callback) => {};
handler._token.put = (requestProps, callback) => {};
handler._token.delete = (requestProps, callback) => {};

module.exports = handler;
