/*
 * Title: Handle Request Response
 * Description:  Handle Request Response
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routesHandlers/notFoundHandler');

const handler = {};

handler.handleReqRes = (req, res) => {
   //parsing requests
   const { pathname, query } = url.parse(req.url, true);
   const path = pathname.replace(/^\/+|\/+$/g, '');
   const method = req.method.toLowerCase();
   const headers = req.headers;

   const requestProps = { pathname, query, path, method, headers };

   const decoder = new StringDecoder('utf-8');

   let data = '';

   const selectedHandler = routes[path] ? routes[path] : notFoundHandler;

   req.on('data', (buffer) => {
      data += decoder.write(buffer);
   });
   req.on('end', () => {
      data += decoder.end();
      selectedHandler(requestProps, (statusCode, payload) => {
         statusCode = typeof statusCode === 'number' ? statusCode : 500;
         payload = typeof payload === 'object' ? payload : {};

         const payloadString = JSON.stringify(payload);
         res.writeHead(statusCode);
         res.end(payloadString);
      });
   });
};

module.exports = handler;
