import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import Modal from "../../Modal";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserDailyBalance } from "../../../hooks/useStoreUserSelector";
import { LeverageForm } from "..";
import "./StrategyPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

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
  const { selectedExchange } = useStoreSettingsSelector();
  const dailyBalance = useStoreUserDailyBalance();
  const lastDayBalance = dailyBalance.balances[0] || null;
  const intl = useIntl();
  const storeSettings = useStoreSettingsSelector();
  const [modalVisible, setModalVisible] = useState(false);

  const leverage = watch("leverage");
  const {
    positionSizeChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
  } = usePositionSizeHandlers(symbolData);

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

  const entryStrategyOptions = [
    { label: intl.formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: intl.formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop-limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.import" }), val: "import" },
  ];

  const entryType = watch("entryType");
  const entryStrategy = watch("entryStrategy");
  const providerService = watch("providerService");
  const providerAllocatedBalance = watch("providerPayableBalance");
  const providerConsumedBalance = watch("providerConsumedBalance");
  const isCopyProvider = providerService && providerService !== "1";

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
        {selectedExchange.exchangeType === "futures" && (
          <FormControl className="entryType">
            <Controller
              as={
                <RadioGroup aria-label="Entry Type">
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
              }
              control={control}
              defaultValue={entryType}
              name="entryType"
            />
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
        {entryStrategy !== "market" ? (
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
        ) : (
          <input name="price" ref={register} type="hidden" />
        )}
        {selectedExchange.exchangeType === "futures" && !isCopyProvider && (
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
        {!isCopyProvider && (
          <FormControl>
            <HelperLabel
              descriptionId="terminal.position.size.help"
              labelId="terminal.position.size"
            />
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
        )}
        {isCopyProvider && (
          <FormControl>
            <HelperLabel
              descriptionId="terminal.position.sizepercentage.help"
              labelId="terminal.position.sizepercentage"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register({
                  required: "Position size percentage is required.",
                  validate: validatePositionSize,
                })}
                name="positionSizePercentage"
                onChange={positionSizeChange}
                placeholder={"0"}
              />
              <div className="currencyBox">%</div>
            </Box>
            <FormHelperText>
              Current allocated: {providerAllocatedBalance}, Using: {providerConsumedBalance}
            </FormHelperText>
            {errors.positionSize && (
              <span className="errorText">{errors.positionSize.message}</span>
            )}
          </FormControl>
        )}
        {!isCopyProvider && (
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
        )}
        {storeSettings.selectedExchange.exchangeType === "futures" && (
          <Box
            className="leverageButton"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            <Modal
              onClose={() => setModalVisible(false)}
              persist={false}
              size="small"
              state={modalVisible}
            >
              <LeverageForm max={125} min={1} />
            </Modal>
            <HelperLabel descriptionId="terminal.leverage.help" labelId="terminal.leverage" />
            <Button onClick={() => setModalVisible(true)}>{leverage}x</Button>
            <input name="leverage" ref={register} type="hidden" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StrategyPanel;
