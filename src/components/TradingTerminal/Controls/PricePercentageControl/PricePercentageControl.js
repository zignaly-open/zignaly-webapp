import React from "react";
import { Box, Tooltip } from "@material-ui/core";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";
import "./PricePercentageControl.scss";
import { useIntl } from "react-intl";

/**
 * @typedef {Object} PricePercentage
 * @property {string} name
 * @property {function(*):*} onChange
 * @property {function(string): boolean|string} [validate]
 * @property {string} [error]
 * @property {boolean} [allowNegative]
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
  defaultPriority = "percentage",
  labelId,
  labelDescriptionId,
  status,
}) => {
  const { errors, register, watch, setValue } = useFormContext();
  const priorityValue = watch(priorityName, defaultPriority);
  const intl = useIntl();

  const togglePriority = () => {
    if (!disabled) {
      setValue(priorityName, priorityValue === "price" ? "percentage" : "price");
    }
  };

  return (
    <Box className="pricePercentageControl">
      <Box className="pricePercentageInputs" display="flex" flexDirection="row" flexWrap="wrap">
        <HelperLabel descriptionId={labelDescriptionId} labelId={labelId} />
        {status}
        <Box
          alignItems="center"
          className={`pricePercentageInput ${disabled ? "readOnly" : ""} ${
            priorityValue === "price" ? "disabled" : ""
          }`}
          display="flex"
          onClick={() => priorityValue === "price" && togglePriority()}
        >
          <CustomNumberInput
            allowNegative={Boolean(percentage.allowNegative)}
            disabled={disabled || priorityValue === "price"}
            name={percentage.name}
            onChange={percentage.onChange}
            rules={{
              validate: percentage.validate || {
                positive: (value) => value >= 0 || percentage.error,
              },
            }}
            showErrorMessage={false}
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
          className={`pricePercentageInput ${disabled ? "readOnly" : ""} ${
            priorityValue !== "price" ? "disabled" : ""
          }`}
          display="flex"
          onClick={() => priorityValue !== "price" && togglePriority()}
        >
          <CustomNumberInput
            disabled={disabled || priorityValue !== "price"}
            name={price.name}
            onChange={price.onChange}
            rules={{
              validate: price.validate || {
                positive: (value) => value >= 0 || price.error,
              },
            }}
            showErrorMessage={false}
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
