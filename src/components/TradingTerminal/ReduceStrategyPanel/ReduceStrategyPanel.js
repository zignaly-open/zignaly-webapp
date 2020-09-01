import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useAvailableBalance from "../../../hooks/useAvailableBalance";
import {
  OutlinedInput,
  FormHelperText,
  FormControl,
  Switch,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import "./ReduceStrategyPanel.scss";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";
import useOwnCopyTraderProviders from "../../../hooks/useOwnCopyTraderProviders";
import { formatPrice } from "../../../utils/formatters";
import { CircularProgress } from "@material-ui/core";
import usePositionEntry from "../../../hooks/usePositionEntry";
import { isValidIntOrFloat } from "../../../utils/validators";

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
const ReduceStrategyPanel = (props) => {
  const { symbolData, positionEntity } = props;
  const [expand, setExpand] = useState(false);
  const expandClass = expand ? "expanded" : "collapsed";
  const { control, errors, register, watch, getValues, setError, setValue } = useFormContext();
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
  const { getEntryPrice, getEntrySize } = usePositionEntry(positionEntity);
  const [reduceTargetPrice, setReduceTargetPrice] = useState("");
  const [reduceTargetUnits, setReduceTargetUnits] = useState("");

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

  const validatePercentage = (percentage, name) => {
    if (!isValidIntOrFloat(percentage) || percentage <= 0 || percentage > 100) {
      setError(name, {
        type: "manual",
        message: formatMessage({ id: "terminal.reducestrategy.percentage.limit" }),
      });

      return false;
    }
    return true;
  };

  /**
   * Validate result of changed target units event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Input change event.
   * @returns {boolean} true if validation passed, false otherwise.
   */
  const reduceTargetPercentageChange = () => {
    const entryPrice = getEntryPrice();
    const draftPosition = getValues();
    const reduceTargetPercentage = parseFloat(draftPosition.reduceTargetPercentage);

    if (!isValidIntOrFloat(reduceTargetPercentage)) {
      setError("reduceTargetPercentage", {
        type: "manual",
        message: formatMessage({ id: "terminal.reducestrategy.percentage.limit" }),
      });

      return;
    }

    const valid = validatePercentage(reduceTargetPercentage, "reduceTargetPercentage");
    const targetPrice = valid ? (reduceTargetPercentage / 100) * entryPrice : "";
    setReduceTargetPrice(targetPrice.toString());
  };

  const reduceAvailablePercentageChange = () => {
    const units = getEntrySize();
    const draftPosition = getValues();
    const reduceAvailablePercentage = parseFloat(draftPosition.reduceAvailablePercentage);

    const valid = validatePercentage(reduceAvailablePercentage, "reduceAvailablePercentage");
    const targetUnits = valid ? (reduceAvailablePercentage / 100) * units : "";
    setReduceTargetUnits(targetUnits.toString());
  };

  const reduceRecurring = watch("reduceRecurring");

  const orderTypeOptions = [
    {
      label: formatMessage({ id: "terminal.strategy.market" }),
      val: "market",
    },
  ];

  if (!reduceRecurring) {
    orderTypeOptions.push({
      label: formatMessage({ id: "terminal.strategy.limit" }),
      val: "limit",
    });
  }

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

  // Don't render when not granted to increase position.
  if (isDisabled) {
    return null;
  }

  return (
    <Box className={`panel reduceStrategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch defaultChecked={expand} onChange={handleToggle} size="small" />
        <Typography variant="h5">
          <FormattedMessage id="terminal.reducestrategy" />
        </Typography>
        {/* <input name="lastPrice" ref={register} type="hidden" /> */}
      </Box>
      {expand && (
        <Box className="panelContent" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel descriptionId="terminal.reducestrategy.help" labelId="terminal.entrytype" />
          <Controller
            as={<CustomSelect label="" onChange={() => {}} options={orderTypeOptions} />}
            control={control}
            defaultValue="limit"
            name="reduceOrderType"
          />

          <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
            <HelperLabel
              descriptionId="terminal.reducestrategy.targetpercentage.help"
              labelId="terminal.target"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                disabled={isReadOnly}
                inputRef={register}
                name="reduceTargetPercentage"
                onChange={reduceTargetPercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" disabled={true} value={reduceTargetPrice} />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </Box>
          {errors.reduceTargetPercentage && (
            <span className="errorText">{errors.reduceTargetPercentage.message}</span>
          )}

          <Box
            className="targetUnits"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            alignItems="flex-start"
          >
            <HelperLabel
              descriptionId="terminal.reducestrategy.availablePercentage.help"
              labelId="terminal.unitstoexit"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                disabled={isReadOnly}
                name="reduceAvailablePercentage"
                onChange={reduceAvailablePercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Box display="flex" flexDirection="row">
                <OutlinedInput className="outlineInput" disabled={true} value={reduceTargetUnits} />
                <div className="currencyBox">{symbolData.base}</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.available" />{" "}
                <span className="balance">{getEntrySize()}</span>
              </FormHelperText>
            </Box>
            {errors.reduceAvailablePercentage && (
              <span className="errorText">{errors.reduceAvailablePercentage.message}</span>
            )}
          </Box>

          <FormControlLabel
            control={
              <Controller
                control={control}
                defaultValue={false}
                name="reduceRecurring"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      setValue("reduceOrderType", "market");
                      onChange(e.target.checked);
                    }}
                  />
                )}
              />
            }
            label={
              <HelperLabel
                descriptionId="terminal.reducestrategy.recurring.help"
                labelId="terminal.reducestrategy.recurring"
              />
            }
            className="customCheckbox"
          />
          <FormControlLabel
            control={
              <Controller
                control={control}
                defaultValue={false}
                name="reducePersistent"
                render={({ onChange, value }) => (
                  <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
                )}
              />
            }
            label={
              <HelperLabel
                descriptionId="terminal.reducestrategy.persistent.help"
                labelId="terminal.reducestrategy.persistent"
              />
            }
            className="customCheckbox"
          />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ReduceStrategyPanel);
