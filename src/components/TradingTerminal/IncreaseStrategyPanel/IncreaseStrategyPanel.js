import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
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
import { CircularProgress } from "@material-ui/core";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} StrategyPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} positionEntity Position entity.
 */

/**
 * Manual trading increase strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const IncreaseStrategyPanel = (props) => {
  const { symbolData, positionEntity } = props;
  const [expand, setExpand] = useState(false);
  const expandClass = expand ? "expanded" : "collapsed";
  const { control, errors, register, watch } = useFormContext();
  const { formatMessage } = useIntl();
  const { selectedExchange } = useStoreSettingsSelector();
  const {
    positionSizeChange,
    positionSizePercentageChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    validatePositionSizePercentage,
  } = usePositionSizeHandlers(symbolData, positionEntity.leverage);
  const { balance, loading } = useAvailableBalance();
  const baseBalance = (balance && balance[symbolData.base]) || 0;
  const quoteBalance = (balance && balance[symbolData.quote]) || 0;

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
    { label: formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop_limit" },
  ];

  // Watched inputs that affect components.
  const entryStrategy = watch("entryStrategy");
  const lastPrice = watch("lastPrice");

  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isDisabled = (isCopy && !isCopyTrader) || isClosed;
  const isReadOnly = isUpdating || isOpening;
  const providerAllocatedBalance = 10;
  const providerConsumedBalance = 20;

  // Don't render when not granted to increase position.
  if (isDisabled) {
    return null;
  }

  return (
    <Box className={`panel strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch defaultChecked={expand} onChange={handleToggle} size="small" />
        <Typography variant="h5">
          <FormattedMessage id="terminal.increasestrategy" />
        </Typography>
        <input name="lastPrice" ref={register} type="hidden" />
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
          {entryStrategy === "stop_limit" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stopprice" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  inputRef={register}
                  name="stopPrice"
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" ? (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.price" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  defaultValue={lastPrice}
                  disabled={isReadOnly}
                  inputRef={register}
                  name="price"
                  onChange={priceChange}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              {errors.price && <span className="errorText">{errors.price.message}</span>}
            </FormControl>
          ) : (
            <input defaultValue={lastPrice} name="price" ref={register} type="hidden" />
          )}
          {selectedExchange.exchangeType === "futures" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.realinvest" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  inputRef={register}
                  name="realInvestment"
                  onChange={realInvestmentChange}
                  placeholder={"0"}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.available" />{" "}
                {loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : (
                  <span className="balance">{quoteBalance}</span>
                )}
              </FormHelperText>
            </FormControl>
          )}
          {!isCopyTrader && (
            <FormControl>
              <HelperLabel
                descriptionId="terminal.stoploss.help"
                labelId="terminal.position.size"
              />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  inputRef={register({
                    required: formatMessage({ id: "terminal.positionsize.required" }),
                    validate: validatePositionSize,
                  })}
                  name="positionSize"
                  onChange={positionSizeChange}
                  placeholder={"0"}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.available" />{" "}
                {loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : (
                  <span className="balance">{quoteBalance}</span>
                )}
              </FormHelperText>
              {errors.positionSize && (
                <span className="errorText">{errors.positionSize.message}</span>
              )}
            </FormControl>
          )}
          {isCopyTrader && (
            <FormControl>
              <HelperLabel
                descriptionId="terminal.position.sizepercentage.help"
                labelId="terminal.position.sizepercentage"
              />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  inputRef={register({
                    required: formatMessage({ id: "terminal.positionsize.percentage.required" }),
                    validate: validatePositionSizePercentage,
                  })}
                  name="positionSizePercentage"
                  onChange={positionSizePercentageChange}
                  placeholder={"0"}
                />
                <div className="currencyBox">%</div>
              </Box>
              <FormHelperText>
                Current allocated: {providerAllocatedBalance}, Using: {providerConsumedBalance}
              </FormHelperText>
              {errors.positionSizePercentage && (
                <span className="errorText">{errors.positionSizePercentage.message}</span>
              )}
            </FormControl>
          )}
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.units" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                disabled={isReadOnly}
                inputRef={register}
                name="units"
                onChange={unitsChange}
                placeholder={"0"}
              />
              <div className="currencyBox">{symbolData.base}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" />{" "}
              {loading ? (
                <CircularProgress color="primary" size={15} />
              ) : (
                <span className="balance">{baseBalance}</span>
              )}
            </FormHelperText>
            {errors.units && <span className="errorText">{errors.units.message}</span>}
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(IncreaseStrategyPanel);
