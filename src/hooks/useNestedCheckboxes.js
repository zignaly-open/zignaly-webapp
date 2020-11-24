import { useEffect } from "react";

/**
 * @typedef {import("react-hook-form").UseFormMethods<Record<string, any>>} FormMethods
 */

/**
 * Automatically check a parent or children checkboxes
 *
 * @param {string} parentName Parent Checkbox
 * @param {Array<string>} childrenNames Children Checkboxes
 * @param {FormMethods} formMethods Form methods
 * @param {*} options Options
 * @returns {void}
 */
const useNestedCheckboxes = (parentName, childrenNames, formMethods, options) => {
  const { setValue, watch } = formMethods;

  const parent = watch(parentName, options[parentName]);
  /** @type {*} */
  const defaultSettings = {};
  childrenNames.forEach((c) => {
    defaultSettings[c] = parent && options[c];
  });
  const children = watch(childrenNames, defaultSettings);

  const atLeastOneChecked = () => Object.values(children).some((v) => v);
  const allUnchecked = () => Object.values(children).every((v) => !v);

  useEffect(() => {
    // Check parent checkbox when at least one child checked
    setValue(parentName, atLeastOneChecked());
  }, Object.values(children));

  useEffect(() => {
    if (!parent) {
      // Uncheck all children when parent unchecked
      Object.keys(children).forEach((c) => {
        setValue(c, false);
      });
    } else if (allUnchecked()) {
      // Check first child when parent checked and all children unchecked
      setValue(childrenNames[0], true);
      setValue(parentName, true);
    }
  }, [parent]);
};

export default useNestedCheckboxes;
