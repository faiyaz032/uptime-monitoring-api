/*
 * Title: Data
 * Description: File to handle data
 * Author: Faiyaz Rahman
 * Date: 5/27/2021
 */

//dependencies
const fs = require('fs');
const path = require('path');

//module scaffloding
const data = {};

//base directory of data folder
data.baseDir = path.join(__dirname, '/../.data/');

//write data to file
data.create = function create(dir, fileName, data, callback) {
   //convert data to string
   fs.open(`${this.baseDir + dir}/${fileName}.json`, 'wx', (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
         const stringData = JSON.stringify(data);
         fs.writeFile(fileDescriptor, stringData, (error) => {
            if (!error) {
               fs.close(fileDescriptor, (error) => {
                  if (!error) {
                     callback(false);
                  } else {
                     callback('There is error while closing the file');
                  }
               });
            } else {
               callback('There is a error to write file');
            }
         });
      } else {
         callback(error);
      }
   });
};

module.exports = data;
