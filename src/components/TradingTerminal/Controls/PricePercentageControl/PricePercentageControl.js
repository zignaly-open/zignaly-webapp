import React from "react";
import { Box, OutlinedInput, Tooltip } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";
import "./PricePercentageControl.scss";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} PricePercentage
 * @property {string} name
 * @property {function(*):*} onChange
 * @property {function(string): boolean} [validate]
 * @property {string} [error]
 */

/**
 * @param {Object} props Props
 * @param {PricePercentage} props.percentage Percentage data.
 * @param {PricePercentage} props.price Price data.
 * @param {boolean} props.disabled Disabled boolean.
 * @param {string} props.quote Price Quote.
 * @param {string} props.priorityName Price or Percentage based priority param name.
 * @param {string} [props.defaultPriority] Default price priority.
 * @param {string} props.labelDescriptionId Label tooltip.
 * @param {string} props.labelId Label.
 * @param {JSX.Element} [props.status] Label status.
 * @returns {JSX.Element} JSX
 */
const PricePercentageControl = ({
  percentage,
  price,
  disabled,
  quote,
  priorityName,
  defaultPriority,
  labelId,
  labelDescriptionId,
  status,
}) => {
  const { errors, register, watch, setValue } = useFormContext();
  const priorityValue = watch(priorityName, defaultPriority);
  const intl = useIntl();

  const togglePriority = () => {
    setValue(priorityName, priorityValue === "price" ? "percentage" : "price");
  };
  console.log(priorityValue);

  return (
    <Box className="pricePercentageControl">
      <Box className="pricePercentageInputs" display="flex" flexDirection="row" flexWrap="wrap">
        <HelperLabel descriptionId={labelDescriptionId} labelId={labelId} />
        {status}
        <Box
          alignItems="center"
          className={`pricePercentageInput ${priorityValue === "price" ? "disabled" : ""}`}
          display="flex"
          onClick={() => priorityValue === "price" && togglePriority()}
        >
          <OutlinedInput
            className="outlineInput"
            inputRef={register({
              validate: percentage.validate || {
                positive: (value) => value >= 0 || percentage.error,
              },
            })}
            name={percentage.name}
            onChange={percentage.onChange}
            readOnly={disabled || priorityValue === "price"}
          />
          <Tooltip
            arrow
            enterTouchDelay={50}
            placement="left-end"
            title={intl.formatMessage({ id: "terminal.percentage.priority.help" })}
          >
            <div className="currencyBox">
              % {priorityValue !== "price" && <span className="dot" />}
            </div>
          </Tooltip>
        </Box>
        <Box
          alignItems="center"
          className={`pricePercentageInput ${priorityValue !== "price" ? "disabled" : ""}`}
          display="flex"
          onClick={() => priorityValue !== "price" && togglePriority()}
        >
          <OutlinedInput
            className="outlineInput"
            inputRef={register({
              validate: price.validate || {
                positive: (value) => value >= 0 || price.error,
              },
            })}
            name={price.name}
            onChange={price.onChange}
            readOnly={disabled || priorityValue !== "price"}
          />
          <Tooltip
            arrow
            enterTouchDelay={50}
            placement="left-end"
            title={intl.formatMessage({ id: "terminal.price.priority.help" })}
          >
            <div className="currencyBox">
              {quote} {priorityValue === "price" && <span className="dot" />}
            </div>
          </Tooltip>
        </Box>
        <input name={priorityName} ref={register} type="hidden" />
      </Box>
      {errors[percentage.name] && (
        <span className="errorText">{errors[percentage.name].message}</span>
      )}
      {errors[price.name] && <span className="errorText">{errors[price.name].message}</span>}
    </Box>
  );
};

export default PricePercentageControl;
