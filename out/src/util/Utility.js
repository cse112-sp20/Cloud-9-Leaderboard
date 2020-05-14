"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomInt(ceil) {
    return Math.floor(Math.random() * Math.floor(ceil));
}
exports.getRandomInt = getRandomInt;
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