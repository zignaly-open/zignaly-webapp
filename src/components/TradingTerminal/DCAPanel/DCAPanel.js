import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { keys, size } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useFormContext } from "react-hook-form";
import { formatFloat2Dec, revertPercentageRange } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import "./DCAPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} DCAPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {DCAPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const DCAPanel = (props) => {
  const { positionEntity, symbolData } = props;
  const { clearError, errors, getValues, register, setError, watch } = useFormContext();

  /**
   * @typedef {Object} PositionDcaIndexes
   * @property {number} dcaRebuyDoneCount
   * @property {Array<string>} dcaAllIndexes
   * @property {Array<string>} dcaRebuyIndexes
   * @property {Array<string>} dcaIncreaseIndexes
   */

  /**
   * Extract indexes for Rebuys and Increase position DCAs target.
   *
   * Increase positions are tracked as DCAs starting in index 1000:
   *   - Targets from 1 until 999 are reBuys.
   *   - Targets equal or greater than 1000 are increased position.
   *
   * @returns {PositionDcaIndexes} DCA indexes data.
   */
  const resolveDcaIndexes = () => {
    const reBuyTargets = positionEntity ? positionEntity.reBuyTargets : {};
    const dcaAllIndexes = keys(reBuyTargets).map(Number);
    const dcaRebuyIndexes = dcaAllIndexes.filter((index) => index < 1000);
    const dcaIncreaseIndexes = dcaAllIndexes.filter((index) => index >= 1000);
    const dcaRebuyTargets = positionEntity
      ? dcaRebuyIndexes.map((index) => reBuyTargets[index])
      : [];
    const dcaRebuyDoneCount = dcaRebuyTargets.filter((target) => target.done === true).length;

    return {
      dcaRebuyDoneCount,
      dcaAllIndexes: dcaAllIndexes.map(String),
      dcaRebuyIndexes: dcaRebuyIndexes.map(String),
      dcaIncreaseIndexes: dcaIncreaseIndexes.map(String),
    };
  };

  const {
    dcaRebuyDoneCount,
    dcaAllIndexes,
    dcaRebuyIndexes,
    dcaIncreaseIndexes,
  } = resolveDcaIndexes();
  const positionTargetsCardinality = positionEntity ? size(dcaRebuyIndexes) : 1;
  const { expanded, expandClass, expandableControl } = useExpandable(size(dcaAllIndexes) > 0);

  const {
    cardinality,
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
    simulateInputChangeEvent,
  } = useTargetGroup("dca", positionTargetsCardinality);

  const {
    validateCostLimits,
    validateTargetPriceLimits,
    validateUnitsLimits,
  } = useSymbolLimitsValidate(symbolData);

  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isDoneTargetReached = cardinality >= 1 && cardinality - 1 < dcaRebuyDoneCount;
  const disableCardinalityActions = isCopy || isClosed || isDoneTargetReached;
  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const strategyPositionSize = watch("positionSize");

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    dcaAllIndexes.forEach((index) => {
      const target = positionEntity ? positionEntity.reBuyTargets[Number(index)] : { done: false };

      let disabled = false;
      if (target.done) {
        disabled = true;
      } else if (isCopy || isClosed) {
        disabled = true;
      }

      fieldsDisabled[composeTargetPropertyName("rebuyPercentage", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", index)] = disabled;
    });

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  const initValuesFromPositionEntity = () => {
    if (positionEntity) {
      dcaAllIndexes.forEach((index) => {
        const profitTarget = positionEntity.reBuyTargets[Number(index)];
        const triggerPercentage = revertPercentageRange(profitTarget.triggerPercentage);
        const quantityPercentage = revertPercentageRange(profitTarget.quantity);
        setTargetPropertyValue("targetPricePercentage", index, triggerPercentage);
        setTargetPropertyValue("rebuyPercentage", index, quantityPercentage);
      });
    }
  };

  useEffect(initValuesFromPositionEntity, [positionEntity, expanded]);

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

    if (isNaN(targetPricePercentage)) {
      setError(
        composeTargetPropertyName("targetPricePercentage", targetId),
        "error",
        "Rebuy price percentage must be a number.",
      );

      return;
    }

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

    if (isNaN(rebuyPercentage)) {
      setError(
        composeTargetPropertyName("rebuyPercentage", targetId),
        "error",
        "Rebuy percentage must be a number.",
      );

      return;
    }

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

  /**
   * Display DCA target group.
   *
   * @param {string} targetId Target index.
   * @returns {JSX.Element} Target element.
   */
  const displayDcaTarget = (targetId) => {
    return (
      <Box className="targetGroup" data-target-id={targetId} key={`target${targetId}`}>
        <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel descriptionId="terminal.dca.help" labelId="terminal.target" />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              disabled={
                fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)]
              }
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
              disabled={fieldsDisabled[composeTargetPropertyName("rebuyPercentage", targetId)]}
              inputRef={register}
              name={composeTargetPropertyName("rebuyPercentage", targetId)}
              onChange={rebuyPercentageChange}
            />
            <div className="currencyBox">%</div>
          </Box>
        </Box>
        {displayTargetFieldErrors("rebuyPercentage", targetId)}
      </Box>
    );
  };

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
          {cardinalityRange.map((targetId) => displayDcaTarget(targetId))}
          {!disableCardinalityActions && (
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
          )}
          {dcaIncreaseIndexes.map((targetId) => displayDcaTarget(targetId))}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(DCAPanel);
