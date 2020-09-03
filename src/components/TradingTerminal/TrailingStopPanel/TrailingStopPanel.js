import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { lt, gt } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography, Switch } from "@material-ui/core";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { isValidIntOrFloat } from "../../../utils/validators";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../../../utils/events";
import useExpandable from "../../../hooks/useExpandable";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./TrailingStopPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} TrailingStopPanel
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading trailing stop panel component.
 *
 * @param {TrailingStopPanel} props Component props.
 * @returns {JSX.Element} Trailing stop panel element.
 */
const TrailingStopPanel = (props) => {
  const { symbolData, positionEntity } = props;
  const existsTrailingStop = positionEntity
    ? Boolean(positionEntity.trailingStopPercentage)
    : false;
  const { expanded, expandClass, setExpanded } = useExpandable(existsTrailingStop);
  const { clearErrors, errors, getValues, register, setError, setValue, watch } = useFormContext();
  const initTrailingStopDistance = positionEntity ? positionEntity.trailingStopPercentage : 0;
  const trailingStopDistanceRaw = watch("trailingStopDistance", initTrailingStopDistance);
  const trailingStopDistance = parseFloat(trailingStopDistanceRaw);
  const initTrailingStopPercentage = positionEntity
    ? positionEntity.trailingStopTriggerPercentage
    : 0;
  const trailingStopPercentageRaw = watch("trailingStopPercentage", initTrailingStopPercentage);
  const trailingStopPercentage = parseFloat(trailingStopPercentageRaw);
  const { validateTargetPriceLimits } = useSymbolLimitsValidate(symbolData);
  const { getEntryPrice } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;

  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");

  const getFieldsDisabledStatus = () => {
    const isTriggered = positionEntity ? positionEntity.trailingStopTriggered : false;

    /**
     * @type {Object<string, boolean>}
     */
    const fieldsDisabled = {};

    fieldsDisabled.trailingStopPercentage = isReadOnly || isTriggered;
    fieldsDisabled.trailingStopPrice = isReadOnly || isTriggered;
    fieldsDisabled.trailingStopDistance = isReadOnly;

    return fieldsDisabled;
  };

  const fieldsDisabled = getFieldsDisabledStatus();

  /**
   * Validate trailing stop distance when change.
   *
   * @return {Void} None.
   */
  const trailingStopDistanceChange = () => {
    const valueType = entryType === "LONG" ? "lower" : "greater";
    const compareFn = entryType === "LONG" ? gt : lt;

    if (!isValidIntOrFloat(trailingStopDistanceRaw) || compareFn(trailingStopDistance, 0)) {
      setError("trailingStopDistance", {
        type: "manual",
        message: formatMessage({ id: "terminal.trailingstop.limit.zero" }, { type: valueType }),
      });
      return;
    }

    if (errors.trailingStopDistance) {
      clearErrors("trailingStopDistance");
    }
  };

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const trailingStopPercentageChange = () => {
    const draftPosition = getValues();
    const price = getEntryPrice();
    const trailingStopPrice = (price * (100 + trailingStopPercentage)) / 100;
    const valueType = entryType === "LONG" ? "greater" : "lower";
    const compareFn = entryType === "LONG" ? lt : gt;

    if (draftPosition.trailingStopPercentage !== "-") {
      if (!isValidIntOrFloat(trailingStopPercentageRaw) || compareFn(trailingStopPercentage, 0)) {
        setError("trailingStopPercentage", {
          type: "manual",
          message: formatMessage(
            { id: "terminal.trailingstop.valid.percentage" },
            { type: valueType },
          ),
        });
        return;
      }
    }

    if (price > 0) {
      setValue("trailingStopPrice", formatPrice(trailingStopPrice, "", ""));
    } else {
      setValue("trailingStopPrice", "");
    }

    if (
      !validateTargetPriceLimits(
        trailingStopPrice,
        "trailingStopPrice",
        "terminal.trailingstop.limit",
      )
    ) {
      return;
    }

    if (errors.trailingStopPrice) {
      clearErrors("trailingStopPrice");
    }
  };

  /**
   * Calculate percentage based on price when value is changed.
   *
   * @return {Void} None.
   */
  const trailingStopPriceChange = () => {
    const draftPosition = getValues();
    const price = getEntryPrice();
    const trailingStopPrice = parseFloat(draftPosition.trailingStopPrice);
    const priceDiff = trailingStopPrice - price;

    if (!isValidIntOrFloat(draftPosition.trailingStopPrice) || trailingStopPrice < 0) {
      setError("trailingStopPrice", {
        type: "manual",
        message: formatMessage({ id: "terminal.trailingstop.valid.price" }),
      });
      return;
    }

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      const newTrailingStopPercentage = (priceDiff / price) * 100;
      setValue("trailingStopPercentage", formatFloat2Dec(newTrailingStopPercentage));
    } else {
      setValue("trailingStopPercentage", "");
    }

    if (
      !validateTargetPriceLimits(
        trailingStopPrice,
        "trailingStopPrice",
        "terminal.trailingstop.limit",
      )
    ) {
      return;
    }

    if (errors.trailingStopPrice) {
      clearErrors("trailingStopPrice");
    }

    if (errors.trailingStopPercentage) {
      clearErrors("trailingStopPercentage");
    }
  };

  const chainedPriceUpdates = () => {
    const newPercentage = formatFloat2Dec(Math.abs(trailingStopPercentage));
    const newDistance = formatFloat2Dec(Math.abs(trailingStopDistance));
    const percentageSign = entryType === "SHORT" ? "-" : "";
    const distanceSign = entryType === "SHORT" ? "" : "-";

    if (!trailingStopDistance) {
      setValue("trailingStopDistance", distanceSign);
    } else {
      setValue("trailingStopDistance", `${distanceSign}${newDistance}`);
      simulateInputChangeEvent("trailingStopDistance");
    }

    if (!trailingStopPercentage) {
      setValue("trailingStopPercentage", percentageSign);
    } else {
      setValue("trailingStopPercentage", `${percentageSign}${newPercentage}`);
      simulateInputChangeEvent("trailingStopPercentage");
    }

    if (!expanded) {
      setValue("trailingStopPrice", "");
    }
  };

  useEffect(chainedPriceUpdates, [expanded, positionEntity, entryType, strategyPrice]);

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

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      if (errors.trailingStopPercentage) {
        clearErrors("trailingStopPercentage");
      }

      if (errors.trailingStopPrice) {
        clearErrors("trailingStopPrice");
      }
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel trailingStopPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && (
          <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
        )}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.trailingstop" />
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
          <Box className="trailingStop" display="flex" flexDirection="row" flexWrap="wrap">
            <HelperLabel
              descriptionId="terminal.trailingstop.help"
              labelId="terminal.trailingstop"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                disabled={fieldsDisabled.trailingStopPercentage}
                inputRef={register}
                name="trailingStopPercentage"
                onChange={trailingStopPercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                disabled={fieldsDisabled.trailingStopPrice}
                inputRef={register}
                name="trailingStopPrice"
                onChange={trailingStopPriceChange}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
            {displayFieldErrors("trailingStopPercentage")}
            {displayFieldErrors("trailingStopPrice")}
            <HelperLabel descriptionId="terminal.distance.help" labelId="terminal.distance" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                disabled={fieldsDisabled.trailingStopDistance}
                inputRef={register}
                name="trailingStopDistance"
                onChange={trailingStopDistanceChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            {displayFieldErrors("trailingStopDistance")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(TrailingStopPanel);
