/*
 * Title: User Handler
 * Description: Handle to handle user requests
 * Author: Faiyaz Rahman
 * Date: 5/28/2021
 */

//dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');

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
handler._user.get = (requestProps, callback) => {};
handler._user.put = (requestProps, callback) => {};
handler._user.delete = (requestProps, callback) => {};

module.exports = handler;
