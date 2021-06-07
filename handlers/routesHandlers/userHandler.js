/*
 * Title: User Handler
 * Description: Handle to handle user requests
 * Author: Faiyaz Rahman
 * Date: 5/28/2021
 */

//dependencies
const data = require('../../lib/data');
const { hash, jsonParse } = require('../../helpers/utilities');
const { _token } = require('./tokenHandler');

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

handler._user.post = (requestProps, callback) => {
   const firstName =
      typeof requestProps.body.firstName === 'string' && requestProps.body.firstName.trim().length > 0
         ? requestProps.body.firstName
         : false;

   const lastName =
      typeof requestProps.body.lastName === 'string' && requestProps.body.lastName.trim().length > 0
         ? requestProps.body.lastName
         : false;

   const phone =
      typeof requestProps.body.phone === 'string' && requestProps.body.phone.trim().length === 11
         ? requestProps.body.phone
         : false;

   const password =
      typeof requestProps.body.password === 'string' && requestProps.body.password.trim().length > 0
         ? requestProps.body.password
         : false;

   const tosAgreement =
      typeof requestProps.body.tosAgreement === 'boolean' && requestProps.body.tosAgreement
         ? requestProps.body.tosAgreement
         : false;

   if (firstName && lastName && phone && password && tosAgreement) {
      //check if file exists already
      data.read('users', phone, (error, user) => {
         if (error) {
            let userObject = {
               firstName,
               lastName,
               phone,
               password: hash(password),
               tosAgreement,
            };
            data.create('users', phone, userObject, (error) => {
               if (!error) {
                  callback(200, { message: 'User created successfully' });
               } else {
                  callback(500, { error: 'Could not create user' });
               }
            });
         } else callback(500, { error: 'There was a error in the serverside' });
      });
   } else {
      callback(400, {
         error: 'There is a problem in your request',
      });
   }
};
handler._user.get = (requestProps, callback) => {
   //check if phone number is valid
   const phone =
      typeof requestProps.query.phone === 'string' && requestProps.query.phone.trim().length === 11
         ? requestProps.query.phone
         : false;
   if (phone) {
      //verify token
      const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;

      _token.verify(token, phone, (tokenId) => {
         if (tokenId) {
            data.read('users', phone, (error, user) => {
               const userJson = { ...jsonParse(user) };
               if (!error && user) {
                  delete userJson.password;
                  callback(200, userJson);
               } else {
                  callback(404, {
                     error: 'Requested user was not found',
                  });
               }
            });
         } else {
            callback(403, { error: 'Authentication failure' });
         }
      });
   } else {
      callback(404, {
         error: 'Requested user was not found',
      });
   }
};
handler._user.put = (requestProps, callback) => {
   //checking the fields
   const firstName =
      typeof requestProps.body.firstName === 'string' && requestProps.body.firstName.trim().length > 0
         ? requestProps.body.firstName
         : false;

   const lastName =
      typeof requestProps.body.lastName === 'string' && requestProps.body.lastName.trim().length > 0
         ? requestProps.body.lastName
         : false;

   const phone =
      typeof requestProps.body.phone === 'string' && requestProps.body.phone.trim().length === 11
         ? requestProps.body.phone
         : false;

   const password =
      typeof requestProps.body.password === 'string' && requestProps.body.password.trim().length > 0
         ? requestProps.body.password
         : false;

   if (phone) {
      if (firstName || lastName || password) {
         //verify token
         const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;

         _token.verify(token, phone, (tokenId) => {
            if (tokenId) {
               console.log(tokenId);
               data.read('users', phone, (error, user) => {
                  const userData = { ...jsonParse(user) };
                  if (!error && user) {
                     if (firstName) {
                        userData.firstName = firstName;
                     }
                     if (lastName) {
                        userData.lastName = lastName;
                     }
                     if (password) {
                        userData.password = hash(password);
                     }
                     data.update('users', phone, userData, (error) => {
                        if (!error) {
                           callback(200, {
                              message: 'User updated Successfully',
                           });
                        } else {
                           callback(500, { error: 'There was a problem in the server side' });
                        }
                     });
                  } else {
                     callback('There is a problem in your request');
                  }
               });
            } else {
               callback(403, { error: 'Authentication failure' });
            }
         });
      } else {
         callback('There is a problem in your request');
      }
   } else {
      callback('There is a problem with your phone number');
   }
};
handler._user.delete = (requestProps, callback) => {
   //check the phone field
   const phone =
      typeof requestProps.query.phone === 'string' && requestProps.query.phone.trim().length === 11
         ? requestProps.query.phone
         : false;

   if (phone) {
      //verify token
      const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;
      _token.verify(token, phone, (tokenId) => {
         if (tokenId) {
            data.read('users', phone, (error, userData) => {
               if (!error && userData) {
                  data.delete('users', phone, (error) => {
                     if (!error) {
                        callback(200, { message: 'User Deleted Successfully' });
                     } else {
                        callback(400, { error: 'There is a error in the server side 1' });
                     }
                  });
               } else {
                  callback(400, { error: 'There is a error in the server side 2' });
               }
            });
         } else {
            callback(403, { error: 'Authentication failure' });
         }
      });
   }
};

module.exports = handler;
