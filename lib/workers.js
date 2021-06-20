/*
 * Title: workers Initialisation
 * Description: A file where we initialise the workers
 * Author: Faiyaz Rahman
 * Date: 6/20/2021
 */

//Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const { jsonParse } = require('../helpers/utilities');
const data = require('./data');
const { sendSms } = require('../helpers/notifications');

//module scaffolding
const workers = {};

//lookup all the checks from database
workers.gatherAllChecks = () => {
   //get all the checks
   data.list('checks', (error, checks) => {
      if (!error && checks && checks.length > 0) {
         checks.forEach((check) => {
            //read the check data
            data.read('checks', check, (error, checkData) => {
               if (!error && checkData) {
                  //pass the data to the validator
                  const checkDataJson = jsonParse(checkData);
                  workers.validateCheckData(checkDataJson);
               } else {
                  console.log('Error while Reading one of the checks data');
               }
            });
         });
      } else {
         console.log('Could not find any checks to process');
      }
   });
};

//validate indivitual check data
workers.validateCheckData = (checkData) => {
   if (checkData && checkData.id) {
      checkData.state =
         typeof checkData.state === 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down';

      checkData.lastChecked =
         typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

      //pass to the next process
      workers.performCheck(checkData);
   } else {
      console.log('Error: check data was invalid or not found');
   }
};

//perform check
workers.performCheck = (checkData) => {
   //prepare the initial check outcome
   let checkOutCome = {
      error: false,
      responseCode: false,
   };
   //mark the outcome has not been sent yet
   let outcomeSent = false;
   //parse the hostname & full url from checkData
   const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
   const { hostname, path } = parsedUrl;

   //const truct the request
   const requestDetails = {
      protocol: `${checkData.protocol}:`,
      hostname,
      method: checkData.method.toUpperCase(),
      path,
      timeout: checkData.timoutSeconds * 1000,
   };

   const protocolToUse = checkData.protocol === 'http' ? http : https;
   let req = protocolToUse.request(requestDetails, (res) => {
      //grab the status code
      const { statusCode } = res;
      //update the check outcome and pass to the next process
      checkOutCome.responseCode = statusCode;
      if (!outcomeSent) {
         workers.processCheckOutcome(checkData, checkOutCome);
         outcomeSent = true;
      }
   });
   req.on('error', (e) => {
      checkOutCome = {
         error: true,
         value: e,
      };
      if (!outcomeSent) {
         workers.processCheckOutcome(checkData, checkOutCome);
         outcomeSent = true;
      }
   });
   req.on('timeout', (e) => {
      checkOutCome = {
         error: true,
         value: 'timeout',
      };
      if (!outcomeSent) {
         workers.processCheckOutcome(checkData, checkOutCome);
         outcomeSent = true;
      }
   });
   req.end();
};

workers.processCheckOutcome = (checkData, checkOutCome) => {
   //check if outcome is up or down
   let state =
      !checkOutCome.error && checkOutCome.responseCode && checkData.successCodes.indexOf(checkOutCome.responseCode) > -1
         ? 'up'
         : 'down';

   //deicide whether we should alert the user or not
   let alertWanted = checkData.lastChecked && checkData.state !== state ? true : false;

   //update the checkData
   let newCheckData = checkData;
   newCheckData.state = state;
   newCheckData.lastChecked = Date.now();

   //update to the check disk
   data.update('checks', checkData.id, newCheckData, (error) => {
      if (!error) {
         if (alertWanted) {
            //send the check data to next process
            workers.alertUserToStatusChange(newCheckData);
         } else {
            console.log('Alert is not needed as there is no state change');
         }
      } else {
         console.log('Error: trying to save check data of one of the checks');
      }
   });
};

//Send Alert message to users
workers.alertUserToStatusChange = (checkData) => {
   const message = `Alert: Your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${
      checkData.url
   } is currently ${checkData.state}`;
   sendSms(checkData.userPhone, message, (error) => {
      if (!error) {
         console.log(`User was notified a user change via SMS: ${message} `);
      } else {
         console.log('There was a problem sending sms to one of the user');
      }
   });
};

//timer to execute the worker process
workers.loop = () => {
   setInterval(() => workers.gatherAllChecks(), 1000 * 60);
};

// starting the workers
workers.init = () => {
   //execute all the checks
   workers.gatherAllChecks();

   //call the loops so that checks continue
   workers.loop();
};

//export the workers
module.exports = workers;
