/*
 * Title: Not Found Handler
 * Description: This is not found handler route
 * Author: Faiyaz Rahman
 * Date: 5/26/2021
 */

const handler = {};

handler.notFoundHandler = (requestProps, callback) => {
   callback(404, {
      message: 'You Request URL was not found',
   });
};

module.exports = handler;
