/*
 * Title: Uptime/Downtime Monitoring Api
 * Description: This is a Uptime/Downtime Monitoring Api built in node.js
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

//module scaffolding
const app = {};

//app configuration
app.config = {
   port: 3000,
};

app.createServer = () => {
   const server = http.createServer(app.handleReqRes);
   server.listen(app.config.port, () => {
      console.log(`listening on 127.0.0.1:${app.config.port}`);
   });
};
app.handleReqRes = (req, res) => {
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

// starting the server
app.createServer();
