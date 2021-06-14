/*
 * Title: Enviroment Variables
 * Description: Enviroments for the project
 * Author: Faiyaz Rahman
 * Date: 5/27/2021
 */

//dependencies

//module scaffolding
const enviroments = {};

enviroments.staging = {
   port: 3000,
   envName: 'staging',
   secretKey: 'fghfghosdf',
   maxChecks: 5,
   twilio: {
      from: '+13083652102',
      accountSid: 'AC6546d76c4105817b49800e02490f5f1b',
      authToken: '9b40d4c0ab94092f6ad1299a31a40b64',
   },
};
enviroments.production = {
   port: 5000,
   envName: 'production',
   secretKey: 'adsfdfhfbnd',
   maxChecks: 5,
   twilio: {
      from: '+13083652102',
      accountSid: 'AC6546d76c4105817b49800e02490f5f1b',
      authToken: '9b40d4c0ab94092f6ad1299a31a40b64',
   },
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const exportEnv = typeof enviroments[currentEnv] === 'object' ? enviroments[currentEnv] : enviroments.staging;

module.exports = exportEnv;
