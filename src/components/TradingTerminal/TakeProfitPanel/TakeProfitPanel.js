import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../HelperLabel/HelperLabel";
import { OutlinedInput } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Button, Box, Switch, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { range, sum } from "lodash";
import "./TakeProfitPanel.scss";

const TakeProfitPanel = (props) => {
  const { symbolData, lastPriceCandle } = props;
  const defaultExpand = true;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { errors, getValues, register, clearError, setError, setValue, watch } = useFormContext();
  const [cardinality, setCardinality] = useState(1);
  const cardinalityRange = range(1, cardinality + 1, 1);
  const entryType = watch("entryType");

  /**
   * Handle toggle switch action.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Click event.
   * @returns {Void} None.
   */
  const handleToggle = (event) => {
    const targetElement = event.currentTarget;
    setExpand(targetElement.checked);
  };

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
   * Validate result of changed target units event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const validateExitUnits = (event) => {
    const draftPosition = getValues();
    const allUnitsPercentage = cardinalityRange.map((index) => {
      const targetProperty = composeTargetPropertyName("exitUnitsPercentage", String(index));
      return parseFloat(draftPosition[targetProperty]) || 0;
    });

    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const allUnitsPercentageTotal = sum(allUnitsPercentage);

    clearError(unitsPercentageProperty);
    if (exitUnits <= 0) {
      setError(unitsPercentageProperty, "error", "Units must be greater than zero.");
    } else if (allUnitsPercentageTotal > 100) {
      setError(
        unitsPercentageProperty,
        "error",
        "Total units (cumulative) cannot be greater than 100%.",
      );
    }
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
   * Calculate price based on percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const targetId = getGroupTargetId(event);
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPercentage = getTargetPropertyValue("targetPricePercentage", targetId) || 100;
    const targetPrice = price * ((targetPercentage + 100) / 100);

    setValue(priceProperty, targetPrice);
  };

  /**
   * Calculate percentage based on price change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPriceChange = (event) => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const targetId = getGroupTargetId(event);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    const priceDiff = getTargetPropertyValue("priceProperty", targetId) - price;
    const targetPercentage = (priceDiff / price) * 100;

    setValue(pricePercentageProperty, targetPercentage || 0);
  };

  /**
   * Calculate units based on units percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsPercentageChange = (event) => {
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units) || 0;
    const targetId = getGroupTargetId(event);
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const unitsPercentage = getTargetPropertyValue("exitUnitsPercentage", targetId);

    if (unitsPercentage > 0) {
      const targetUnits = units * (unitsPercentage / 100);
      setValue(unitsProperty, targetUnits);
    } else {
      setValue(unitsProperty, "");
    }

    validateExitUnits(event);
  };

  /**
   * Calculate units percentage based on units change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsChange = (event) => {
    const draftPosition = getValues();
    const units = parseFloat(draftPosition.units) || 0;
    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

    if (units > 0 && exitUnits > 0) {
      const unitsDiff = units - exitUnits;
      const unitsPercentage = (1 - unitsDiff / units) * 100;
      setValue(unitsPercentageProperty, unitsPercentage);
    } else {
      setValue(unitsPercentageProperty, "");
    }

    validateExitUnits(event);
  };

  useEffect(() => {
    cardinalityRange.forEach((index) => {});
    console.log("Entry type changed: ", entryType);
  }, [entryType]);

  return (
    <Box className={`strategyPanel takeProfitPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch onChange={handleToggle} size="small" />
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.takeprofit" />
          </Typography>
        </Box>
      </Box>
      {expand && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {cardinalityRange.map((index) => (
            <FormControl className="targetGroup" data-target-id={index} key={`target${index}`}>
              <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel descriptionId="terminal.takeprofit.help" labelId="terminal.target" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`targetPricePercentage${index}`}
                    onChange={targetPricePercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`targetPrice${index}`}
                    onChange={targetPriceChange}
                  />
                  <div className="currencyBox">{symbolData.quote}</div>
                </Box>
              </Box>
              <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel
                  descriptionId="terminal.unitstoexit.help"
                  labelId="terminal.unitstoexit"
                />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`exitUnitsPercentage${index}`}
                    onChange={exitUnitsPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={`exitUnits${index}`}
                    onChange={exitUnitsChange}
                  />
                  <div className="currencyBox">{symbolData.base}</div>
                </Box>
                {errors[`exitUnitsPercentage${index}`] && (
                  <span className="errorText">{errors[`exitUnitsPercentage${index}`].message}</span>
                )}
              </Box>
            </FormControl>
          ))}
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            <Button className="removeTarget" onClick={handleTargetRemove}>
              <RemoveCircle />
              <FormattedMessage id="terminal.target.remove" />
            </Button>
            <Button className="addTarget" onClick={handleTargetAdd}>
              <AddCircle />
              <FormattedMessage id="terminal.target.add" />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TakeProfitPanel;
