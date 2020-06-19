import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../../../utils/events";
import useExpandable from "../../../hooks/useExpandable";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import "./TrailingStopPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} TrailingStopPanel
 * @property {MarketSymbol} symbolData
 */

/**
 * Manual trading trailing stop panel component.
 *
 * @param {TrailingStopPanel} props Component props.
 * @returns {JSX.Element} Trailing stop panel element.
 */
const TrailingStopPanel = (props) => {
  const { symbolData } = props;
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { errors, getValues, register, setValue, watch } = useFormContext();
  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const { validateTargetPriceLimits } = useSymbolLimitsValidate(symbolData);

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const trailingStopPercentageChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    const trailingStopPercentage = parseFloat(draftPosition.trailingStopPercentage);
    const trailingStopPrice = (price * (100 + trailingStopPercentage)) / 100;

    if (!isNaN(price) && price > 0) {
      setValue("trailingStopPrice", formatPrice(trailingStopPrice, ""));
    } else {
      setValue("trailingStopPrice", "");
    }

    validateTargetPriceLimits(trailingStopPrice, "trailingStopPrice");
  };

  /**
   * Calculate percentage based on price when value is changed.
   *
   * @return {Void} None.
   */
  const trailingStopPriceChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    const trailingStopPrice = parseFloat(draftPosition.trailingStopPrice);
    const priceDiff = trailingStopPrice - price;

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      const trailingStopPercentage = (priceDiff / price) * 100;
      setValue("trailingStopPercentage", formatFloat2Dec(trailingStopPercentage));
    } else {
      setValue("trailingStopPercentage", "");
    }

    validateTargetPriceLimits(trailingStopPrice, "trailingStopPrice");
  };

  const chainedPriceUpdates = () => {
    const draftPosition = getValues();
    const stopLossPercentage = draftPosition.stopLossPercentage || 0;
    const newValue = formatFloat2Dec(Math.abs(stopLossPercentage));
    const sign = entryType === "SHORT" ? "" : "-";

    if (stopLossPercentage === 0) {
      setValue("trailingStopPercentage", sign);
    } else {
      setValue("trailingStopPercentage", `${sign}${newValue}`);
    }

    simulateInputChangeEvent("trailingStopPercentage");
  };

  useEffect(chainedPriceUpdates, [expanded, entryType, strategyPrice]);

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
    <Box className={`strategyPanel trailingStopPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
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
                inputRef={register}
                name="trailingStopPercentage"
                onChange={trailingStopPercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            {displayFieldErrors("trailingStopPercentage")}
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="trailingStopPrice"
                onChange={trailingStopPriceChange}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
            {displayFieldErrors("trailingStopPrice")}
            <HelperLabel descriptionId="terminal.distance.help" labelId="terminal.distance" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="trailingStopDistance"
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TrailingStopPanel;
