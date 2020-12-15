import React, { useState, useEffect, useCallback, useContext } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../../CustomSelect";
import { useFormContext, Controller } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import {
  OutlinedInput,
  FormHelperText,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import "./ReduceStrategyPanel.scss";
import usePositionEntry from "../../../hooks/usePositionEntry";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import { formatPrice } from "../../../utils/formatters";
import useValidation from "../../../hooks/useValidation";
import { Alert } from "@material-ui/lab";
import TradingViewContext from "../TradingView/TradingViewContext";
import PostOnlyControl from "../Controls/PostOnlyControl/PostOnlyControl";

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
 * Manual trading reduce strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const ReduceStrategyPanel = (props) => {
  const { symbolData, positionEntity } = props;
  const [expand, setExpand] = useState(false);
  const expandClass = expand ? "expanded" : "collapsed";
  const { control, errors, register, watch, getValues, setValue, reset } = useFormContext();
  const { formatMessage } = useIntl();
  const { getEntryPrice, getEntrySize } = usePositionEntry(positionEntity);
  const [reduceTargetPrice, setReduceTargetPrice] = useState("");
  const [reduceTargetUnits, setReduceTargetUnits] = useState("");
  const { validPercentage } = useValidation();
  const { updatedAt } = useContext(TradingViewContext);

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

  /**
   * Validate target percentage and update price.
   *
   * @returns {void}
   */
  const reduceTargetPercentageChange = () => {
    const entryPrice = getEntryPrice();
    const draftPosition = getValues();
    const reduceTargetPercentage = parseFloat(draftPosition.reduceTargetPercentage);

    const targetPrice = entryPrice + (reduceTargetPercentage / 100) * entryPrice;
    setReduceTargetPrice(formatPrice(targetPrice.toString()));
  };

  /**
   * Validate units percentage and update units quantity.
   *
   * @returns {void}
   */
  const reduceAvailablePercentageChange = useCallback(() => {
    if (errors.reduceAvailablePercentage) return;

    const units = getEntrySize();
    const draftPosition = getValues();
    const reduceAvailablePercentage = parseFloat(draftPosition.reduceAvailablePercentage);

    const targetUnits = (reduceAvailablePercentage / 100) * units;
    setReduceTargetUnits(targetUnits.toString());
  }, [errors, getEntrySize, getValues]);

  // Watched inputs that affect components.
  const reduceRecurring = watch("reduceRecurring");

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
        reduceOrderType: "",
        reduceTargetPercentage: "",
        reduceAvailablePercentage: "",
        reduceRecurring: "",
        reducePersistent: "",
      });
    }
  };
  useEffectSkipFirst(emptyFieldsWhenCollapsed, [expand]);

  const orderTypeOptions = [
    {
      label: formatMessage({ id: "terminal.strategy.limit" }),
      val: "limit",
    },
  ];

  if (!reduceRecurring) {
    orderTypeOptions.push({
      label: formatMessage({ id: "terminal.strategy.market" }),
      val: "market",
    });
  }

  return (
    <Box className={`panel reduceStrategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch checked={expand} onChange={handleToggle} size="small" />
        <Typography variant="h5">
          <FormattedMessage id="terminal.reducestrategy" />
        </Typography>
      </Box>
      {expand && (
        <Box className="panelContent" display="flex" flexDirection="row" flexWrap="wrap">
          <Alert className="tpsWarning" severity="warning">
            <FormattedMessage id="terminal.reducestrategy.tpwarning" />
          </Alert>
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
                error={!!errors.reduceTargetPercentage}
                inputRef={register({
                  validate: (value) =>
                    !isNaN(value) ||
                    formatMessage({ id: "terminal.reducestrategy.percentage.error" }),
                })}
                name="reduceTargetPercentage"
                onChange={reduceTargetPercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" disabled={true} value={reduceTargetPrice} />
              <div className="currencyBox">{symbolData.unitsInvestment}</div>
            </Box>
          </Box>
          {errors.reduceTargetPercentage && (
            <span className="errorText">{errors.reduceTargetPercentage.message}</span>
          )}

          <Box
            alignItems="flex-start"
            className="targetUnits"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
          >
            <HelperLabel
              descriptionId="terminal.reducestrategy.availablePercentage.help"
              labelId="terminal.reducestrategy.availablePercentage"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                error={!!errors.reduceAvailablePercentage}
                inputRef={register({
                  validate: {
                    percentage: (value) =>
                      validPercentage(value, "terminal.reducestrategy.percentage.limit"),
                  },
                })}
                name="reduceAvailablePercentage"
                onChange={reduceAvailablePercentageChange}
              />
              <div className="currencyBox">%</div>
            </Box>
            <Box alignItems="flex-start" display="flex" flexDirection="column">
              <Box display="flex" flexDirection="row">
                <OutlinedInput className="outlineInput" disabled={true} value={reduceTargetUnits} />
                <div className="currencyBox">{symbolData.unitsAmount}</div>
              </Box>
              <FormHelperText>
                <FormattedMessage id="terminal.available" />{" "}
                <span className="balance">{formatPrice(positionEntity.availableAmount)}</span>
              </FormHelperText>
            </Box>
            {errors.reduceAvailablePercentage && (
              <span className="errorText">{errors.reduceAvailablePercentage.message}</span>
            )}
          </Box>

          <FormControlLabel
            className="customCheckbox"
            control={
              <Controller
                control={control}
                defaultValue={false}
                name="reduceRecurring"
                render={({ onChange, value }) => (
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      setValue("reduceOrderType", "limit");
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
          />
          <FormControlLabel
            className="customCheckbox"
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
          />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="start">
            <PostOnlyControl name="reducePostOnly" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ReduceStrategyPanel);
