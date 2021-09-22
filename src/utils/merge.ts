import { mergeWith, isArray } from "lodash";

function mergeCopyArrays(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return srcValue;
  }
}

/**
 * Merge with lodash but replace arrays.
 * @param object The destination object.
 * @param sources The source objects.
 * @returns Returns `object`.
 */
export default (object: Object, other: Object) => mergeWith(object, other, mergeCopyArrays);
