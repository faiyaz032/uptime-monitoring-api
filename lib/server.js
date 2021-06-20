/*
 * Title: Server Initialisation
 * Description: A file where we initialise the server
 * Author: Faiyaz Rahman
 * Date: 6/20/2021
 */

//Dependencies
const http = require('http');
const { handleReqRes } = require(`../helpers/handleReqRes`);
const enviroment = require('../helpers/enviroments');
//module scaffolding
const server = {};

server.createServer = () => {
   const server = http.createServer(handleReqRes);
   server.listen(enviroment.port, () => {
      console.log(`Enviroment variable is ${enviroment.envName}`);
      console.log(`listening on 127.0.0.1:${enviroment.port}`);
   });
};

// starting the server
server.init = () => {
   server.createServer();
};

//export the server
module.exports = server;
