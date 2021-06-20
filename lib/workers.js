/*
 * Title: workers Initialisation
 * Description: A file where we initialise the workers
 * Author: Faiyaz Rahman
 * Date: 6/20/2021
 */

//Dependencies

//module scaffolding
const workers = {};

workers.createWorkers = () => {
   console.log('worker started');
};

// starting the workers
workers.init = () => {
   workers.createWorkers();
};

//export the workers
module.exports = workers;
