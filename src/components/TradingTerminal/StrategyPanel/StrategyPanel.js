import React, { useContext } from "react";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import HelperLabel from "../HelperLabel/HelperLabel";
import { formatPrice } from "../../../utils/formatters";
import { formatFloat2Dec } from "../../../utils/format";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
import "./StrategyPanel.scss";
import TradingViewContext from "../TradingView/TradingViewContext";
import PostOnlyControl from "../Controls/PostOnlyControl/PostOnlyControl";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import MarginButtons from "../Controls/MarginControl";
import { Alert } from '@mui/material';
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * @param {Object} props Props
 * @param {string} [props.multiSide] Side for multi order
 * @param {MarketSymbol} props.symbolData symbolData
 * @returns {JSX.Element} JSX
 */
const PriceControl = ({ multiSide, symbolData }) => {
  const { errors, watch } = useFormContext();
  const entryStrategy = watch("entryStrategy");
  const { lastPrice } = useContext(TradingViewContext);

  const { validatePrice, priceChange } = usePositionSizeHandlers(symbolData);

  const name = multiSide === "short" ? "priceShort" : "price";
  const label = entryStrategy === "multi" ? `terminal.price.${multiSide}` : "terminal.price";

  return (
    <FormControl>
      <HelperLabel descriptionId="terminal.price.help" labelId={label} />
      <Box alignItems="center" display="flex">
        <CustomNumberInput
          defaultValue={lastPrice}
          name={name}
          onChange={priceChange}
          rules={{
            validate: (price) => validatePrice(price, multiSide),
          }}
          showErrorMessage={false}
        />
        <div className="currencyBox">{symbolData.quote}</div>
      </Box>
      {errors[name] && <span className="errorText">{errors[name].message}</span>}
    </FormControl>
  );
};

/**
 * @param {Object} props Props
 * @param {string} [props.multiSide] Side for multi order
 * @param {MarketSymbol} props.symbolData symbolData
 * @param {boolean} props.loading Balance loading
 * @param {number} props.baseBalance Balance
 * @returns {JSX.Element} JSX
 */
const UnitsControl = ({ multiSide, symbolData, loading, baseBalance }) => {
  const { errors, watch } = useFormContext();
  const { unitsChange, validateUnits } = usePositionSizeHandlers(symbolData);
  const entryStrategy = watch("entryStrategy");
  const name = multiSide === "short" ? "unitsShort" : "units";
  const label = entryStrategy === "multi" ? `terminal.units.${multiSide}` : "terminal.units";
  return (
    <FormControl>
      <HelperLabel descriptionId="terminal.units.help" labelId={label} />
      <Box alignItems="center" display="flex">
        <CustomNumberInput
          name={name}
          onChange={unitsChange}
          placeholder={"0"}
          readOnly={entryStrategy === "multi"}
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
          <span className="balance">{formatPrice(baseBalance)}</span>
        )}
      </FormHelperText>
      {errors[name] && <span className="errorText">{errors[name].message}</span>}
    </FormControl>
  );
};

/**
 * @typedef {Object} StrategyPanelProps
 * @property {MarketSymbol} symbolData
 */

/**
 * Manual trading strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const StrategyPanel = (props) => {
  const { symbolData } = props;
  const { control, errors, register, watch } = useFormContext();
  const { formatMessage } = useIntl();
  const selectedExchange = useSelectedExchange();
  const { balance, loading } = useAvailableBalance(selectedExchange);
  const baseBalance = (balance && balance[symbolData.unitsAmount]) || 0;
  const quoteBalance = (balance && balance[symbolData.unitsInvestment]) || 0;

  const {
    positionSizeChange,
    realInvestmentChange,
    validatePositionSize,
    positionSizePercentageChange,
  } = usePositionSizeHandlers(symbolData);

  const entryType = watch("entryType");
  const entryStrategy = watch("entryStrategy");

  const { providerService } = useContext(TradingViewContext);
  const providerConsumedBalance = providerService ? providerService.providerConsumedBalance : 0;
  const providerAllocatedBalance = providerService ? providerService.providerPayableBalance : 0;
  const providerConsumedBalancePercentage = providerService
    ? providerService.providerConsumedBalancePercentage
    : 0;
  const isCopyProvider = providerService && providerService.providerId !== "1";

  const entryStrategyOptions = [
    { label: formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop_limit" },
  ];

  if (selectedExchange.exchangeType === "futures") {
    entryStrategyOptions.push({
      label: formatMessage({ id: "terminal.strategy.multi" }),
      val: "multi",
    });
  }

  if (!isCopyProvider) {
    entryStrategyOptions.push({
      label: formatMessage({ id: "terminal.strategy.import" }),
      val: "import",
    });
  }

  return (
    <Box bgcolor="grid.main" className={"panel strategyPanel expanded"}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.strategy" />
          </Typography>
          <Controller
            as={<CustomSelect label="" onChange={() => {}} options={entryStrategyOptions} />}
            control={control}
            defaultValue="limit"
            name="entryStrategy"
          />
        </Box>
      </Box>
      <Box className="panelContent" display="flex" flexDirection="row" flexWrap="wrap">
        {selectedExchange.exchangeType === "futures" && entryStrategy !== "multi" && (
          <FormControl className="entryType">
            <Controller
              as={
                <RadioGroup aria-label={formatMessage({ id: "terminal.entrytype" })}>
                  <FormControlLabel
                    control={<Radio />}
                    label={<FormattedMessage id="col.side.long" />}
                    value="LONG"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label={<FormattedMessage id="col.side.short" />}
                    value="SHORT"
                  />
                </RadioGroup>
              }
              control={control}
              defaultValue={entryType}
              name="entryType"
            />
          </FormControl>
        )}
        {entryStrategy === "stop_limit" && (
          <FormControl>
            <HelperLabel descriptionId="terminal.stopprice.help" labelId="terminal.stopprice" />
            <Box alignItems="center" display="flex">
              <CustomNumberInput
                name="stopPrice"
                rules={{
                  validate: (value) => !isNaN(value) && parseFloat(value) > 0,
                }}
                showErrorMessage={false}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
        )}
        {entryStrategy === "multi" && (
          <Alert severity="info">
            <FormattedMessage id="terminal.strategy.multi.info" />
            <br />
            <FormattedMessage id="terminal.strategy.multi.strategy" />
          </Alert>
        )}
        {entryStrategy !== "market" ? (
          entryStrategy === "multi" ? (
            <>
              <PriceControl multiSide="long" symbolData={symbolData} />
              <PriceControl multiSide="short" symbolData={symbolData} />
            </>
          ) : (
            <PriceControl symbolData={symbolData} />
          )
        ) : (
          <input name="price" ref={register} type="hidden" />
        )}
        {selectedExchange.exchangeType === "futures" && !isCopyProvider && (
          <FormControl>
            <HelperLabel descriptionId="terminal.realinvest.help" labelId="terminal.realinvest" />
            <Box alignItems="center" display="flex">
              <CustomNumberInput
                name="realInvestment"
                onChange={realInvestmentChange}
                placeholder={"0"}
                showErrorMessage={false}
              />
              <div className="currencyBox">{symbolData.unitsInvestment}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" />{" "}
              {loading ? (
                <CircularProgress color="primary" size={15} />
              ) : (
                <span className="balance">{formatPrice(quoteBalance)}</span>
              )}
            </FormHelperText>
          </FormControl>
        )}
        {!isCopyProvider && (
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
                  required: formatMessage({ id: "terminal.positionsize.required" }),
                  validate: validatePositionSize,
                }}
                showErrorMessage={false}
              />
              <div className="currencyBox">{symbolData.unitsInvestment}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" />{" "}
              {loading ? (
                <CircularProgress color="primary" size={15} />
              ) : (
                <span className="balance">{formatPrice(quoteBalance)}</span>
              )}
            </FormHelperText>
            {errors.positionSize && (
              <span className="errorText">{errors.positionSize.message}</span>
            )}
          </FormControl>
        )}
        {isCopyProvider && (
          <FormControl>
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
                <CustomNumberInput name="positionSizeAllocated" placeholder={"0"} readOnly={true} />
                <div className="currencyBox">{symbolData.unitsInvestment}</div>
              </Box>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.provider.allocated" />{" "}
              <span>{formatPrice(providerAllocatedBalance)}, </span>
              <FormattedMessage id="terminal.provider.consumed" />{" "}
              <span>{formatPrice(providerConsumedBalance)}, </span>
              <FormattedMessage id="terminal.provider.available" />{" "}
              <span>{formatFloat2Dec(100 - providerConsumedBalancePercentage)}%</span>
            </FormHelperText>
            {errors.positionSizePercentage && (
              <span className="errorText">{errors.positionSizePercentage.message}</span>
            )}
          </FormControl>
        )}
        {!isCopyProvider &&
          (entryStrategy === "multi" ? (
            <>
              <UnitsControl
                baseBalance={baseBalance}
                loading={loading}
                multiSide="long"
                symbolData={symbolData}
              />
              <UnitsControl
                baseBalance={baseBalance}
                loading={loading}
                multiSide="short"
                symbolData={symbolData}
              />
            </>
          ) : (
            <UnitsControl baseBalance={baseBalance} loading={loading} symbolData={symbolData} />
          ))}
        {selectedExchange.exchangeType === "futures" && <MarginButtons symbolData={symbolData} />}
        {["limit", "multi"].includes(entryStrategy) && (
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
            <PostOnlyControl />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(StrategyPanel);
