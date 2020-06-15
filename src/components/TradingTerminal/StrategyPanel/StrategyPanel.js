import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
import { useFormContext } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import {
  OutlinedInput,
  FormControlLabel,
  FormHelperText,
  FormControl,
  RadioGroup,
  Radio,
  Switch,
  Typography,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} StrategyPanelProps
 * @property {boolean} disableExpand
 * @property {MarketSymbol} symbolData
 * @property {CoinRayCandle} lastPriceCandle
 * @property {number} leverage
 */

/**
 * Manual trading strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const StrategyPanel = (props) => {
  const { disableExpand, symbolData, lastPriceCandle, leverage } = props;
  const defaultExpand = !!disableExpand;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { errors, getValues, register, clearError, setError, setValue } = useFormContext();
  const intl = useIntl();
  const { selectedExchange } = useStoreSettingsSelector();
  const storeUser = useStoreUserSelector();
  const lastDayBalance = storeUser.dailyBalance.balances[0] || null;

  const getQuoteBalance = () => {
    if (!lastDayBalance) {
      return 0;
    }

    const propertyKey = `totalFree${symbolData.quote}`;
    // @ts-ignore
    return lastDayBalance[propertyKey] || 0;
  };

  const getBaseBalance = () => {
    if (!lastDayBalance) {
      return 0;
    }

    const propertyKey = `totalFree${symbolData.base}`;
    // @ts-ignore
    return lastDayBalance[propertyKey] || 0;
  };

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

  const entryStrategyOptions = [
    { label: intl.formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: intl.formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop-limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.import" }), val: "import" },
  ];

  const [entryStrategy, setEntryStrategy] = useState(entryStrategyOptions[0].val);
  const { limits } = symbolData;

  /**
   * Validate that position size is within limits.
   *
   * @param {number} positionSize Position size value.
   * @returns {Void} None.
   */
  function validatePositionSize(positionSize) {
    clearError("positionSize");
    if (limits.cost.min && positionSize < limits.cost.min) {
      setError("positionSize", "error", `Position size cannot be lower than ${limits.cost.min}`);
    }

    if (limits.cost.max && positionSize > limits.cost.max) {
      setError("positionSize", "error", `Position size cannot be greater than ${limits.cost.max}`);
    }
  }

  /**
   * Validate that units is within limits.
   *
   * @param {number} units Units value.
   * @returns {Void} None.
   */
  function validateUnits(units) {
    clearError("units");
    if (limits.amount.min && units < limits.amount.min) {
      setError("units", "error", `Units cannot be lower than ${limits.amount.min}`);
    }

    if (limits.amount.max && units > limits.amount.max) {
      setError("units", "error", `Units cannot be greater than ${limits.amount.max}`);
    }
  }

  /**
   * Validate that price is within limits.
   *
   * @param {number} price Price value.
   * @returns {Void} None.
   */
  function validatePrice(price) {
    clearError("price");
    if (limits.price.min && price < limits.price.min) {
      setError("price", "error", `Price cannot be lower than ${limits.price.min}`);
    }

    if (limits.price.max && price > limits.price.max) {
      setError("price", "error", `Price cannot be greater than ${limits.price.max}`);
    }
  }

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * leverage;
    setValue("positionSize", positionSize);
    validatePositionSize(positionSize);

    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));
    validateUnits(units);
  };

  const positionSizeChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);
    validatePositionSize(positionSize);

    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));
    validateUnits(units);

    const realInvestment = parseFloat(draftPosition.positionSize) / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const unitsChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = parseFloat(draftPosition.units);
    validateUnits(units);

    const positionSize = units * price;
    setValue("positionSize", positionSize.toFixed(8));
    validatePositionSize(positionSize);

    const realInvestment = positionSize / leverage;
    setValue("realInvestment", realInvestment.toFixed(8));
  };

  const priceChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    validatePrice(price);
  };

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!disableExpand && <Switch onChange={handleToggle} size="small" />}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.strategy" />
          </Typography>
          <CustomSelect
            label=""
            onChange={setEntryStrategy}
            options={entryStrategyOptions}
            value={entryStrategy}
          />
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
          {selectedExchange.exchangeType === "futures" && (
            <FormControl className="entryType">
              <RadioGroup aria-label="Entry Type" name="entryType">
                <FormControlLabel
                  control={<Radio />}
                  inputRef={register}
                  label={<FormattedMessage id="col.side.long" />}
                  value="LONG"
                />
                <FormControlLabel
                  control={<Radio />}
                  inputRef={register}
                  label={<FormattedMessage id="col.side.short" />}
                  value="SHORT"
                />
              </RadioGroup>
            </FormControl>
          )}
          {entryStrategy === "stop-limit" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stopprice" />
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="stopPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.price" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  inputRef={register}
                  name="price"
                  onChange={priceChange}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              {errors.price && <span className="errorText">{errors.price.message}</span>}
            </FormControl>
          )}
          {selectedExchange.exchangeType === "futures" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.realinvest" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  inputRef={register}
                  name="realInvestment"
                  onChange={realInvestmentChange}
                  placeholder={"0"}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.available" /> {getQuoteBalance()}
              </FormHelperText>
            </FormControl>
          )}
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.position.size" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="positionSize"
                onChange={positionSizeChange}
                placeholder={"0"}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" /> {getQuoteBalance()}
            </FormHelperText>
            {errors.positionSize && (
              <span className="errorText">{errors.positionSize.message}</span>
            )}
          </FormControl>
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.units" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="units"
                onChange={unitsChange}
                placeholder={"0"}
              />
              <div className="currencyBox">{symbolData.base}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" /> {getBaseBalance()}
            </FormHelperText>
            {errors.units && <span className="errorText">{errors.units.message}</span>}
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default StrategyPanel;
