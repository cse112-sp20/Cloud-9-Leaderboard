"use strict";
/**
 * Filename: Utility.ts
 *
 * Contain cloud9 extenion utility function
 *
 * @link   URL
 * @file   This files contains utility function.
 * @author AuthorName.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomEmail = exports.getRandomInt = exports.generateRandomName = void 0;
const unique_names_generator_1 = require("unique-names-generator");
/**
 * Random anonymous name generator
 */
function generateRandomName() {
    const randomName = unique_names_generator_1.uniqueNamesGenerator({
        dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.colors, unique_names_generator_1.animals],
    });
    return randomName;
}
exports.generateRandomName = generateRandomName;
/**
 * Random integer generator
 * @param ceil the max value of the random number
 */
function getRandomInt(ceil) {
    return Math.floor(Math.random() * Math.floor(ceil));
}
exports.getRandomInt = getRandomInt;
/**
 * Random email generator
 */
function generateRandomEmail() {
    const EMAIL_LEN = 28;
    const CHAR_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let email = "";
    while (email.length < EMAIL_LEN) {
        email += CHAR_SET[getRandomInt(CHAR_SET.length)];
    }
    return email + "@cloud9.com";
}
exports.generateRandomEmail = generateRandomEmail;
//# sourceMappingURL=Utility.js.map