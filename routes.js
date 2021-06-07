/*
 * Title: Routes
 * Description: Apllication Routes file
 * Author: Faiyaz Rahman
 * Date: 5/26/2021
 */

const { sampleHandler } = require('./handlers/routesHandlers/sampleHandler');
const { tokenHandler } = require('./handlers/routesHandlers/tokenHandler');
const { userHandler } = require('./handlers/routesHandlers/userHandler');
const { checkHandler } = require('./handlers/routesHandlers/checkHandler');

//Dependendicies

const routes = {
   sample: sampleHandler,
   user: userHandler,
   token: tokenHandler,
   check: checkHandler,
};

module.exports = routes;
