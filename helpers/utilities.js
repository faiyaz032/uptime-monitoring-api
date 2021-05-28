/*
 * Title: Utilities
 * Description: Utilities helpers function for the project
 * Author: Faiyaz Rahman
 * Date: 5/28/2021
 */

//dependencies
const crypto = require('crypto');
const enviroments = require('./enviroments');
const utilities = {};

utilities.jsonParse = (jsonStr) => {
   let output;

   try {
      output = JSON.parse(jsonStr);
   } catch {
      output = {};
   }
   return output;
};

utilities.hash = (str) => {
   if (typeof str === 'string' && str.length > 0) {
      let hash = crypto.Hmac('sha256', enviroments.secretKey).update(str).digest('hex');
      return hash;
   } else {
      return false;
   }
};

module.exports = utilities;
