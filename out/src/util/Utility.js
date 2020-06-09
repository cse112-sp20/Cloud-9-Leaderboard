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
exports.generateRandomName = void 0;
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
//# sourceMappingURL=Utility.js.map