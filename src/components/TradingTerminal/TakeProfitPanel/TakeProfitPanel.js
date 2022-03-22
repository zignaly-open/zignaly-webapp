import React, { useEffect, useContext } from "react";
import { range, size, sum, values } from "lodash";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { Button, Box, Typography, Switch } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import HelperLabel from "../HelperLabel/HelperLabel";
import ProfitTargetStatus from "../ProfitTargetStatus/ProfitTargetStatus";
import { formatPrice, format2Dec } from "../../../utils/formatters";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import usePositionEntry from "../../../hooks/usePositionEntry";
import useValidation from "../../../hooks/useValidation";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import "./TakeProfitPanel.scss";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import TradingViewContext from "../TradingView/TradingViewContext";
import PostOnlyControl from "../Controls/PostOnlyControl/PostOnlyControl";
import PricePercentageControl from "../Controls/PricePercentageControl";
import CustomNumberInput from "components/Forms/CustomNumberInput";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} TakeProfitPanelProps
 * @property {MarketSymbol} symbolData
 * @property {Position} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {boolean} [isReadOnly] Flag to disable edition.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {TakeProfitPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const TakeProfitPanel = (props) => {
  const { symbolData, positionEntity = null, isReadOnly = false } = props;
  const positionTargetsCardinality = positionEntity ? size(positionEntity.takeProfitTargets) : 0;
  const targetIndexes = range(1, positionTargetsCardinality + 1, 1);
  const { expanded, expandClass, setExpanded } = useExpandable(positionTargetsCardinality > 0);
  const { greaterThan, validPercentage } = useValidation();
  const { validateTargetPriceLimits, validateCostLimits, validateUnitsLimits } =
    useSymbolLimitsValidate(symbolData);

  const {
    clearErrors,
    errors,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { dirtyFields },
  } = useFormContext();
  const defaultCardinality = 1;
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
  } = useTargetGroup(
    "takeProfit",
    positionEntity ? Math.max(defaultCardinality, positionTargetsCardinality) : defaultCardinality,
  );

  // Other panels watched variables to react on changes.
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const strategyUnits = watch("units");
  const { providerService } = useContext(TradingViewContext);
  const isCopyProvider =
    (providerService && providerService.providerId !== "1") ||
    (positionEntity && positionEntity.isCopyTrader);

  const { getEntryPrice, getEntrySize } = usePositionEntry(positionEntity);
  const targetsDone = positionEntity ? positionEntity.takeProfitTargetsCountSuccess : 0;
  const isTargetLocked = positionEntity ? cardinality === targetsDone : false;
  const disableRemoveAction = isReadOnly || isTargetLocked;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const { formatMessage } = useIntl();

  /**
   * Check if target inputs should be disabled.
   * @param {string} targetId Target id.
   * @returns {boolean} .
   */
  const isDisabled = (targetId) => {
    const target = positionEntity ? positionEntity.takeProfitTargets[parseInt(targetId)] : null;
    return (target && target.done) || isReadOnly;
  };

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
      fieldsDisabled[composeTargetPropertyName("postOnly", index)] = disabled;
    });

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();
  const profitTargets = positionEntity ? positionEntity.takeProfitTargets : {};

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

    if (errors[pricePercentageProperty]) return;

    let targetPrice = price * ((targetPercentage + 100) / 100);
    setValue(priceProperty, formatPrice(targetPrice, "", ""));
    trigger(priceProperty);
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
    const priceProperty = composeTargetPropertyName("targetPrice", targetId);

    if (errors[priceProperty]) return;

    const priceDiff = targetPrice - price;
    const targetPercentage = (priceDiff / price) * 100;
    setValue(pricePercentageProperty, format2Dec(targetPercentage));

    trigger(pricePercentageProperty);
  };

  /**
   * Validate cumulative targets percentage.
   *
   * @returns {boolean|string} true if validation passed, error message otherwise.
   */
  const validateCumulativePercentage = () => {
    const exitUnitsPercentageFields = cardinalityRange.map((targetId) =>
      composeTargetPropertyName("exitUnitsPercentage", targetId),
    );
    const exitUnitsPercentages = getValues(exitUnitsPercentageFields);
    const cumulativePercentage = sum(values(exitUnitsPercentages).map(Number));
    if (cumulativePercentage > 100) {
      return formatMessage({
        id: "terminal.takeprofit.limit.cumulative",
      });
    }
    return true;
  };

  /**
   * Validate unit cost limits.
   *
   * @param {string} targetId targetId
   * @returns {boolean|string} true if validation passed, error message otherwise.
   */
  const validateUnitCostLimits = (targetId) => {
    const targetPrice = getTargetPropertyValue("targetPrice", targetId);
    const exitUnits = getTargetPropertyValue("exitUnits", targetId);
    const cost = Math.abs(targetPrice * exitUnits);
    return validateCostLimits(cost, "terminal.takeprofit.limit");
  };

  /**
   * Calculate units based on units percentage change for a given target.
   *
   * @param {string} targetId targetId
   * @return {Void} None.
   */
  const exitUnitsPercentageChange = (targetId) => {
    const units = getEntrySize();
    const unitsProperty = composeTargetPropertyName("exitUnits", targetId);
    const exitUnitsPercentageProperty = composeTargetPropertyName("exitUnitsPercentage", targetId);
    const unitsPercentage = getTargetPropertyValue("exitUnitsPercentage", targetId);

    if (errors[exitUnitsPercentageProperty]) return;

    const targetUnits = units * (unitsPercentage / 100);
    setValue(unitsProperty, formatPrice(targetUnits, "", ""));
    // Trigger validation unless change caused by initialization
    if (dirtyFields[exitUnitsPercentageProperty]) {
      trigger(unitsProperty);
    }
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
    const exitUnitsProperty = composeTargetPropertyName("exitUnits", targetId);
    if (errors[exitUnitsProperty]) return;

    if (units > 0 && exitUnits > 0) {
      const unitsDiff = units - exitUnits;
      const unitsPercentage = (1 - unitsDiff / units) * 100;
      setValue(unitsPercentageProperty, format2Dec(unitsPercentage));
    } else {
      setValue(unitsPercentageProperty, "");
    }
  };

  const initValuesFromPosition = () => {
    if (positionEntity) {
      targetIndexes.forEach((index) => {
        // Initialization: populate with position targets values
        const profitTarget = positionEntity.takeProfitTargets[index];
        const priceTargetPercentage = format2Dec(profitTarget.priceTargetPercentage);
        const priceTarget = formatPrice(profitTarget.priceTarget, "", "");
        const amountPercentage = format2Dec(profitTarget.amountPercentage);
        setTargetPropertyValue("targetPricePercentage", index, priceTargetPercentage);
        setTargetPropertyValue("targetPrice", index, priceTarget);
        setTargetPropertyValue("priority", index, profitTarget.pricePriority);
        setTargetPropertyValue("exitUnitsPercentage", index, amountPercentage);
        setTargetPropertyValue("postOnly", index, profitTarget.postOnly);
      });
    }
  };

  useEffect(() => {
    if (expanded) {
      if (positionEntity) {
        initValuesFromPosition();
      } else {
        chainedPriceUpdates();
      }
    } else {
      cardinalityRange.forEach((targetId) => {
        clearErrors(composeTargetPropertyName("exitUnitsPercentage", targetId));
        clearErrors(composeTargetPropertyName("exitUnits", targetId));
        clearErrors(composeTargetPropertyName("targetPrice", targetId));
        clearErrors(composeTargetPropertyName("targetPricePercentage", targetId));
        setValue(composeTargetPropertyName("targetPrice", targetId), "");
      });
    }
  }, [expanded]);

  const chainedPriceUpdates = () => {
    if (!expanded) return;

    // Apply correct sign depending on entry type (Short/Long)
    cardinalityRange.forEach((targetId) => {
      const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
      const newValue = format2Dec(Math.abs(currentValue));
      const sign = entryType === "SHORT" ? "-" : "";

      if (isNaN(currentValue)) {
        setTargetPropertyValue("targetPricePercentage", targetId, sign);
      } else {
        setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);

        // Trigger target price/percentage calculation
        const priorityName = composeTargetPropertyName("priority", targetId);
        const val = getValues();
        if (val[priorityName] !== "price") {
          simulateInputChangeEvent(composeTargetPropertyName("targetPricePercentage", targetId));
        } else {
          simulateInputChangeEvent(composeTargetPropertyName("targetPrice", targetId));
        }
      }
    });
  };

  useEffectSkipFirst(chainedPriceUpdates, [entryType, strategyPrice]);

  const chainedUnitsUpdates = () => {
    if (expanded) {
      cardinalityRange.forEach((targetId) => {
        // Trigger units amount calculation
        exitUnitsPercentageChange(targetId);
      });
    }
  };

  const entrySize = getEntrySize();
  useEffect(chainedUnitsUpdates, [expanded, strategyUnits, entrySize]);

  // Automatically expand/collpase panel depending on position current tps amount.
  const autoExpandCollapse = () => {
    setExpanded(Boolean(positionTargetsCardinality));
  };
  useEffect(autoExpandCollapse, [positionTargetsCardinality]);

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

  /**
   * Validate target percentage limits.
   *
   * @param {string} value targetPricePercentage
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateTargetPricePercentage = (value) => {
    let valid = greaterThan(
      parseFloat(value),
      0,
      entryType,
      "terminal.takeprofit.valid.pricepercentage",
      { value: 0 },
    );
    return valid;
  };

  return (
    <Box className={`panel takeProfitPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && (
          <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
        )}
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
              <Box className="targetPrice">
                <PricePercentageControl
                  disabled={isDisabled(targetId)}
                  labelDescriptionId="terminal.takeprofit.help"
                  labelId="terminal.target"
                  percentage={{
                    name: composeTargetPropertyName("targetPricePercentage", targetId),
                    validate: validateTargetPricePercentage,
                    onChange: targetPricePercentageChange,
                    allowNegative: true,
                  }}
                  price={{
                    name: composeTargetPropertyName("targetPrice", targetId),
                    onChange: targetPriceChange,
                    validate: (value) =>
                      validateTargetPriceLimits(value, "terminal.takeprofit.limit"),
                  }}
                  priorityName={composeTargetPropertyName("priority", targetId)}
                  quote={symbolData.quote}
                  status={
                    <ProfitTargetStatus
                      labelId="terminal.status"
                      profitTarget={profitTargets[Number(targetId)] || null}
                    />
                  }
                />
              </Box>
              <Box className="targetUnits" display="flex" flexDirection="row" flexWrap="wrap">
                <HelperLabel
                  descriptionId="terminal.unitstoexit.help"
                  labelId="terminal.unitstoexit"
                />
                <Box alignItems="center" display="flex">
                  <CustomNumberInput
                    disabled={isDisabled(targetId)}
                    name={composeTargetPropertyName("exitUnitsPercentage", targetId)}
                    onChange={() => exitUnitsPercentageChange(targetId)}
                    rules={
                      fieldsDisabled[composeTargetPropertyName("exitUnitsPercentage", targetId)]
                        ? null
                        : {
                            validate: {
                              percentage: (value) =>
                                validPercentage(value, "terminal.takeprofit.valid.unitspercentage"),
                              sum: validateCumulativePercentage,
                            },
                          }
                    }
                    showErrorMessage={false}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                {!isCopyProvider && (
                  <>
                    <Box alignItems="center" display="flex">
                      <CustomNumberInput
                        disabled={isDisabled(targetId)}
                        name={composeTargetPropertyName("exitUnits", targetId)}
                        onChange={exitUnitsChange}
                        rules={
                          fieldsDisabled[composeTargetPropertyName("exitUnits", targetId)]
                            ? null
                            : {
                                validate: {
                                  positive: (value) =>
                                    value >= 0 ||
                                    formatMessage({
                                      id: "terminal.takeprofit.valid.units",
                                    }),
                                  limit: (value) =>
                                    validateUnitsLimits(value, "terminal.takeprofit.limit"),
                                  cost: () => validateUnitCostLimits(targetId),
                                },
                              }
                        }
                        showErrorMessage={false}
                      />
                      <div className="currencyBox">{symbolData.unitsAmount}</div>
                    </Box>
                  </>
                )}
                {displayTargetFieldErrors("exitUnitsPercentage", targetId)}
                {!isCopyProvider && displayTargetFieldErrors("exitUnits", targetId)}
              </Box>
              <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
                <PostOnlyControl
                  disabled={isDisabled(targetId)}
                  exchange={positionEntity?.exchange}
                  name={composeTargetPropertyName("postOnly", targetId)}
                />
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
