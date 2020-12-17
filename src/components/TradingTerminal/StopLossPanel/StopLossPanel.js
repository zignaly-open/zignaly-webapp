import React, { useEffect, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { isNumber } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography, Switch } from "@material-ui/core";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { useFormContext, Controller } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import useValidation from "../../../hooks/useValidation";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./StopLossPanel.scss";
import CustomSelect from "../../CustomSelect";
import { some } from "lodash";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} StopLossPanel
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {boolean} [isReadOnly] Flag to disable edition.
 */

/**
 * Manual trading stop loss panel component.
 *
 * @param {StopLossPanel} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const StopLossPanel = (props) => {
  const { symbolData, positionEntity, isReadOnly = false } = props;
  const existsStopLoss = positionEntity
    ? isNumber(positionEntity.stopLossPrice) && isNumber(positionEntity.stopLossPercentage)
    : false;
  const { expanded, expandClass, setExpanded } = useExpandable(existsStopLoss);
  const {
    clearErrors,
    errors,
    getValues,
    register,
    setValue,
    watch,
    trigger,
    control,
  } = useFormContext();
  const { lessThan } = useValidation();
  const { getEntryPrice, getEntryPricePercentChange } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();
  // Strategy panels inputs to observe for changes.
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  let type = "fixed";
  if (positionEntity) {
    if (positionEntity.stopLossFollowsTakeProfit) {
      type = "stopLossFollowsTakeProfit";
    } else if (positionEntity.stopLossToBreakEven) {
      type = "stopLossToBreakEven";
    }
  }
  const strategyPrice = watch("price");
  const isClosed = positionEntity ? positionEntity.closed : false;
  const hasReachedTp = positionEntity && some(positionEntity.takeProfitTargets, (tp) => tp.done);

  const stopLossTypeOptions = [
    { label: formatMessage({ id: "terminal.stoploss.type.fixed" }), val: "fixed" },
    {
      label: formatMessage({ id: "terminal.stoploss.type.followtp" }),
      val: "stopLossFollowsTakeProfit",
    },
    {
      label: formatMessage({ id: "terminal.stoploss.type.breakeven" }),
      val: "stopLossToBreakEven",
    },
  ];

  const getFieldsDisabledStatus = () => {
    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};
    let disabled = false;
    if (isReadOnly) {
      disabled = true;
    }

    fieldsDisabled.stopLossPrice = disabled;
    fieldsDisabled.stopLossPercentage = disabled;
    fieldsDisabled.stopLossType = disabled || hasReachedTp;

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  /**
   * Validate target percentage limits.
   *
   * @returns {boolean} true if validation pass, false otherwise.
   */
  function validateStopLossPercentageLimits() {
    const draftPosition = getValues();
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage);
    const pricePercentChange = formatFloat2Dec(getEntryPricePercentChange());
    return lessThan(
      stopLossPercentage,
      pricePercentChange,
      entryType,
      "terminal.stoploss.valid.percentage",
      { value: pricePercentChange },
    );
  }

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPercentageChange = useCallback(() => {
    if (errors.stopLossPercentage) return;

    const draftPosition = getValues();
    const price = getEntryPrice();
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage);
    const stopLossPrice = (price * (100 + stopLossPercentage)) / 100;

    if (!isNaN(price) && price > 0) {
      setValue("stopLossPrice", formatPrice(stopLossPrice, "", ""));
    } else {
      setValue("stopLossPrice", "");
    }

    trigger("stopLossPrice");
  }, [errors, getEntryPrice, getValues, setValue, trigger]);

  /**
   * Calculate percentage based on price when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPriceChange = useCallback(() => {
    if (errors.stopLossPrice) return;

    const draftPosition = getValues();
    const price = getEntryPrice();
    const stopLossPrice = parseFloat(draftPosition.stopLossPrice);
    const priceDiff = stopLossPrice - price;

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      const stopLossPercentage = (priceDiff / price) * 100;
      setValue("stopLossPercentage", formatFloat2Dec(stopLossPercentage));
    } else {
      setValue("stopLossPercentage", "");
    }

    trigger("stopLossPercentage");
  }, [errors, getEntryPrice, getValues, setValue, trigger]);

  const initStopLoss = () => {
    if (expanded) {
      if (positionEntity && positionEntity.stopLossPercentage) {
        setValue("stopLossPercentage", formatFloat2Dec(positionEntity.stopLossPercentage));
        stopLossPercentageChange();
      }
      updateStopLoss();
    } else {
      setValue("stopLossPrice", "");
      if (errors.stopLossPercentage) {
        clearErrors("stopLossPercentage");
      }

      if (errors.stopLossPrice) {
        clearErrors("stopLossPrice");
      }
    }
  };
  useEffect(initStopLoss, [expanded]);

  const updateStopLoss = () => {
    const draftPosition = getValues();
    const initialStopLossPercentage = positionEntity ? positionEntity.stopLossPercentage : null;
    const stopLossPercentage =
      parseFloat(draftPosition.stopLossPercentage) || initialStopLossPercentage;
    const sign = entryType === "SHORT" ? "" : "-";

    if (isNaN(stopLossPercentage)) {
      setValue("stopLossPercentage", sign);
    } else {
      // When SL come from backend rely on the existing sign and value.
      // Otherwise use the custom SL value and apply the sign corresponding to entry type.
      const newValue = formatFloat2Dec(initialStopLossPercentage || Math.abs(stopLossPercentage));
      setValue("stopLossPercentage", formatFloat2Dec(newValue));
    }
  };

  useEffect(updateStopLoss, [entryType, strategyPrice]);

  /**
   * Display property errors.
   *
   * @param {string} propertyName Property name to display errors for.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayFieldErrors = (propertyName) => {
    if (errors[propertyName]) {
      return <span className="errorText">{errors[propertyName].message}</span>;
    }

    return null;
  };

  return (
    <Box className={`panel stopLossPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && (
          <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
        )}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.stoploss" />
          </Typography>
          <input name="unrealizedProfitLossesPercentage" ref={register} type="hidden" />
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
          <Box className="stopLoss">
            <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stoploss" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={fieldsDisabled.stopLossPercentage}
                  inputRef={register({
                    validate: validateStopLossPercentageLimits,
                  })}
                  name="stopLossPercentage"
                  onChange={stopLossPercentageChange}
                />
                <div className="currencyBox">%</div>
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={fieldsDisabled.stopLossPrice}
                  inputRef={register({
                    validate: {
                      positive: (value) =>
                        value >= 0 || formatMessage({ id: "terminal.stoploss.limit.zero" }),
                    },
                  })}
                  name="stopLossPrice"
                  onChange={stopLossPriceChange}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </Box>
            {displayFieldErrors("stopLossPercentage")}
            {displayFieldErrors("stopLossPrice")}
          </Box>
          <Box mt="12px" alignItems="center" className="title" display="flex" flexDirection="row">
            <Typography variant="h5">
              <FormattedMessage id="terminal.stoploss.type" />
            </Typography>
            <Controller
              as={
                <CustomSelect
                  disabled={fieldsDisabled.stopLossType}
                  label=""
                  onChange={() => {}}
                  options={stopLossTypeOptions}
                />
              }
              control={control}
              defaultValue={type}
              name="stopLossType"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(StopLossPanel);
