/*
 * Title: Sample
 * Description: This is sample handler route
 * Author: Faiyaz Rahman
 * Date: 5/26/2021
 */

const handler = {};

handler.sampleHandler = (requestProps, callback) => {
   console.log(requestProps);
   callback(200, {
      message: 'This is a sample url',
   });
};

module.exports = handler;
