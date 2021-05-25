/*
 * Title: Uptime/Downtime Monitoring Api
 * Description: This is a Uptime/Downtime Monitoring Api built in node.js
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const http = require('http');

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
   res.end('Hello Programmers');
};

// starting the server
app.createServer();
