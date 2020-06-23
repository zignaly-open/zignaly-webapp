import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useFormContext } from "react-hook-form";
import { formatFloat2Dec } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import "./DCAPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} DCAPanelProps
 * @property {MarketSymbol} symbolData
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {DCAPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const DCAPanel = (props) => {
  const { symbolData } = props;
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearError, errors, getValues, register, watch } = useFormContext();
  const {
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
    simulateInputChangeEvent,
  } = useTargetGroup("dca");
  const {
    validateCostLimits,
    validateTargetPriceLimits,
    validateUnitsLimits,
  } = useSymbolLimitsValidate(symbolData);

  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const strategyPositionSize = watch("positionSize");

  /**
   * Calculate the target price and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const draftPosition = getValues();
    const targetId = getGroupTargetId(event);
    const price = parseFloat(draftPosition.price);
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price - (price * targetPricePercentage) / 100;
    validateTargetPriceLimits(
      targetPrice,
      composeTargetPropertyName("targetPricePercentage", targetId),
    );
    rebuyUnitsChange(targetId);
  };

  /**
   * Effects for when rebuy units change.
   *
   * This is not tied to any input due to the fact that this is derived from
   * position size and price.
   *
   * @param {string} targetId Target group ID.
   * @returns {Void} None.
   */
  const rebuyUnitsChange = (targetId) => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize) || 0;
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);
    const price = parseFloat(draftPosition.price);
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * (1 - targetPricePercentage / 100);
    if (rebuyPositionSize > 0) {
      const units = Math.abs(rebuyPositionSize / targetPrice);
      validateUnitsLimits(units, composeTargetPropertyName("rebuyPercentage", targetId));
    }
  };

  /**
   * Calculate the target position size and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const rebuyPercentageChange = (event) => {
    const draftPosition = getValues();
    const targetId = getGroupTargetId(event);
    const positionSize = parseFloat(draftPosition.positionSize) || 0;
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);
    validateCostLimits(rebuyPositionSize, composeTargetPropertyName("rebuyPercentage", targetId));
    rebuyUnitsChange(targetId);
  };

  /**
   * Compose dynamic target property errors.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayTargetFieldErrors = (propertyName, targetId) => {
    const targetProperty = composeTargetPropertyName(propertyName, targetId);
    if (errors[targetProperty]) {
      return <span className="errorText">{errors[targetProperty].message}</span>;
    }

    return null;
  };

  const chainedPriceUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
      const newValue = formatFloat2Dec(Math.abs(currentValue));
      const sign = entryType === "SHORT" ? "-" : "";

      if (currentValue === 0) {
        setTargetPropertyValue("targetPricePercentage", targetId, sign);
      } else {
        setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);
      }

      simulateInputChangeEvent(composeTargetPropertyName("targetPricePercentage", targetId));
    });
  };

  useEffect(chainedPriceUpdates, [entryType, strategyPrice]);

  const chainedUnitsUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      simulateInputChangeEvent(composeTargetPropertyName("rebuyPercentage", targetId));
    });
  };

  useEffect(chainedUnitsUpdates, [strategyPositionSize]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      cardinalityRange.forEach((targetId) => {
        clearError(composeTargetPropertyName("targetPricePercentage", targetId));
        clearError(composeTargetPropertyName("rebuyPercentage", targetId));
      });
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel dcaPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.dca" />
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {cardinalityRange.map((targetId) => (
            <Box className="targetGroup" data-target-id={targetId} key={`target${targetId}`}>
              <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel descriptionId="terminal.dca.help" labelId="terminal.target" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={composeTargetPropertyName("targetPricePercentage", targetId)}
                    onChange={targetPricePercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                {displayTargetFieldErrors("targetPricePercentage", targetId)}
                <HelperLabel descriptionId="terminal.rebuy.help" labelId="terminal.rebuy" />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    inputRef={register}
                    name={composeTargetPropertyName("rebuyPercentage", targetId)}
                    onChange={rebuyPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
              </Box>
              {displayTargetFieldErrors("rebuyPercentage", targetId)}
            </Box>
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

export default React.memo(DCAPanel);
