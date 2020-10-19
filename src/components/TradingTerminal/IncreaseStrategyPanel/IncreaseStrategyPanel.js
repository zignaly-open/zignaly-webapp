import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
import { OutlinedInput, FormHelperText, FormControl, Switch, Typography } from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import "./IncreaseStrategyPanel.scss";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";
import useOwnCopyTraderProviders from "../../../hooks/useOwnCopyTraderProviders";
import { formatPrice } from "../../../utils/formatters";
import { formatFloat2Dec } from "../../../utils/format";
import { CircularProgress } from "@material-ui/core";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";

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
  const { control, errors, register, watch, reset, getValues } = useFormContext();
  const { formatMessage } = useIntl();
  const { selectedExchange } = useStoreSettingsSelector();
  const {
    positionSizeChange,
    validateUnits,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
  } = usePositionSizeHandlers(symbolData, positionEntity.leverage);
  const { balance, loading } = useAvailableBalance();
  const { ownCopyTraderProviders, loading: loadingProviders } = useOwnCopyTraderProviders();
  const baseBalance = (balance && balance[symbolData.base]) || 0;
  const quoteBalance = (balance && balance[symbolData.quote]) || 0;
  const providerService = ownCopyTraderProviders.find(
    (provider) => provider.providerId === positionEntity.providerId,
  );
  const isCopyProvider = providerService && providerService !== "1";

  const providerAllocatedBalance = providerService ? providerService.providerPayableBalance : 0;
  const providerConsumedBalance = providerService ? providerService.providerConsumedBalance : 0;
  const providerConsumedBalancePercentage = providerService
    ? providerService.providerConsumedBalancePercentage
    : 0;

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
  const updatedAt = watch("updatedAt");

  // Close panel on position update
  useEffect(() => {
    if (updatedAt) {
      setExpand(false);
    }
  }, [updatedAt]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expand) {
      reset({
        ...getValues(),
        stopPrice: "",
        price: "",
        realInvestment: "",
        positionSize: "",
        positionSizePercentage: "",
        units: "",
      });
    }
  };
  useEffectSkipFirst(emptyFieldsWhenCollapsed, [expand]);

  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isDisabled = (isCopy && !isCopyTrader) || isClosed;
  const isReadOnly = isUpdating || isOpening;

  // Don't render when not granted to increase position.
  if (isDisabled) {
    return null;
  }

  return (
    <Box className={`panel strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch checked={expand} onChange={handleToggle} size="small" />
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
              <HelperLabel descriptionId="terminal.stopprice.help" labelId="terminal.stopprice" />
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
              <HelperLabel descriptionId="terminal.price.help" labelId="terminal.price" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  defaultValue={lastPrice}
                  disabled={isReadOnly}
                  error={!!errors.price}
                  inputRef={register({
                    validate: (value) => !isNaN(value) && parseFloat(value) > 0,
                  })}
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
          {selectedExchange.exchangeType === "futures" && !isCopyProvider && (
            <FormControl>
              <HelperLabel descriptionId="terminal.realinvest.help" labelId="terminal.realinvest" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  inputRef={register({
                    validate: (value) => !isNaN(value) && parseFloat(value) >= 0,
                  })}
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
                descriptionId="terminal.position.size.help"
                labelId="terminal.position.size"
              />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  error={!!errors.positionSize}
                  inputRef={register({
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
                  error={!!errors.positionSizePercentage}
                  inputRef={register({
                    required: formatMessage({ id: "terminal.positionsize.percentage.required" }),
                    validate: (value) =>
                      (value > 0 && value <= 100) ||
                      formatMessage({ id: "terminal.positionsize.valid.percentage" }),
                  })}
                  name="positionSizePercentage"
                  placeholder={"0"}
                />
                <div className="currencyBox">%</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.provider.allocated" />{" "}
                {loadingProviders ? (
                  <CircularProgress color="primary" size={20} />
                ) : (
                  <span className="balance">{formatPrice(providerAllocatedBalance)} </span>
                )}
                <FormattedMessage id="terminal.provider.consumed" />{" "}
                {!loadingProviders && (
                  <span className="balance">{formatPrice(providerConsumedBalance)} </span>
                )}
                <FormattedMessage id="terminal.provider.available" />{" "}
                {!loadingProviders && (
                  <span className="balance">
                    {formatFloat2Dec(100 - providerConsumedBalancePercentage)}%
                  </span>
                )}
              </FormHelperText>
              {errors.positionSizePercentage && (
                <span className="errorText">{errors.positionSizePercentage.message}</span>
              )}
            </FormControl>
          )}
          {!isCopyTrader && (
            <FormControl>
              <HelperLabel descriptionId="terminal.units.help" labelId="terminal.units" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  disabled={isReadOnly}
                  error={!!errors.units}
                  inputRef={register({
                    validate: validateUnits,
                  })}
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
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(IncreaseStrategyPanel);
