import React, { useState } from "react";
import { Box, OutlinedInput, Typography, Switch, FormHelperText } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";
import "./PricePercentageControl.scss";

/**
 * @typedef {Object} PricePercentage
 * @property {string} name
 * @property {function} onChange
 * @property {function} [validate]
 * @property {string} [error]
 */

/**
 * @param {Object} props Props
 * @param {PricePercentage} props.percentage
 * @param {PricePercentage} props.price
 * @param {boolean} props.disabled
 * @param {string} props.quote
 * @param {string} props.priority
 * @param {string} props.labelDescriptionId
 * @param {string} props.labelId
 * @returns {JSX.Element} JSX
 */
const PricePercentageControl = ({
  percentage,
  price,
  disabled,
  quote,
  priority,
  labelId,
  labelDescriptionId,
}) => {
  const { errors, register, watch, setValue } = useFormContext();
  const priorityValue = watch(priority);
  console.log(priorityValue);

  const togglePriority = () => {
    setValue(priority, priorityValue === "price" ? "percentage" : "price");
  };

  // const [priority, setPriority]=useState('')
  return (
    <Box className="pricePercentageControl">
      <Box className="pricePercentageInputs" display="flex" flexDirection="row" flexWrap="wrap">
        <HelperLabel descriptionId={labelDescriptionId} labelId={labelId} />
        <Box
          alignItems="center"
          display="flex"
          className={`pricePercentageInput ${priorityValue === "price" ? "disabled" : ""}`}
          onClick={() => priorityValue === "price" && togglePriority()}
        >
          <OutlinedInput
            className="outlineInput"
            readOnly={disabled || priorityValue === "price"}
            inputRef={register({
              validate: percentage.validate,
            })}
            name={percentage.name}
            onChange={percentage.onChange}
          />
          <div className="currencyBox">%</div>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          className={`pricePercentageInput ${priorityValue !== "price" ? "disabled" : ""}`}
          onClick={() => priorityValue !== "price" && togglePriority()}
        >
          <OutlinedInput
            className="outlineInput"
            readOnly={disabled || priorityValue !== "price"}
            inputRef={register({
              validate: {
                positive: (value) => value >= 0 || price.error,
              },
            })}
            name={price.name}
            onChange={price.onChange}
          />
          <div className="currencyBox">{quote}</div>
        </Box>
        <input name={priority} ref={register} type="hidden" />
      </Box>
      {errors[percentage.name] && (
        <span className="errorText">{errors[percentage.name].message}</span>
      )}
      {errors[price.name] && <span className="errorText">{errors[price.name].message}</span>}
    </Box>
  );
};

export default PricePercentageControl;
