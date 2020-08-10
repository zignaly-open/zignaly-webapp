import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { lt, gt, isEqual, keys, size } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useFormContext } from "react-hook-form";
import { formatFloat2Dec } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import { calculateDcaPrice } from "../../../utils/calculations";
import DCATargetStatus from "../DCATargetStatus/DCATargetStatus";
import usePositionEntry from "../../../hooks/usePositionEntry";
import { isValidIntOrFloat } from "../../../utils/validators";
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
  const { clearErrors, errors, register, setError, setValue, watch } = useFormContext();
  const rebuyTargets = positionEntity ? positionEntity.reBuyTargets : {};
  const { getEntryPrice, getEntrySizeQuote } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();

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
    const dcaAllIndexes = keys(rebuyTargets).map(Number);
    const dcaRebuyIndexes = dcaAllIndexes.filter((index) => index < 1000);
    const dcaIncreaseIndexes = dcaAllIndexes.filter((index) => index >= 1000);
    const dcaRebuyTargets = positionEntity
      ? dcaRebuyIndexes.map((index) => rebuyTargets[index])
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
  const [activeDcaIncreaseIndexes, setActiveDCAIncreaseIndexes] = useState(dcaIncreaseIndexes);
  const positionTargetsCardinality = positionEntity ? size(dcaRebuyIndexes) : 1;
  const { expanded, expandClass, expandableControl } = useExpandable(size(dcaAllIndexes) > 0);

  const {
    cardinality,
    cardinalityRange,
    composeTargetPropertyName,
    getGroupTargetId,
    getTargetPropertyRawValue,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
  } = useTargetGroup("dca", positionTargetsCardinality);

  const {
    validateCostLimits,
    validateTargetPriceLimits,
    validateUnitsLimits,
  } = useSymbolLimitsValidate(symbolData);

  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isDoneTargetReached = cardinality >= 1 && cardinality - 1 < dcaRebuyDoneCount;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;
  const disableRemoveAction = isReadOnly || isDoneTargetReached || cardinality === 0;
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const strategyPositionSize = watch("positionSize");

  /**
   * Handle DCA increase remove.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Button click event.
   * @returns {Void} None.
   */
  const handleDcaIncreaseRemove = (event) => {
    const targetElement = event.currentTarget;
    const targetId = targetElement.getAttribute("data-target-id");
    const newDcaIncreaseIndexes = activeDcaIncreaseIndexes.filter((value) => value !== targetId);
    setActiveDCAIncreaseIndexes(newDcaIncreaseIndexes);
  };

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    dcaAllIndexes.forEach((index) => {
      let disabled = false;
      if (positionEntity) {
        const target = positionEntity.reBuyTargets[Number(index)];
        if (target.done || target.skipped) {
          disabled = true;
        } else if (isReadOnly) {
          disabled = true;
        }
      }

      fieldsDisabled[composeTargetPropertyName("rebuyPercentage", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", index)] = disabled;
    });

    return fieldsDisabled;
  };

  /**
   * Perform price percentage validations.
   *
   * @param {string} targetId Target group ID.
   * @returns {Void} None.
   */
  const pricePercentageValidations = (targetId) => {
    const price = getEntryPrice();
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPricePercentageRaw = getTargetPropertyRawValue("targetPricePercentage", targetId);
    const targetPrice = calculateDcaPrice(price, targetPricePercentage);
    const valueType = entryType === "LONG" ? "lower" : "greater";
    const compareFn = entryType === "LONG" ? gt : lt;

    if (!isValidIntOrFloat(targetPricePercentageRaw) || compareFn(targetPricePercentage, 0)) {
      setError(composeTargetPropertyName("targetPricePercentage", targetId), {
        type: "manual",
        message: formatMessage({ id: "terminal.dca.valid.pricepercentage" }, { type: valueType }),
      });

      return;
    }

    if (
      !validateTargetPriceLimits(
        targetPrice,
        composeTargetPropertyName("targetPricePercentage", targetId),
        "terminal.dca.limit",
      )
    ) {
      return;
    }

    // Only perform validation if no other active errors exists for this property.
    const rebuyPercentageProperty = composeTargetPropertyName("rebuyPercentage", targetId);
    if (!errors[rebuyPercentageProperty]) {
      if (!rebuyUnitsChange(targetId)) {
        return;
      }
    }

    // All validations passed clear errors.
    clearErrors(composeTargetPropertyName("targetPricePercentage", targetId));
  };

  /**
   * Calculate the target price and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const targetId = getGroupTargetId(event);
    pricePercentageValidations(targetId);
  };

  /**
   * Effects for when rebuy units change.
   *
   * This is not tied to any input due to the fact that this is derived from
   * position size and price.
   *
   * @param {string} targetId Target group ID.
   * @returns {boolean} true if validation pass, false otherwise.
   */
  const rebuyUnitsChange = (targetId) => {
    const positionSize = getEntrySizeQuote();
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);
    const price = getEntryPrice();
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * (1 - targetPricePercentage / 100);
    const rebuyPercentageProperty = composeTargetPropertyName("rebuyPercentage", targetId);

    const units = Math.abs(rebuyPositionSize / targetPrice);
    if (positionSize > 0) {
      return validateUnitsLimits(units, rebuyPercentageProperty, "terminal.dca.limit");
    }

    return true;
  };

  /**
   * Perform rebuy percentage validations.
   *
   * @param {string} targetId Target group ID.
   * @returns {Void} None.
   */
  const rebuyPercentageValidations = (targetId) => {
    const positionSize = getEntrySizeQuote();
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPercentageRaw = getTargetPropertyRawValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);

    if (!isValidIntOrFloat(rebuyPercentageRaw) || rebuyPercentage <= 0) {
      setError(composeTargetPropertyName("rebuyPercentage", targetId), {
        type: "manual",
        message: formatMessage({ id: "terminal.dca.valid.unitspercentage" }),
      });

      return;
    }

    if (!rebuyUnitsChange(targetId)) {
      return;
    }

    if (
      positionSize > 0 &&
      !validateCostLimits(
        rebuyPositionSize,
        composeTargetPropertyName("rebuyPercentage", targetId),
        "terminal.dca.limit",
      )
    ) {
      return;
    }

    // All validations passed clear errors.
    clearErrors(composeTargetPropertyName("rebuyPercentage", targetId));
  };

  /**
   * Calculate the target position size and trigger validation.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const rebuyPercentageChange = (event) => {
    const targetId = getGroupTargetId(event);
    rebuyPercentageValidations(targetId);
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

  const initValuesFromPositionEntity = () => {
    if (positionEntity) {
      // Sync any DCA increase update with local state.
      if (!isEqual(activeDcaIncreaseIndexes, dcaIncreaseIndexes)) {
        setActiveDCAIncreaseIndexes(dcaIncreaseIndexes);
      }

      dcaAllIndexes.forEach((index) => {
        const profitTarget = positionEntity.reBuyTargets[Number(index)];
        const triggerPercentage = formatFloat2Dec(profitTarget.triggerPercentage);
        const quantityPercentage = formatFloat2Dec(profitTarget.quantity);
        setTargetPropertyValue("targetPricePercentage", index, triggerPercentage);
        setTargetPropertyValue("rebuyPercentage", index, quantityPercentage);
      });
    }
  };

  const chainedPriceUpdates = () => {
    initValuesFromPositionEntity();
    if (expanded) {
      cardinalityRange.forEach((targetId) => {
        const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
        const newValue = formatFloat2Dec(Math.abs(currentValue));
        const sign = entryType === "LONG" ? "-" : "";

        if (isNaN(currentValue)) {
          setTargetPropertyValue("targetPricePercentage", targetId, sign);
        } else {
          setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);
          pricePercentageValidations(targetId);
        }
      });
    }
  };

  useEffect(chainedPriceUpdates, [expanded, cardinality, positionEntity, entryType, strategyPrice]);

  const chainedUnitsUpdates = () => {
    if (expanded && cardinality > 0) {
      rebuyPercentageValidations("1");
    }
  };

  useEffect(chainedUnitsUpdates, [expanded, strategyPositionSize]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      cardinalityRange.forEach((targetId) => {
        clearErrors(composeTargetPropertyName("targetPricePercentage", targetId));
        clearErrors(composeTargetPropertyName("rebuyPercentage", targetId));
        setValue(composeTargetPropertyName("targetPricePercentage", targetId), "");
      });
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);
  const fieldsDisabled = getFieldsDisabledStatus();

  /**
   * Display DCA target group.
   *
   * @param {string} targetId Target index.
   * @returns {JSX.Element} Target element.
   */
  const displayDcaTarget = (targetId) => {
    // Not disabled and DCA within increment index range.
    const index = parseInt(targetId);
    const showRemove =
      !fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)] &&
      index >= 1000;
    return (
      <Box className="targetGroup" data-target-id={targetId} key={`target${targetId}`}>
        <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel descriptionId="terminal.dca.help" labelId="terminal.target" />
          <DCATargetStatus
            dcaTarget={rebuyTargets[Number(targetId)] || null}
            labelId="terminal.status"
          />
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
        {showRemove && (
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            <Button
              className="removeTarget"
              data-target-id={index}
              onClick={handleDcaIncreaseRemove}
            >
              <RemoveCircle />
              <FormattedMessage id="terminal.target.remove" />
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className={`panel dcaPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && expandableControl}
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
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            {!disableRemoveAction && (
              <Button className="removeTarget" onClick={handleTargetRemove}>
                <RemoveCircle />
                <FormattedMessage id="terminal.target.remove" />
              </Button>
            )}
            {!isReadOnly && (
              <Button className="addTarget" onClick={handleTargetAdd}>
                <AddCircle />
                <FormattedMessage id="terminal.target.add" />
              </Button>
            )}
          </Box>
          {activeDcaIncreaseIndexes.map((targetId) => displayDcaTarget(targetId))}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(DCAPanel);
