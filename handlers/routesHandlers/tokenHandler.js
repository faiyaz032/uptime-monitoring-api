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
handler._token.get = (requestProps, callback) => {
   const id =
      typeof requestProps.query.id === 'string' && requestProps.query.id.trim().length === 20
         ? requestProps.query.id
         : false;

   if (id) {
      data.read('tokens', id, (error, tokenData) => {
         if (!error) {
            const token = { ...jsonParse(tokenData) };
            if (token) {
               callback(200, token);
            }
         } else {
            callback(404, { error: 'Token not found' });
         }
      });
   } else {
      callback(400, { error: 'There is problem in your request' });
   }
};
handler._token.put = (requestProps, callback) => {
   const id =
      typeof requestProps.body.id === 'string' && requestProps.body.id.trim().length === 20
         ? requestProps.body.id
         : false;

   const extend = typeof requestProps.body.extend === 'boolean' && requestProps.body.extend === true ? true : false;

   if (id && extend) {
      data.read('tokens', id, (error, token) => {
         const tokenData = jsonParse(token);
         if (tokenData.expires > Date.now()) {
            tokenData.expires = Date.now() + 60 * 60 * 1000;
            data.update('tokens', id, tokenData, (error) => {
               if (!error) {
                  callback(200);
               } else {
                  callback(500, { error: 'There is a problem in server side' });
               }
            });
         } else {
            callback(400, { error: 'Token already expired' });
         }
      });
   } else {
      callback(400, { error: 'There is a problem in your request' });
   }
};
handler._token.delete = (requestProps, callback) => {
   //check the phone field
   const id =
      typeof requestProps.query.id === 'string' && requestProps.query.id.trim().length === 20
         ? requestProps.query.id
         : false;

   if (id) {
      data.read('tokens', id, (error, tokenData) => {
         if (!error && tokenData) {
            data.delete('tokens', id, (error) => {
               if (!error) {
                  callback(200, { message: 'Token Deleted Successfully' });
               } else {
                  callback(400, { error: 'There is a error in the server side' });
               }
            });
         } else {
            callback(400, { error: 'There is a error in the server side' });
         }
      });
   }
};
handler._token.verify = (id, phone, callback) => {
   data.read('tokens', id, (error, tokenData) => {
      if (!error && tokenData) {
         const tokenObject = jsonParse(tokenData);
         if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
            callback(true);
         } else {
            callback(false);
         }
      } else {
         callback(false);
      }
   });
};

module.exports = handler;
