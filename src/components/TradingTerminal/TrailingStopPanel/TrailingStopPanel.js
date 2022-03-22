import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, Typography, Switch } from "@mui/material";
import { formatPrice, format2Dec } from "../../../utils/formatters";
import { useFormContext } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./TrailingStopPanel.scss";
import useValidation from "../../../hooks/useValidation";
import PricePercentageControl from "../Controls/PricePercentageControl";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import usePositionSizeHandlers from "hooks/usePositionSizeHandlers";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @typedef {Object} TrailingStopPanel
 * @property {MarketSymbol} symbolData
 * @property {Position} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {boolean} [isReadOnly] Flag to disable edition.
 */

/**
 * Manual trading trailing stop panel component.
 *
 * @param {TrailingStopPanel} props Component props.
 * @returns {JSX.Element} Trailing stop panel element.
 */
const TrailingStopPanel = (props) => {
  const { symbolData, positionEntity, isReadOnly = false } = props;
  const existsTrailingStop = positionEntity
    ? Boolean(positionEntity.trailingStopPercentage)
    : false;
  const { expanded, expandClass, setExpanded } = useExpandable(existsTrailingStop);
  const {
    clearErrors,
    errors,
    getValues,
    trigger,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useFormContext();
  const initTrailingStopDistance = positionEntity ? positionEntity.trailingStopPercentage : 0;
  const trailingStopDistanceRaw = watch("trailingStopDistance", initTrailingStopDistance);
  const trailingStopDistance = parseFloat(trailingStopDistanceRaw);
  const initTrailingStopPercentage = positionEntity
    ? positionEntity.trailingStopTriggerPercentage
    : 0;
  const trailingStopPercentageRaw = watch("trailingStopPercentage", initTrailingStopPercentage);
  const trailingStopPercentage = parseFloat(trailingStopPercentageRaw);
  const { validateTargetPriceLimits } = useSymbolLimitsValidate(symbolData);
  const { lessThan, greaterThan } = useValidation();
  const { getEntryPrice, getEntrySizeQuote } = usePositionEntry(positionEntity);
  const entrySizeQuote = getEntrySizeQuote();
  const isClosed = positionEntity ? positionEntity.closed : false;
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const { validateSellAmount } = usePositionSizeHandlers(symbolData);

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
   * Validate target percentage limits.
   *
   * @param {string} value stopLossPercentage
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validatePercentage = (value) => {
    const stopLossPercentage = parseFloat(value);

    let valid = true;
    if (positionEntity) {
      greaterThan(value, 0, entryType, "terminal.trailingstop.valid.percentage", {
        value: 0,
      });
    }

    if (valid === true) {
      if (stopLossPercentage && entrySizeQuote) {
        const amountSoldTrigger = (entrySizeQuote * (100 + stopLossPercentage)) / 100;
        const amountSold = (amountSoldTrigger * (100 + trailingStopDistance)) / 100;
        // @ts-ignore
        valid = validateSellAmount(amountSold);
      }
    }

    return valid;
  };

  useEffect(() => {
    trigger("trailingStopPercentage");
  }, [entrySizeQuote, trailingStopDistance]);

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const trailingStopPercentageChange = () => {
    const price = getEntryPrice();

    if (price > 0) {
      // Update trailing stop price
      const draftPosition = getValues();
      const newTrailingStopPercentage = parseFloat(draftPosition.trailingStopPercentage);
      const trailingStopPrice = (price * (100 + newTrailingStopPercentage)) / 100;
      setValue("trailingStopPrice", formatPrice(trailingStopPrice, "", ""));
    } else {
      setValue("trailingStopPrice", "");
    }

    trigger("trailingStopPrice");
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

    if (!isNaN(priceDiff) && priceDiff !== 0) {
      // Update trailing stop percentage
      const newTrailingStopPercentage = (priceDiff / price) * 100;
      setValue("trailingStopPercentage", format2Dec(newTrailingStopPercentage));
    } else {
      setValue("trailingStopPercentage", "");
    }

    trigger("trailingStopPercentage");
  };

  const chainedPriceUpdates = () => {
    if (expanded) {
      const newPercentage = format2Dec(Math.abs(trailingStopPercentage));
      const newDistance = format2Dec(Math.abs(trailingStopDistance));
      const percentageSign = entryType === "SHORT" ? "-" : "";
      const distanceSign = entryType === "SHORT" ? "" : "-";

      if (!trailingStopDistance) {
        setValue("trailingStopDistance", distanceSign);
      } else {
        setValue("trailingStopDistance", `${distanceSign}${newDistance}`);
        if (dirtyFields.trailingStopDistance) {
          trigger("trailingStopDistance");
        }
      }

      if (!trailingStopPercentage) {
        setValue("trailingStopPercentage", percentageSign);
      } else {
        setValue("trailingStopPercentage", `${percentageSign}${newPercentage}`);
        if (positionEntity) {
          setValue("trailingStopPrice", positionEntity.trailingStopTriggerPrice);
          setValue("trailingStopTriggerPriority", positionEntity.trailingStopTriggerPriority);
        }
      }
    } else {
      setValue("trailingStopPrice", "");
      if (errors.trailingStopPercentage) {
        clearErrors("trailingStopPercentage");
      }

      if (errors.trailingStopPrice) {
        clearErrors("trailingStopPrice");
      }
    }
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

  //   const initTrailingStopLoss = () => {
  //     if (expanded) {
  //     } else {
  //       setValue("trailingStopPrice", "");
  //       if (errors.trailingStopPercentage) {
  //         clearErrors("trailingStopPercentage");
  //       }

  //       if (errors.trailingStopPrice) {
  //         clearErrors("trailingStopPrice");
  //       }
  //     }
  //   };
  //   useEffect(initTrailingStopLoss, [expanded]);

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
          <PricePercentageControl
            // defaultPriority={positionEntity ? positionEntity.trailingStopTriggerPriority : null}
            disabled={fieldsDisabled.trailingStopPercentage}
            labelDescriptionId="terminal.trailingstop.help"
            labelId="terminal.trailingstop"
            percentage={{
              name: "trailingStopPercentage",
              validate: validatePercentage,
              onChange: trailingStopPercentageChange,
              // allowNegative: entryType.toUpperCase() === "SHORT",
              allowNegative: true,
            }}
            price={{
              name: "trailingStopPrice",
              onChange: trailingStopPriceChange,
              validate: (value) => validateTargetPriceLimits(value, "terminal.trailingstop.limit"),
            }}
            priorityName="trailingStopTriggerPriority"
            quote={symbolData.quote}
          />
          <Box>
            <HelperLabel descriptionId="terminal.distance.help" labelId="terminal.distance" />
            <Box alignItems="center" display="flex">
              <CustomNumberInput
                allowNegative={true}
                disabled={fieldsDisabled.trailingStopDistance}
                name="trailingStopDistance"
                rules={{
                  validate: (value) =>
                    lessThan(parseFloat(value), 0, entryType, "terminal.trailingstop.limit.zero"),
                }}
                showErrorMessage={false}
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
