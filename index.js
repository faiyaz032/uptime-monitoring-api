/*
 * Title: Uptime/Downtime Monitoring Api
 * Description: This is a Uptime/Downtime Monitoring Api built in node.js
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const http = require('http');
const { handleReqRes } = require(`${__dirname}/helpers/handleReqRes`);
const enviroment = require('./helpers/enviroments');
const data = require('./lib/data');
//module scaffolding
const app = {};

data.create('test', 'newFile', { name: 'Faiyaz', age: 18 }, (error) => {
   console.log(error);
});

app.createServer = () => {
   const server = http.createServer(handleReqRes);
   server.listen(enviroment.port, () => {
      console.log(`Enviroment variable is ${enviroment.envName}`);
      console.log(`listening on 127.0.0.1:${enviroment.port}`);
   });
};
app.handleReqRes = (req, res) => {};

// starting the server
app.createServer();
