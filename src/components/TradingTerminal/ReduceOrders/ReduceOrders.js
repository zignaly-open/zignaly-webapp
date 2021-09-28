import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { size, values } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import {
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Tooltip,
  Switch,
} from "@material-ui/core";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import { RemoveCircle, Help } from "@material-ui/icons";
import { useFormContext, Controller } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import "./ReduceOrders.scss";
import { colors } from "../../../services/theme";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";

/**
 * @typedef {Object} ReduceOrderStatusProps
 * @property {string} labelId Status label translation text ID.
 * @property {ReduceOrder} order Position reduce order.
 */

/**
 * Orders status label with detailed description tooltip.
 *
 * @param {ReduceOrderStatusProps} props Component props.
 * @returns {JSX.Element} Helper label with description in tooltip element.
 */
const ReduceOrderStatus = (props) => {
  const { order, labelId } = props;
  const { formatMessage } = useIntl();
  let iconColor = colors.darkGrey;
  let description = formatMessage({ id: "terminal.status.pending" });

  if (!order.done && order.orderId) {
    description = formatMessage({ id: "terminal.status.placed" }, { orderId: order.orderId });
    iconColor = colors.blue;
  } else if (order.done && order.orderId) {
    description = formatMessage({ id: "terminal.status.done" });
    iconColor = colors.green;
  } else if (order.errorMSG) {
    description = order.errorMSG;
    iconColor = colors.red;
  }

  return (
    <Box alignItems="center" className="targetStatus" display="flex" justifyContent="flex-end">
      <FormHelperText>
        <FormattedMessage id={labelId} />
      </FormHelperText>
      <Tooltip arrow enterTouchDelay={50} placement="left-end" title={description}>
        <Help style={{ fill: iconColor }} />
      </Tooltip>
    </Box>
  );
};

/**
 * @typedef {Object} ReduceOrdersProps
 * @property {Position} positionEntity Position entity for position edit trading view.
 * @property {boolean} [isReadOnly] Flag to disable edition.
 */

/**
 * Manual trading reduce orders panel component.
 *
 * @param {ReduceOrdersProps} props Component props.
 * @returns {JSX.Element} Reduce Orders panel element.
 */
const ReduceOrders = (props) => {
  const { positionEntity, isReadOnly = false } = props;
  const { setValue, watch, control, register, unregister } = useFormContext();
  const reduceOrders = values(positionEntity.reduceOrders);
  const { expanded, expandClass, setExpanded } = useExpandable(size(reduceOrders) > 0);
  const isClosed = positionEntity ? positionEntity.closed : false;

  /**
   * @type {Array<number>}
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

  /**
   * Remove reduce order
   * @param {number} targetId targetId
   * @returns {void}
   */
  const handleRemoveReduceOrder = (targetId) => {
    const newRemoveReduceOrder = removeReduceOrder.concat(targetId);
    setValue("removeReduceOrder", newRemoveReduceOrder);
  };

  // Register special form element to store removed orders
  useEffect(() => {
    register("removeReduceOrder");
    return () => unregister("removeReduceOrder");
  }, [register, unregister]);

  // Automatically expand/collpase panel depending on current reduce orders amount.
  const autoExpandCollapse = () => {
    setExpanded(Boolean(reduceOrders.length));
  };
  useEffect(autoExpandCollapse, [reduceOrders.length]);

  /**
   * Render a reduce order
   * @param {ReduceOrder} order Reduce order
   * @returns {JSX.Element} JSX
   */
  const displayReduceOrder = (order) => {
    if (removeReduceOrder.find((i) => i === order.targetId)) {
      return null;
    }

    const showRemove = !order.done && !isReadOnly;
    return (
      <Box className="targetGroup" key={order.targetId}>
        <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel
            descriptionId="terminal.reducestrategy.targetpercentage.help"
            labelId="terminal.target"
          />
          <ReduceOrderStatus labelId="terminal.status" order={order} />
          <Box alignItems="center" className="percentageBox" display="flex">
            <CustomNumberInput
              disabled={true}
              name=""
              value={formatFloat2Dec(order.targetPercentage)}
            />
            <div className="currencyBox">%</div>
          </Box>
          <Box alignItems="center" className="valueBox" display="flex">
            <CustomNumberInput disabled={true} name="" value={formatPrice(order.price)} />
            <div className="currencyBox">{positionEntity.quote}</div>
          </Box>
        </Box>
        <Box className="targetUnits" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel
            descriptionId="terminal.reducestrategy.availablePercentage.help"
            labelId="terminal.reducestrategy.availablePercentage"
          />
          <Box alignItems="center" className="percentageBox" display="flex">
            <CustomNumberInput
              disabled={true}
              name=""
              value={formatFloat2Dec(order.availablePercentage)}
            />
            <div className="currencyBox">%</div>
          </Box>
          <Box alignItems="center" className="valueBox" display="flex">
            <CustomNumberInput disabled={true} name="" value={formatPrice(order.amount)} />
            <div className="currencyBox">{positionEntity.base}</div>
          </Box>
        </Box>
        {showRemove && (
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            <Button
              className="removeTarget"
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
    <Box className={`panel reduceOrders ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && (
          <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
        )}
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
                className="customCheckbox"
                control={
                  <Controller
                    control={control}
                    defaultValue={true}
                    name="reduceRecurringPersistent"
                    render={({ onChange, value }) => (
                      <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
                    )}
                  />
                }
                label={<FormattedMessage id="terminal.reducestrategy.persistentrecurring" />}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ReduceOrders);
