/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 * @since  x.x.x
 */

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

/**
 * Random anonymous name generator
 */
export function generateRandomName() {
  const randomName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  return randomName;
}

/**
 * Random integer generator
 * @param ceil the max value of the random number
 */
export function getRandomInt(ceil) {
  return Math.floor(Math.random() * Math.floor(ceil));
}

/**
 * Random email generator
 */
export function generateRandomEmail() {
  const EMAIL_LEN = 28;
  const CHAR_SET =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let email = "";
  while (email.length < EMAIL_LEN) {
    email += CHAR_SET[getRandomInt(CHAR_SET.length)];
  }
  return email + "@cloud9.com";
}
