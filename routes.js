/*
 * Title: Routes
 * Description: Apllication Routes file
 * Author: Faiyaz Rahman
 * Date: 5/26/2021
 */

const { sampleHandler } = require('./handlers/routesHandlers/sampleHandler');

//Dependendicies

const routes = {
   sample: sampleHandler,
};

module.exports = routes;
