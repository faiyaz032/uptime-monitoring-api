/*
 * Title: Handle Request Response
 * Description:  Handle Request Response
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');

const handler = {};

handler.handleReqRes = (req, res) => {
   //parsing requests
   const { pathname, query } = url.parse(req.url, true);
   const path = pathname.replace(/^\/+|\/+$/g, '');
   const method = req.method.toLowerCase();
   const headers = req.headers;

   const decoder = new StringDecoder();
   let data = '';

   req.on('data', (buffer) => {
      data += decoder.write(buffer);
   });
   req.on('end', () => {
      data += decoder.end();
      console.log(data);
      res.end('Hello World');
   });
};

module.exports = handler;
