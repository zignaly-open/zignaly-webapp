import { mergeWith, isArray } from "lodash";

/**
 * Merge with lodash but replace arrays.
 * @param object The destination object.
 * @param sources The source objects.
 * @returns Returns `object`.
 */
export default function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
