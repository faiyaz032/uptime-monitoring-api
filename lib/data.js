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
data.create = function (dir, fileName, data, callback) {
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

data.read = function (dir, fileName, callback) {
   fs.readFile(`${this.baseDir + dir}/${fileName}.json`, 'utf8', (error, data) => {
      callback(error, data);
   });
};

data.update = function (dir, fileName, data, callback) {
   fs.open(`${this.baseDir + dir}/${fileName}.json`, 'r+', (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
         fs.ftruncate(fileDescriptor, (error) => {
            if (!error) {
               //convert data to string
               const stringData = JSON.stringify(data);
               fs.writeFile(fileDescriptor, stringData, (error) => {
                  if (!error) {
                     callback(false);
                  } else {
                     callback('There is error in writing the file');
                  }
               });
            } else {
               callback('There is error in truncating the file');
            }
         });
      } else {
         callback('There is error in opening the file');
      }
   });
};

data.delete = function (dir, fileName, callback) {
   fs.unlink(`${this.baseDir + dir}/${fileName}.json`, (error) => {
      if (!error) {
         callback(false);
      } else {
         callback('There is error in deleting the file');
      }
   });
};

//list all the items in a directory
data.list = function (dir, callback) {
   fs.readdir(`${this.baseDir + dir}/`, (error, fileNames) => {
      if (!error && fileNames && fileNames.length > 0) {
         let trimmedFileNames = [];
         fileNames.forEach((fileName) => {
            trimmedFileNames.push(fileName.replace('.json', ''));
         });
         callback(false, trimmedFileNames);
      } else {
         callback('error reading directory or not files found');
      }
   });
};
module.exports = data;
