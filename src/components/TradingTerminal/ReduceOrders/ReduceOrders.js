import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { lt, gt, isEqual, keys, size, values } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import {
  Button,
  Box,
  OutlinedInput,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useFormContext, Controller } from "react-hook-form";
import { formatFloat2Dec } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import { calculateDcaPrice } from "../../../utils/calculations";
import DCATargetStatus from "../DCATargetStatus/DCATargetStatus";
import usePositionEntry from "../../../hooks/usePositionEntry";
import { isValidIntOrFloat } from "../../../utils/validators";
import "./ReduceOrders.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} DCAPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {DCAPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const ReduceOrders = (props) => {
  const { positionEntity, symbolData } = props;
  const {
    clearErrors,
    errors,
    register,
    setError,
    setValue,
    getValues,
    watch,
    control,
    reset,
  } = useFormContext();
  //   const rebuyTargets = positionEntity ? positionEntity.reBuyTargets : {};
  const reduceOrders = values(positionEntity.reduceOrders);
  const { expanded, expandClass, expandableControl } = useExpandable(size(reduceOrders) > 0);

  const isCopy = positionEntity ? positionEntity.isCopyTrading : false;
  const isClosed = positionEntity ? positionEntity.closed : false;
  const isCopyTrader = positionEntity ? positionEntity.isCopyTrader : false;
  //   const isDoneTargetReached = cardinality >= 1 && cardinality - 1 < dcaRebuyDoneCount;
  const isUpdating = positionEntity ? positionEntity.updating : false;
  const isOpening = positionEntity ? positionEntity.status === 1 : false;
  const isReadOnly = (isCopy && !isCopyTrader) || isClosed || isUpdating || isOpening;
  //   const disableRemoveAction = isReadOnly || isDoneTargetReached || cardinality === 0;
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  /**
   * @type {array<number>}
   */
  const removeReduceOrder = watch("removeReduceOrder", []);
  const isRecurringPersistent = Boolean(
    reduceOrders.find(
      (o) => (o.recurring || o.persistent) && !removeReduceOrder.includes(o.targetId),
    ),
  );

  const removeAllReduceOrders = () => {
    if (!expanded) {
      const ids = reduceOrders.map((o) => o.targetId);
      setValue("removeReduceOrder", ids);
    }
  };

  useEffect(removeAllReduceOrders, [expanded]);

  const handleRemoveReduceOrder = (targetId) => {
    // const removeReduceOrder = [...getValues("removeReduceOrder")];
    const newRemoveReduceOrder = removeReduceOrder.concat(targetId);
    setValue("removeReduceOrder", newRemoveReduceOrder);
  };

  const displayReduceOrder = (order) => {
    if (removeReduceOrder.find((i) => i === order.targetId)) return null;

    const showRemove = !order.done && !isReadOnly;
    return (
      <Box className="targetGroup" key={order.targetId}>
        <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel
            descriptionId="terminal.reducestrategy.targetpercentage.help"
            labelId="terminal.target"
          />
          <DCATargetStatus dcaTarget={order} labelId="terminal.status" />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              disabled={true}
              value={order.targetPercentage}
              // name={composeTargetPropertyName("targetPricePercentage", order.targetId)}
              // onChange={targetPricePercentageChange}
            />
            <div className="currencyBox">%</div>
          </Box>
          {/* {displayTargetFieldErrors("targetPricePercentage", order.targetId)} */}
          <HelperLabel
            descriptionId="terminal.reducestrategy.availablePercentage.help"
            labelId="terminal.unitstoexit"
          />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              disabled={true}
              value={order.availablePercentage}
              // name={composeTargetPropertyName("rebuyPercentage", order.targetId)}
              // onChange={rebuyPercentageChange}
            />
            <div className="currencyBox">%</div>
          </Box>
        </Box>
        {/* {displayTargetFieldErrors("rebuyPercentage", order.targetId)} */}
        {showRemove && (
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            <Button
              className="removeTarget"
              //   data-target-id={index}
              onClick={() => handleRemoveReduceOrder(order.targetId)}
            >
              <RemoveCircle />
              <FormattedMessage id="terminal.target.remove" />
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className={`panel dcaPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.reduceorders" />
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {reduceOrders.map((order) => displayReduceOrder(order))}
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            {isRecurringPersistent && (
              <FormControlLabel
                control={
                  <Controller
                    control={control}
                    defaultValue={true}
                    name="removeReduceRecurringPersistent"
                    render={({ onChange, value }) => (
                      <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
                    )}
                  />
                }
                label={
                  //   <FormHelperText>
                  <FormattedMessage id="terminal.reducestrategy.persistentrecurring" />
                  //   </FormHelperText>
                }
                className="customCheckbox"
              />
            )}
            {/* {!disableRemoveAction && (
              <Button className="removeTarget" onClick={handleTargetRemove}>
                <RemoveCircle />
                <FormattedMessage id="terminal.target.remove" />
              </Button>
            )} */}
            {/* {!isReadOnly && (
              <Button className="addTarget" onClick={handleTargetAdd}>
                <AddCircle />
                <FormattedMessage id="terminal.target.add" />
              </Button>
            )} */}
          </Box>
          {/* {activeDcaIncreaseIndexes.map((targetId) => displayDcaTarget(targetId))} */}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ReduceOrders);
