/*
 * Title: Notification Library
 * Description: Functions to notify users
 * Author: Faiyaz Rahman
 * Date: 6/14/2021
 */

//dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./enviroments');

//module scaffolding
const notifications = {};

//send sms to users using twilio api
notifications.sendSms = (phone, message, callback) => {
   //input validation
   const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
   const userMessage =
      typeof message === 'string' && message.trim().length > 0 && message.trim().length <= 1600
         ? message.trim()
         : false;

   if (userPhone && userMessage) {
      //configure the request payload
      const payload = {
         From: twilio.from,
         To: `+88${userPhone}`,
         Body: userMessage,
      };
      //stringify the payload
      const stringPayload = querystring.stringify(payload);

      //configure the https request details
      const requestDetails = {
         hostname: 'api.twilio.com',
         method: 'POST',
         path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
         auth: `${twilio.accountSid}:${twilio.authToken}`,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
      };

      //Instantiate request
      const req = https.request(requestDetails, (res) => {
         //get the status code of sent request
         const { statusCode } = res;

         //success callback if the request worked perfectly
         if (statusCode === 200 || statusCode === 201) {
            callback(false);
         } else {
            callback(`Status code is ${statusCode}`);
         }
      });
      req.on('error', (error) => {
         callback(error);
      });
      req.write(stringPayload);
      req.end();
   } else {
      callback('There are problems with the given parameters');
   }
};

//export
module.exports = notifications;
