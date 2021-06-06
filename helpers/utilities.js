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

utilities.randomStr = (strLen) => {
   let length = strLen;
   length = typeof strLen === 'number' && strLen > 0 ? strLen : false;
   if (length) {
      const chars = 'abcdefghijklmnopyzx0123456789';
      let output = '';
      for (let i = 0; i < strLen; i += 1) {
         let randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
         output += randomChar;
      }
      return output;
   }
   return false;
};

module.exports = utilities;
