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
};
enviroments.production = {
   port: 5000,
   envName: 'production',
   secretKey: 'adsfdfhfbnd',
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const exportEnv = typeof enviroments[currentEnv] === 'object' ? enviroments[currentEnv] : enviroments.staging;

module.exports = exportEnv;
