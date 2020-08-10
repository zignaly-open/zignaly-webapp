import React, { useEffect } from "react";
import { inRange, lt, gt, isNumber, keys, range, size, sum, values } from "lodash";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { Button, Box, OutlinedInput, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import HelperLabel from "../HelperLabel/HelperLabel";
import ProfitTargetStatus from "../ProfitTargetStatus/ProfitTargetStatus";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { isValidIntOrFloat } from "../../../utils/validators";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./TakeProfitPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} TakeProfitPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {TakeProfitPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const TakeProfitPanel = (props) => {
  const { symbolData, positionEntity = null } = props;
  const positionTargetsCardinality = positionEntity ? size(positionEntity.takeProfitTargets) : 0;
  const targetIndexes = range(1, positionTargetsCardinality + 1, 1);
  const { expanded, expandClass, expandableControl } = useExpandable(
    positionTargetsCardinality > 0,
  );

  const { clearErrors, errors, register, setError, setValue, watch } = useFormContext();
  const defaultCardinality = 1;
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
    simulateInputChangeEvent,
  } = useTargetGroup(
    "takeProfit",
    positionEntity ? positionTargetsCardinality : defaultCardinality,
  );

  // Other panels watched variables to react on changes.
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const strategyUnits = watch("units");

  const { limits } = symbolData;
  const { getEntryPrice, getEntrySize } = usePositionEntry(positionEntity);
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const targetsDone = positionEntity ? positionEntity.takeProfitTargetsCountSuccess : 0;
  const isTargetLocked = positionEntity ? cardinality === targetsDone : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;
  const disableRemoveAction = isReadOnly || isTargetLocked;
  const { formatMessage } = useIntl();

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    targetIndexes.forEach((index) => {
      const target = positionEntity ? positionEntity.takeProfitTargets[index] : { done: false };

      let disabled = false;
      if (target.done) {
        disabled = true;
      } else if (isReadOnly || isClosed) {
        disabled = true;
      }

      fieldsDisabled[composeTargetPropertyName("exitUnitsPercentage", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("exitUnits", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPrice", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", index)] = disabled;
    });

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();
  const profitTargets = positionEntity ? positionEntity.takeProfitTargets : {};

  /**
   * Validate result of changed target units event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const validateExitUnits = (event) => {
    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

    clearErrors(unitsPercentageProperty);
    if (exitUnits <= 0) {
      setError(unitsPercentageProperty, {
        type: "manual",
        message: formatMessage({ id: "terminal.takeprofit.limit.zero" }),
      });

      return false;
    }

    if (!validateTargetExitUnitsLimits(targetId)) {
      return false;
    }

    if (!validateCostLimits(targetId)) {
      return false;
    }

    return true;
  };

  /**
   * Validate target percentage limits.
   *
   * @param {string} targetId Take profit target ID.
   * @returns {boolean} true if validation pass, false otherwise.
   */
  function validateTargetPercentageLimits(targetId) {
    const targetPercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPercentageRaw = getTargetPropertyRawValue("targetPricePercentage", targetId);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    const valueType = entryType === "LONG" ? "greater" : "lower";
    const compareFn = entryType === "LONG" ? lt : gt;

    if (!isValidIntOrFloat(targetPercentageRaw) || compareFn(targetPercentage, 0)) {
      setError(pricePercentageProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.valid.pricepercentage" },
          { type: valueType },
        ),
      });

      return false;
    }

    return true;
  }

  /**
   * Calculate price based on percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPricePercentageChange = (event) => {
    const price = getEntryPrice();
    const targetId = getGroupTargetId(event);
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    let targetPrice = price;

    if (!validateTargetPercentageLimits(targetId)) {
      setValue(priceProperty, "");
      return;
    }

    if (targetPercentage !== 0) {
      targetPrice = price * ((targetPercentage + 100) / 100);
    }

    if (isNumber(targetPercentage)) {
      setValue(priceProperty, formatPrice(targetPrice, "", ""));
    } else {
      setValue(priceProperty, "");
    }

    if (validateTargetPriceLimits(targetId)) {
      clearErrors(priceProperty);
    }

    clearErrors(pricePercentageProperty);
  };

  /**
   * Calculate percentage based on price change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const targetPriceChange = (event) => {
    const price = getEntryPrice();
    const targetId = getGroupTargetId(event);
    const pricePercentageProperty = composeTargetPropertyName("targetPricePercentage", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);
    const targetPriceRaw = getTargetPropertyRawValue("targetPrice", targetId);
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);

    if (!isValidIntOrFloat(targetPriceRaw)) {
      setError(priceProperty, {
        type: "manual",
        message: formatMessage({ id: "terminal.takeprofit.valid.price" }),
      });
      setValue(pricePercentageProperty, "");
      return;
    }

    if (!isNaN(targetPrice) && targetPrice !== 0) {
      const priceDiff = targetPrice - price;
      const targetPercentage = (priceDiff / price) * 100;
      setValue(pricePercentageProperty, formatFloat2Dec(targetPercentage));

      if (validateTargetPercentageLimits(targetId)) {
        clearErrors(pricePercentageProperty);
      }
    } else {
      setValue(pricePercentageProperty, "");
    }

    if (validateTargetPriceLimits(targetId)) {
      clearErrors(priceProperty);
    }
  };

  const exitUnitsPercentageFields = cardinalityRange.map((targetId) =>
    composeTargetPropertyName("exitUnitsPercentage", targetId),
  );
  const exitUnitsPercentages = watch(exitUnitsPercentageFields);

  /**
   * Validate cumulative targets percentage.
   *
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const validateCumulativePercentage = () => {
    const cumulativePercentage = sum(values(exitUnitsPercentages).map(Number));
    const propertyNames = keys(exitUnitsPercentages);
    if (cumulativePercentage > 100) {
      propertyNames.map((unitsPercentageProperty) => {
        setError(unitsPercentageProperty, {
          type: "manual",
          message: formatMessage({ id: "terminal.takeprofit.limit.cumulative" }),
        });
      });

      return false;
    }

    propertyNames.map((unitsPercentageProperty) => {
      clearErrors(unitsPercentageProperty);
    });

    return true;
  };

  /**
   * Calculate units based on units percentage change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsPercentageChange = (event) => {
    const units = getEntrySize();
    const targetId = getGroupTargetId(event);
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const unitsPercentage = getTargetPropertyValue("exitUnitsPercentage", targetId);
    const unitsPercentageRaw = getTargetPropertyRawValue("exitUnitsPercentage", targetId);

    if (!isValidIntOrFloat(unitsPercentageRaw) || !inRange(unitsPercentage, 0, 100.0001)) {
      setError(composeTargetPropertyName("exitUnitsPercentage", targetId), {
        type: "manual",
        message: formatMessage({ id: "terminal.takeprofit.valid.unitspercentage" }),
      });

      setValue(unitsProperty, "");
      return;
    }

    if (unitsPercentage > 0) {
      const targetUnits = units * (unitsPercentage / 100);
      setValue(unitsProperty, formatPrice(targetUnits, "", ""));
    } else {
      setValue(unitsProperty, "");
    }

    if (!validateExitUnits(event)) {
      return;
    }

    if (!validateCumulativePercentage()) {
      return;
    }

    clearErrors(unitsProperty);
  };

  /**
   * Calculate units percentage based on units change for a given target.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @return {Void} None.
   */
  const exitUnitsChange = (event) => {
    const units = getEntrySize();
    const targetId = getGroupTargetId(event);
    const unitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const exitUnitsRaw = getTargetPropertyRawValue("exitUnits", targetId);

    if (!isValidIntOrFloat(exitUnitsRaw) || exitUnits <= 0) {
      setError(composeTargetPropertyName("exitUnits", targetId), {
        type: "manual",
        message: formatMessage({ id: "terminal.takeprofit.valid.units" }),
      });

      setValue(unitsPercentageProperty, "");
      return;
    }

    if (units > 0 && exitUnits > 0) {
      const unitsDiff = units - exitUnits;
      const unitsPercentage = (1 - unitsDiff / units) * 100;
      setValue(unitsPercentageProperty, formatFloat2Dec(unitsPercentage));
    } else {
      setValue(unitsPercentageProperty, "");
    }

    validateExitUnits(event);
  };

  /**
   * Validate that target price is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const validateTargetPriceLimits = (targetId) => {
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);

    if (limits.price.min && targetPrice < limits.price.min) {
      setError(priceProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.minprice" },
          { value: limits.price.min },
        ),
      });

      return false;
    }

    if (limits.price.max && targetPrice > limits.price.max) {
      setError(priceProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.maxprice" },
          { value: limits.price.max },
        ),
      });

      return false;
    }

    validateCostLimits(targetId);

    return true;
  };

  /**
   * Validate that cost is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const validateCostLimits = (targetId) => {
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const cost = Math.abs(targetPrice * exitUnits);

    if (limits.cost.min && cost > 0 && cost < limits.cost.min) {
      setError(unitsProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.mincost" },
          { value: limits.cost.min },
        ),
      });

      return false;
    }

    if (limits.cost.max && cost > 0 && cost > limits.cost.max) {
      setError(unitsProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.maxcost" },
          { value: limits.cost.max },
        ),
      });

      return false;
    }

    return true;
  };

  /**
   * Validate that target units is within limits.
   *
   * @param {string} targetId Target index ID.
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const validateTargetExitUnitsLimits = (targetId) => {
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);

    clearErrors(unitsProperty);
    if (limits.amount.min && exitUnits < limits.amount.min) {
      setError(unitsProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.minunits" },
          { value: limits.amount.min },
        ),
      });

      return false;
    }

    if (limits.amount.max && exitUnits > limits.amount.max) {
      setError(unitsProperty, {
        type: "manual",
        message: formatMessage(
          { id: "terminal.takeprofit.limit.maxunits" },
          { value: limits.amount.max },
        ),
      });

      return false;
    }

    return true;
  };

  const initValuesFromPositionEntity = () => {
    if (positionEntity) {
      targetIndexes.forEach((index) => {
        const profitTarget = positionEntity.takeProfitTargets[index];
        const priceTargetPercentage = formatFloat2Dec(profitTarget.priceTargetPercentage);
        const amountPercentage = formatFloat2Dec(profitTarget.amountPercentage);
        setTargetPropertyValue("targetPricePercentage", index, priceTargetPercentage);
        setTargetPropertyValue("exitUnitsPercentage", index, amountPercentage);
      });
    }
  };

  const chainedPriceUpdates = () => {
    initValuesFromPositionEntity();
    cardinalityRange.forEach((targetId) => {
      const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
      const newValue = formatFloat2Dec(Math.abs(currentValue));
      const sign = entryType === "SHORT" ? "-" : "";

      if (isNaN(currentValue)) {
        setTargetPropertyValue("targetPricePercentage", targetId, sign);
      } else {
        setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);
      }

      if (expanded) {
        simulateInputChangeEvent(composeTargetPropertyName("targetPricePercentage", targetId));
      }
    });
  };

  useEffect(chainedPriceUpdates, [expanded, positionEntity, entryType, cardinality, strategyPrice]);

  const chainedUnitsUpdates = () => {
    cardinalityRange.forEach((targetId) => {
      if (expanded) {
        simulateInputChangeEvent(composeTargetPropertyName("exitUnitsPercentage", targetId));
      }
    });
  };

  useEffect(chainedUnitsUpdates, [expanded, strategyUnits]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      cardinalityRange.forEach((targetId) => {
        clearErrors(composeTargetPropertyName("exitUnitsPercentage", targetId));
        clearErrors(composeTargetPropertyName("exitUnits", targetId));
        clearErrors(composeTargetPropertyName("targetPrice", targetId));
        clearErrors(composeTargetPropertyName("targetPricePercentage", targetId));
        setValue(composeTargetPropertyName("targetPrice", targetId), "");
      });
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

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

  return (
    <Box className={`panel takeProfitPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.takeprofit" />
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
                <HelperLabel descriptionId="terminal.takeprofit.help" labelId="terminal.target" />
                <ProfitTargetStatus
                  labelId="terminal.status"
                  profitTarget={profitTargets[Number(targetId)] || null}
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
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={fieldsDisabled[composeTargetPropertyName("targetPrice", targetId)]}
                    inputRef={register}
                    name={composeTargetPropertyName("targetPrice", targetId)}
                    onChange={targetPriceChange}
                  />
                  <div className="currencyBox">{symbolData.quote}</div>
                </Box>
              </Box>
              {displayTargetFieldErrors("targetPricePercentage", targetId)}
              {displayTargetFieldErrors("targetPrice", targetId)}
              <Box className="targetUnits" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel
                  descriptionId="terminal.unitstoexit.help"
                  labelId="terminal.unitstoexit"
                />
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={
                      fieldsDisabled[composeTargetPropertyName("exitUnitsPercentage", targetId)]
                    }
                    inputRef={register}
                    name={composeTargetPropertyName("exitUnitsPercentage", targetId)}
                    onChange={exitUnitsPercentageChange}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box alignItems="center" display="flex">
                  <OutlinedInput
                    className="outlineInput"
                    disabled={fieldsDisabled[composeTargetPropertyName("exitUnits", targetId)]}
                    inputRef={register}
                    name={composeTargetPropertyName("exitUnits", targetId)}
                    onChange={exitUnitsChange}
                  />
                  <div className="currencyBox">{symbolData.base}</div>
                </Box>
                {displayTargetFieldErrors("exitUnitsPercentage", targetId)}
                {displayTargetFieldErrors("exitUnits", targetId)}
              </Box>
            </Box>
          ))}
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
        </Box>
      )}
    </Box>
  );
};

export default React.memo(TakeProfitPanel);
