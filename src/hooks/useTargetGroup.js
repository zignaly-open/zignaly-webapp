import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { range } from "lodash";

const useTargetGroup = (defaultCardinality = 1) => {
  const [cardinality, setCardinality] = useState(defaultCardinality);
  const { getValues, setValue } = useFormContext();
  const cardinalityRange = range(1, cardinality + 1, 1);

  const handleTargetAdd = () => {
    setCardinality(cardinality + 1);
  };

  const handleTargetRemove = () => {
    if (cardinality > 0) {
      setCardinality(cardinality - 1);
    }
  };

  /**
   * Compose dynamic target property name.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {string} Property name for a given target index.
   */
  const composeTargetPropertyName = (propertyName, targetId) => {
    const targetPropertyName = `${propertyName}${targetId}`;

    return targetPropertyName;
  };

  /**
   * Get target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {number} Target property value.
   */
  const getTargetPropertyValue = (propertyName, targetId) => {
    const draftPosition = getValues();
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return parseFloat(draftPosition[targetPropertyName]) || 0;
  };

  /**
   * Set target property form state value.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @param {string} value Value to set.
   * @returns {Void} None.
   */
  const setTargetPropertyValue = (propertyName, targetId, value) => {
    const targetPropertyName = composeTargetPropertyName(propertyName, targetId);

    return setValue(targetPropertyName, value);
  };

  /**
   * Get target group ID for changed input element event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {string} Target group ID (cardinality);
   */
  const getGroupTargetId = (event) => {
    const targetElement = event.currentTarget;
    const targetGroup = targetElement.closest(".targetGroup");
    const targetId = targetGroup.getAttribute("data-target-id");

    return targetId;
  };

  /**
   * Progrmatically invoke change event simulation on a given element.
   *
   * @param {String} elementName Element name.
   * @returns {Void} None.
   */
  const simulateInputChangeEvent = (elementName) => {
    const matches = document.getElementsByName(elementName);
    const item = matches[0] || null;

    // @ts-ignore
    if (item && item._valueTracker) {
      // @ts-ignore
      item._valueTracker.setValue("");
      // Programatically invoke change event.
      const event = new Event("input", { bubbles: true });
      item.dispatchEvent(event);
    }
  };

  return {
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
    simulateInputChangeEvent,
  };
};

export default useTargetGroup;
