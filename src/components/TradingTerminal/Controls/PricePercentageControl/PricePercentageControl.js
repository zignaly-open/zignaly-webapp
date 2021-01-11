import React from "react";
import { Box, OutlinedInput } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";
import "./PricePercentageControl.scss";

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
 * @param {string} props.priority Price or Percentage based priority.
 * @param {string} props.priorityName Priority param name.
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
  labelId,
  labelDescriptionId,
  status,
}) => {
  const { errors, register, watch, setValue } = useFormContext();
  const priorityValue = watch(priorityName);

  const togglePriority = () => {
    setValue(priorityName, priorityValue === "price" ? "percentage" : "price");
  };

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
          <div className="currencyBox">%</div>
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
          <div className="currencyBox">{quote}</div>
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
