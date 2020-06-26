import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserDailyBalance } from "../../../hooks/useStoreUserSelector";
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
import "./IncreaseStrategyPanel.scss";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} StrategyPanelProps
 * @property {MarketSymbol} symbolData
 * @property {CoinRayCandle} lastPriceCandle
 * @property {PositionEntity} positionEntity Position entity.
 */

/**
 * Manual trading increase strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const IncreaseStrategyPanel = (props) => {
  const { symbolData, lastPriceCandle, positionEntity } = props;
  const [expand, setExpand] = useState(true);
  const expandClass = expand ? "expanded" : "collapsed";
  const { control, errors, register, watch } = useFormContext();
  const intl = useIntl();
  const { selectedExchange } = useStoreSettingsSelector();
  const dailyBalance = useStoreUserDailyBalance();
  const lastDayBalance = dailyBalance.balances[0] || null;
  const { leverage } = positionEntity;
  const {
    positionSizeChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
  } = usePositionSizeHandlers(symbolData, leverage);

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
  ];

  // Watched inputs that affect components.
  const entryType = watch("entryType");
  const entryStrategy = watch("entryStrategy");

  return (
    <Box className={`panel strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch defaultChecked={expand} onChange={handleToggle} size="small" />
        <Typography variant="h5">
          <FormattedMessage id="terminal.increasestrategy" />
        </Typography>
      </Box>
      {expand && (
        <Box className="panelContent" display="flex" flexDirection="row" flexWrap="wrap">
          <FormControl className="entryType">
            <HelperLabel
              descriptionId="terminal.increasestrategy.help"
              labelId="terminal.entrytype"
            />
            <Controller
              as={<CustomSelect label="" onChange={() => {}} options={entryStrategyOptions} />}
              control={control}
              defaultValue="limit"
              name="entryStrategy"
            />
          </FormControl>
          {selectedExchange.exchangeType === "futures" && (
            <FormControl className="entryType">
              <RadioGroup aria-label="Entry Type" defaultValue={entryType} name="entryType">
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
                inputRef={register({
                  required: "Position size is required.",
                  validate: validatePositionSize,
                })}
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

export default React.memo(IncreaseStrategyPanel);
