/*
 * Title: Uptime/Downtime Monitoring Api
 * Description: This is a Uptime/Downtime Monitoring Api built in node.js
 * Author: Faiyaz Rahman
 * Date: 5/25/2021
 */

//Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

//module scaffolding
const app = {};

app.init = () => {
   //start the server
   server.init();
   //start the workers
   workers.init();
};
app.init();

// export the app
module.exports = app;
