import React, { useState } from "react";
import { Box, OutlinedInput, Typography, Switch, FormHelperText } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";

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
  const { errors, register, watch } = useFormContext();
  const priorityValue = watch(priority);

  // const [priority, setPriority]=useState('')
  return (
    <Box>
      <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
        <HelperLabel descriptionId={labelDescriptionId} labelId={labelId} />
        <Box alignItems="center" display="flex">
          <OutlinedInput
            className="outlineInput"
            disabled={disabled || priorityValue === "price"}
            inputRef={register({
              validate: percentage.validate,
            })}
            name={percentage.name}
            onChange={percentage.onChange}
          />
          <div className="currencyBox">%</div>
        </Box>
        <Box alignItems="center" display="flex">
          <OutlinedInput
            className="outlineInput"
            disabled={disabled || priorityValue !== "price"}
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
        <input name="priorityName" ref={register} type="hidden" />
      </Box>
      {errors[percentage.name] && (
        <span className="errorText">{errors[percentage.name].message}</span>
      )}
      {errors[price.name] && <span className="errorText">{errors[price.name].message}</span>}
    </Box>
  );
};

export default PricePercentageControl;
