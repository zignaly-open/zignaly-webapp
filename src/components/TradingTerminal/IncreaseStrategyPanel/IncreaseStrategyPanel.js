import React, { useState, useEffect, useContext } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
import {
  FormHelperText,
  FormControl,
  Switch,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import "./IncreaseStrategyPanel.scss";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";
import useOwnCopyTraderProviders from "../../../hooks/useOwnCopyTraderProviders";
import { formatPrice } from "../../../utils/formatters";
import { formatFloat2Dec } from "../../../utils/format";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import TradingViewContext from "../TradingView/TradingViewContext";
import { useStoreUserExchangeConnections } from "hooks/useStoreUserSelector";
import PostOnlyControl from "../Controls/PostOnlyControl/PostOnlyControl";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
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
  const selectedExchange = useSelectedExchange();
  const {
    positionSizeChange,
    validateUnits,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
    positionSizePercentageChange,
  } = usePositionSizeHandlers(symbolData, positionEntity.leverage);
  const { balance, loading } = useAvailableBalance(selectedExchange);
  const exchangeConnections = useStoreUserExchangeConnections();
  const exchange = exchangeConnections.find(
    (item) => item.internalId === positionEntity.internalExchangeId,
  );
  const { loading: loadingProviders, ownCopyTraderProviders } = useOwnCopyTraderProviders(
    exchange ? exchange.internalId : "",
  );
  const baseBalance = (balance && balance[symbolData.base]) || 0;
  const quoteBalance = (balance && balance[symbolData.quote]) || 0;
  const entryStrategy = watch("entryStrategy", "limit");
  const { lastPrice, updatedAt, providerService, setProviderService } =
    useContext(TradingViewContext);
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

  useEffect(() => {
    // Update current provider service to context
    if (!ownCopyTraderProviders) return;

    const provider = ownCopyTraderProviders.find((p) => p.providerId === positionEntity.providerId);
    setProviderService(provider);
  }, [ownCopyTraderProviders]);

  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;

  return (
    <Box className={`panel strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch checked={expand} onChange={handleToggle} size="small" />
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
          {entryStrategy === "stop_limit" && (
            <FormControl>
              <HelperLabel descriptionId="terminal.stopprice.help" labelId="terminal.stopprice" />
              <Box alignItems="center" display="flex">
                <CustomNumberInput name="stopPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" ? (
            <FormControl>
              <HelperLabel descriptionId="terminal.price.help" labelId="terminal.price" />
              <Box alignItems="center" display="flex">
                <CustomNumberInput
                  defaultValue={lastPrice}
                  name="price"
                  onChange={priceChange}
                  rules={{
                    validate: (value) => !isNaN(value) && parseFloat(value) > 0,
                  }}
                  showErrorMessage={false}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
              {errors.price && <span className="errorText">{errors.price.message}</span>}
            </FormControl>
          ) : (
            <input defaultValue={lastPrice} name="price" ref={register} type="hidden" />
          )}
          {positionEntity.exchangeType === "futures" && !positionEntity.isCopyTrader && (
            <FormControl>
              <HelperLabel descriptionId="terminal.realinvest.help" labelId="terminal.realinvest" />
              <Box alignItems="center" display="flex">
                <CustomNumberInput
                  name="realInvestment"
                  onChange={realInvestmentChange}
                  placeholder={"0"}
                  rules={{
                    validate: (value) => !isNaN(value) && parseFloat(value) >= 0,
                  }}
                  showErrorMessage={false}
                />
                <div className="currencyBox">{symbolData.unitsInvestment}</div>
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
                <CustomNumberInput
                  name="positionSize"
                  onChange={positionSizeChange}
                  placeholder={"0"}
                  rules={{
                    validate: validatePositionSize,
                  }}
                  showErrorMessage={false}
                />
                <div className="currencyBox">{symbolData.unitsInvestment}</div>
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
            <>
              <HelperLabel
                descriptionId="terminal.position.sizepercentage.help"
                labelId="terminal.position.sizepercentage"
              />
              <Box className="positionSizePercentage" display="flex" flexDirection="row">
                <Box display="flex" flexDirection="row">
                  <CustomNumberInput
                    name="positionSizePercentage"
                    onChange={positionSizePercentageChange}
                    placeholder={"0"}
                    rules={{
                      required: formatMessage({ id: "terminal.positionsize.percentage.required" }),
                      validate: (value) =>
                        (value > 0 && value <= 100) ||
                        formatMessage({ id: "terminal.positionsize.valid.percentage" }),
                    }}
                    showErrorMessage={false}
                  />
                  <div className="currencyBox">%</div>
                </Box>
                <Box display="flex" flexDirection="row">
                  <CustomNumberInput
                    name="positionSizeAllocated"
                    placeholder={"0"}
                    readOnly={true}
                  />
                  <div className="currencyBox">{symbolData.unitsInvestment}</div>
                </Box>
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
            </>
          )}
          {!isCopyTrader && (
            <FormControl>
              <HelperLabel descriptionId="terminal.units.help" labelId="terminal.units" />
              <Box alignItems="center" display="flex">
                <CustomNumberInput
                  name="units"
                  onChange={unitsChange}
                  placeholder={"0"}
                  rules={{
                    validate: validateUnits,
                  }}
                  showErrorMessage={false}
                />
                <div className="currencyBox">{symbolData.unitsAmount}</div>
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
          {["limit", "stop_limit"].includes(entryStrategy) && (
            <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
              <PostOnlyControl exchange={positionEntity?.exchange} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(IncreaseStrategyPanel);
