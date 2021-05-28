/*
 * Title: Routes
 * Description: Apllication Routes file
 * Author: Faiyaz Rahman
 * Date: 5/26/2021
 */

const { sampleHandler } = require('./handlers/routesHandlers/sampleHandler');
const { userHandler } = require('./handlers/routesHandlers/userHandler');

//Dependendicies

const routes = {
   sample: sampleHandler,
   user: userHandler,
};

module.exports = routes;
