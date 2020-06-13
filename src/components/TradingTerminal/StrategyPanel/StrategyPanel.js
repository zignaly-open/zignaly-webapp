import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
import { useFormContext } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
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
import { Help } from "@material-ui/icons";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} StrategyPanelProps
 * @property {boolean} disableExpand
 * @property {MarketSymbol} symbolData
 * @property {CoinRayCandle} lastPriceCandle
 * @property {string} leverage
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

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.realInvestment) * parseFloat(leverage);
    setValue("positionSize", positionSize);

    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));
  };

  const positionSizeChange = () => {
    const draftPosition = getValues();
    const positionSize = parseFloat(draftPosition.positionSize);
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = positionSize / price;
    setValue("units", units.toFixed(8));

    const realInvestment = parseFloat(draftPosition.positionSize) / parseFloat(leverage);
    setValue("realInvestment", realInvestment.toFixed(8));

    clearError("positionSize");
    if (limits.cost.min && positionSize < limits.cost.min) {
      setError("positionSize", "error", `Position size cannot be lower than ${limits.cost.min}`);
    }

    if (limits.cost.max && positionSize > limits.cost.max) {
      setError("positionSize", "error", `Position size cannot be greater than ${limits.cost.max}`);
    }
  };

  const unitsChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);
    const units = parseFloat(draftPosition.units);
    const positionSize = units * price;
    setValue("positionSize", positionSize.toFixed(8));

    const realInvestment = positionSize / parseFloat(leverage);
    setValue("realInvestment", realInvestment.toFixed(8));

    clearError("units");
    if (limits.amount.min && units < limits.amount.min) {
      setError("units", "error", `Units cannot be lower than ${limits.amount.min}`);
    }

    if (limits.amount.max && units > limits.amount.max) {
      setError("units", "error", `Units cannot be greater than ${limits.amount.max}`);
    }
  };

  const priceChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price) || parseFloat(lastPriceCandle[1]);

    clearError("price");
    if (limits.price.min && price < limits.price.min) {
      setError("price", "error", `Price cannot be lower than ${limits.price.min}`);
    }

    if (limits.price.max && price > limits.price.max) {
      setError("price", "error", `Price cannot be greater than ${limits.price.max}`);
    }
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
        <Box className="panelContent">
          {selectedExchange.exchangeType === "futures" && (
            <FormControl>
              <RadioGroup aria-label="Entry Type" className="entryType" name="entryType">
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
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>
                  <FormattedMessage id="terminal.stopprice" />
                </FormHelperText>
                <Help />
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="stopPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" && (
            <FormControl>
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>
                  <FormattedMessage id="terminal.price" />
                </FormHelperText>
                <Help />
              </Box>
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
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>
                  <FormattedMessage id="terminal.realinvest" />
                </FormHelperText>
                <Help />
              </Box>
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
            </FormControl>
          )}
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>
                <FormattedMessage id="terminal.position.size" />
              </FormHelperText>
              <Help />
            </Box>
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
            {errors.positionSize && (
              <span className="errorText">{errors.positionSize.message}</span>
            )}
          </FormControl>
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>
                <FormattedMessage id="terminal.units" />
              </FormHelperText>
              <Help />
            </Box>
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
            {errors.units && <span className="errorText">{errors.units.message}</span>}
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default StrategyPanel;
