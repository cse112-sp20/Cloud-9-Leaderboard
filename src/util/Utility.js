'use strict';
exports.__esModule = true;
exports.generateRandomEmail = exports.getRandomInt = exports.generateRandomName = void 0;
var unique_names_generator_1 = require('unique-names-generator');
function generateRandomName() {
  var randomName = unique_names_generator_1.uniqueNamesGenerator({
    dictionaries: [
      unique_names_generator_1.adjectives,
      unique_names_generator_1.colors,
      unique_names_generator_1.animals,
    ],
  });
  return randomName;
}
exports.generateRandomName = generateRandomName;
function getRandomInt(ceil) {
  return Math.floor(Math.random() * Math.floor(ceil));
}
exports.getRandomInt = getRandomInt;
function generateRandomEmail() {
  var EMAIL_LEN = 28;
  var CHAR_SET =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var email = '';
  while (email.length < EMAIL_LEN) {
    email += CHAR_SET[getRandomInt(CHAR_SET.length)];
  }
  return email + '@cloud9.com';
}
exports.generateRandomEmail = generateRandomEmail;
