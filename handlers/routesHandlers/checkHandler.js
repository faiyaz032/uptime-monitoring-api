/*
 * Title: Check Handler
 * Description: Handler to handle check requests
 * Author: Faiyaz Rahman
 * Date: 6/7/2021
 */

//dependencies
const data = require('../../lib/data');
const { hash, jsonParse, randomStr } = require('../../helpers/utilities');
const { _token } = require('./tokenHandler');
const { maxChecks } = require('../../helpers/enviroments');

const handler = {};

handler.checkHandler = (requestProps, callback) => {
   const arrayOfMethods = ['get', 'post', 'put', 'delete'];
   if (arrayOfMethods.indexOf(requestProps.method) > -1) {
      handler._check[requestProps.method](requestProps, callback);
   } else {
      callback(405);
   }
};

//private user handler scaffolding
handler._check = {};

handler._check.post = (requestProps, callback) => {
   //validate inputs
   const protocol =
      typeof requestProps.body.protocol === 'string' && ['http', 'https'].indexOf(requestProps.body.protocol) > -1
         ? requestProps.body.protocol
         : false;

   const url =
      typeof requestProps.body.url === 'string' && requestProps.body.url.trim().length > 0
         ? requestProps.body.url
         : false;

   const method =
      typeof requestProps.body.method === 'string' &&
      ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProps.body.method) > -1
         ? requestProps.body.method
         : false;

   const successCodes =
      typeof requestProps.body.successCodes === 'object' && requestProps.body.successCodes instanceof Array
         ? requestProps.body.successCodes
         : false;

   const timoutSeconds =
      typeof requestProps.body.timoutSeconds === 'number' &&
      requestProps.body.timoutSeconds % 1 === 0 &&
      requestProps.body.timoutSeconds >= 1 &&
      requestProps.body.timoutSeconds <= 5
         ? requestProps.body.timoutSeconds
         : false;

   if (protocol && url && method && successCodes && timoutSeconds) {
      const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;
      //lookup the user phone by using the token
      data.read('tokens', token, (error, tokenData) => {
         if (!error) {
            const userPhone = jsonParse(tokenData).phone;
            //lookup the users
            data.read('users', userPhone, (error, userData) => {
               if (!error && userData) {
                  _token.verify(token, userPhone, (validToken) => {
                     if (validToken) {
                        const userObject = jsonParse(userData);
                        const userChecks =
                           typeof userObject.checks === 'object' && userObject.checks instanceof Array
                              ? userObject.checks
                              : [];

                        if (userChecks.length <= maxChecks) {
                           const checkId = randomStr(20);
                           const checkObject = {
                              id: checkId,
                              userPhone,
                              protocol,
                              url,
                              method,
                              successCodes,
                              timoutSeconds,
                           };
                           //store the object
                           data.create('checks', checkId, checkObject, (error) => {
                              if (!error) {
                                 //add checkid to the users object
                                 userObject.checks = userChecks;
                                 userObject.checks.push(checkId);
                                 //save the new user data
                                 data.update('users', userPhone, userObject, (error) => {
                                    if (!error) {
                                       callback(200, checkObject);
                                    } else {
                                       callback(500, { error: 'There was a problem in the server side' });
                                    }
                                 });
                              } else {
                                 callback(500, { error: 'There was a problem in the server side' });
                              }
                           });
                        } else {
                           callback(401, { error: 'User has already reached max check limit' });
                        }
                     } else {
                        callback(403, { error: 'Token is not valid' });
                     }
                  });
               } else {
                  callback(403, { error: 'User Not Found' });
               }
            });
         } else {
            callback(403, { error: 'Authentication Problem' });
         }
      });
   } else {
      callback(400, { error: 'You have a problem in your inputs' });
   }
};
handler._check.get = (requestProps, callback) => {
   const id =
      typeof requestProps.query.id === 'string' && requestProps.query.id.trim().length === 20
         ? requestProps.query.id
         : false;

   if (id) {
      data.read('checks', id, (error, checkData) => {
         const checkObject = jsonParse(checkData);
         //verify token
         const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;
         _token.verify(token, checkObject.userPhone, (validToken) => {
            if (validToken) {
               callback(200, checkObject);
            } else {
               callback(400, { error: 'Your token is not valid' });
            }
         });
      });
   } else {
      callback(400, { error: 'There is a problem in your request' });
   }
};
handler._check.put = (requestProps, callback) => {
   const id =
      typeof requestProps.body.id === 'string' && requestProps.body.id.trim().length === 20
         ? requestProps.body.id
         : false;

   //validate inputs
   const protocol =
      typeof requestProps.body.protocol === 'string' && ['http', 'https'].indexOf(requestProps.body.protocol) > -1
         ? requestProps.body.protocol
         : false;

   const url =
      typeof requestProps.body.url === 'string' && requestProps.body.url.trim().length > 0
         ? requestProps.body.url
         : false;

   const method =
      typeof requestProps.body.method === 'string' &&
      ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProps.body.method) > -1
         ? requestProps.body.method
         : false;

   const successCodes =
      typeof requestProps.body.successCodes === 'object' && requestProps.body.successCodes instanceof Array
         ? requestProps.body.successCodes
         : false;

   const timoutSeconds =
      typeof requestProps.body.timoutSeconds === 'number' &&
      requestProps.body.timoutSeconds % 1 === 0 &&
      requestProps.body.timoutSeconds >= 1 &&
      requestProps.body.timoutSeconds <= 5
         ? requestProps.body.timoutSeconds
         : false;

   if (id) {
      if (protocol || url || method || successCodes || timoutSeconds) {
         data.read('checks', id, (error, checkData) => {
            if (!error && checkData) {
               const checkObj = jsonParse(checkData);
               const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;

               _token.verify(token, checkObj.userPhone, (validToken) => {
                  if (validToken) {
                     if (protocol) {
                        checkObj.protocol = protocol;
                     }
                     if (url) {
                        checkObj.url = url;
                     }
                     if (method) {
                        checkObj.method = method;
                     }
                     if (successCodes) {
                        checkObj.successCodes = successCodes;
                     }
                     if (timoutSeconds) {
                        checkObj.timoutSeconds = timoutSeconds;
                     }
                     data.update('checks', id, checkObj, (error) => {
                        if (!error) {
                           callback(200, { success: 'Check Update Successfully' });
                        } else {
                           callback(500, { error: 'There was a serverside Error' });
                        }
                     });
                  } else {
                     callback(403, { error: 'Authentication error/Invalid Token' });
                  }
               });
            } else {
               callback(500, { error: 'There was a server side error reading the checks' });
            }
         });
      } else {
         callback(400, { error: 'You must provide atleast one field to update' });
      }
   } else {
      callback(400, { error: 'Problem in your request' });
   }
};
handler._check.delete = (requestProps, callback) => {
   const id =
      typeof requestProps.query.id === 'string' && requestProps.query.id.trim().length === 20
         ? requestProps.query.id
         : false;

   if (id) {
      data.read('checks', id, (error, checkData) => {
         const checkObject = jsonParse(checkData);
         //verify token
         const token = typeof requestProps.headers.token === 'string' ? requestProps.headers.token : false;
         _token.verify(token, checkObject.userPhone, (validToken) => {
            if (validToken) {
               //delete the check data
               data.delete('checks', id, (error) => {
                  if (!error) {
                     data.read('users', checkObject.userPhone, (error, userData) => {
                        if (!error && userData) {
                           const userObj = jsonParse(userData);
                           let userChecks =
                              typeof userObj.checks === 'object' && userObj.checks instanceof Array
                                 ? userObj.checks
                                 : [];

                           //remove the deleted check id form user list of checks
                           const checkPosition = userChecks.indexOf(id);
                           if (checkPosition > -1) {
                              userChecks.splice(checkPosition, 1);

                              //resave the user data
                              userObj.checks = userChecks;
                              //update the user
                              data.update('users', userObj.phone, userObj, (error) => {
                                 if (!error) {
                                    callback(200, { success: 'Check Deleted Successfully' });
                                 } else {
                                    callback(500, { error: 'There is a serverside error' });
                                 }
                              });
                           } else {
                              callback(500, {
                                 error: 'The check id that you are trying to remove is not found in user',
                              });
                           }
                        } else {
                           callback(500, { error: 'There is a server side error / reading the user data' });
                        }
                     });
                  } else {
                     callback(500, { error: 'There is a server side error' });
                  }
               });
            } else {
               callback(400, { error: 'Your token is not valid' });
            }
         });
      });
   } else {
      callback(400, { error: 'There is a problem in your request' });
   }
};

module.exports = handler;
