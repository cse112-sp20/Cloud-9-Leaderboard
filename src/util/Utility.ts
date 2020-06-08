/**
 * Filename: Utility.ts
 *
 * Contain cloud9 extenion utility function
 *
 * @link   URL
 * @file   This files contains utility function.
 * @author AuthorName.
 */

import {
  uniqueNamesGenerator,
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


