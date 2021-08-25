import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { camelCase, range, upperFirst } from "lodash";
import { simulateInputChangeEvent } from "../utils/events";

/**
 * @typedef {Object} TargetGroupHook
 * @property {number} cardinality
 * @property {Array<string>} cardinalityRange
 * @property {function} composeTargetPropertyName
 * @property {function} getGroupTargetId
 * @property {function} getTargetPropertyValue
 * @property {function} getTargetPropertyRawValue
 * @property {React.MouseEventHandler} handleTargetAdd
 * @property {React.MouseEventHandler} handleTargetRemove
 * @property {function} setTargetPropertyValue
 * @property {function} simulateInputChangeEvent
 */

/**
 * Target group multi cardinality panel elements utilities.
 *
 * @param {string} groupName Target group base name, used for fields names composition.
 * @param {number} [defaultCardinality=1] Default cardinality value.
 * @returns {TargetGroupHook} Target group object.
 */
const useTargetGroup = (groupName, defaultCardinality = 1) => {
  const [cardinality, setCardinality] = useState(defaultCardinality);
  const { getValues, setValue } = useFormContext();
  const cardinalityRange = range(1, cardinality + 1, 1).map(String);

  const handleTargetAdd = () => {
    setCardinality(cardinality + 1);
  };

  const handleTargetRemove = () => {
    if (cardinality > 0) {
      setCardinality(cardinality - 1);
    }
  };

  useEffect(() => {
    // If the default cardinality changes, update current value
    // Needed when using "Increase Position Size", which ends up not needing the empty DCA first target group.
    setCardinality(defaultCardinality);
  }, [defaultCardinality]);

  /**
   * Compose dynamic target property name.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {string} Property name for a given target index.
   */
  const composeTargetPropertyName = (propertyName, targetId) => {
    const targetPropertyName = camelCase(groupName) + upperFirst(`${propertyName}${targetId}`);

    return targetPropertyName;
  };

  /**
   * Get parsed target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {number} Target property value.
   */
  function getTargetPropertyValue(propertyName, targetId) {
    const draftPosition = getValues();
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return parseFloat(draftPosition[targetPropertyName]);
  }

  /**
   * Get raw target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {number} Target property value.
   */
  function getTargetPropertyRawValue(propertyName, targetId) {
    const draftPosition = getValues();
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return draftPosition[targetPropertyName];
  }

  /**
   * Set target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @param {string} value Value to set.
   * @returns {Void} None.
   */
  function setTargetPropertyValue(propertyName, targetId, value) {
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return setValue(targetPropertyName, value);
  }

  /**
   * Get target group ID for changed input element event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {string} Target group ID (cardinality);
   */
  function getGroupTargetId(event) {
    const targetElement = event.target;
    const targetGroup = targetElement.closest(".targetGroup");
    const targetId = targetGroup.getAttribute("data-target-id");

    return targetId;
  }

  return {
    cardinality,
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyValue,
    getTargetPropertyRawValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
    simulateInputChangeEvent,
  };
};

export default useTargetGroup;
