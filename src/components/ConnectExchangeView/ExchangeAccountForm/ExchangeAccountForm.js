import React, { useState } from "react";
import { Box, OutlinedInput, Typography, Switch, InputAdornment } from "@material-ui/core";
import "./ExchangeAccountForm.scss";
import { FormattedMessage } from "react-intl";
import { Help } from "@material-ui/icons";
import CustomTooltip from "../../CustomTooltip";
import { Controller, useFormContext } from "react-hook-form";

/**
 * @typedef {import("@material-ui/core").OutlinedInputProps} OutlinedInputProps
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * Form wrapper to provider controls styling.
 * @typedef {Object} DefaultProps
 * @property {React.ReactNode} children Form content.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountForm = ({ children }) => {
  return (
    <Box
      alignItems="flex-start"
      className="exchangeAccountForm"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  );
};

/**
 * @typedef {Object} CustomInputProps
 * @property {string} label
 */

/**
 * @typedef {CustomInputProps & OutlinedInputProps} CustomInputPropsExtended
 */

/**
 * @param {CustomInputPropsExtended} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
export const CustomInput = ({ inputRef, name, label, defaultValue, ...others }) => {
  const { errors } = useFormContext();

  return (
    <Box alignItems="center" className="controlWrapper" display="flex" flexDirection="row">
      <label htmlFor={name}>
        <Typography className="accountLabel">
          <FormattedMessage id={label} />
        </Typography>
      </label>
      <Box width={1}>
        <OutlinedInput
          className="customInput"
          defaultValue={defaultValue || ""}
          id={name}
          inputRef={inputRef}
          name={name}
          {...others}
        />
        {errors && errors[name] && <span className="errorText">{errors[name].message}</span>}
      </Box>
    </Box>
  );
};

/**
 * @typedef {Object} SwitchInputComponentProps
 * @property {string} unit
 */

/**
 * @typedef {SwitchInputComponentProps & OutlinedInputProps} SwitchInputComponentPropsExtended
 */

/**
 * @param {SwitchInputComponentPropsExtended} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const SwitchInputComponent = ({ inputRef, name, defaultValue, type, unit }) => {
  const [checked, setChecked] = useState(!!defaultValue);

  return (
    <Box alignItems="center" display="flex" flex={1} flexDirection="row">
      <Switch
        checked={checked}
        className="switch"
        onChange={(e, value) => {
          setChecked(value);
        }}
        size="medium"
      />
      {checked && (
        <OutlinedInput
          className="customInput"
          defaultValue={defaultValue || ""}
          endAdornment={unit ? <InputAdornment position="end">{unit}</InputAdornment> : null}
          inputRef={inputRef}
          multiline={type === "textarea"}
          name={name}
          rows="5"
          type={type || "string"}
        />
      )}
    </Box>
  );
};

/**
 * @typedef {Object} CustomSwitchInputProps
 * @property {string} tooltip
 * @property {string} label
 * @property {string} [unit]
 */

/**
 * @typedef {CustomSwitchInputProps & OutlinedInputProps} CustomSwitchInputPropsExtended
 */

/**
 * @param {CustomSwitchInputPropsExtended} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
export const CustomSwitchInput = ({ inputRef, tooltip, label, defaultValue, name, type, unit }) => (
  <CustomSwitch
    controlComponent={
      <SwitchInputComponent
        defaultValue={defaultValue}
        inputRef={inputRef}
        name={name}
        type={type}
        unit={unit}
      />
    }
    label={label}
    // defaultValue={defaultValue}
    tooltip={tooltip}
    type={type}
  />
);

/**
 * @typedef {Object} CustomSwitchProps
 * @property {string} [tooltip]
 * @property {string} label
 * @property {React.ReactElement} [controlComponent]
 */

/**
 * @typedef {CustomSwitchProps & OutlinedInputProps} CustomSwitchPropsExtended
 */

/**
 * @param {CustomSwitchPropsExtended} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
export const CustomSwitch = ({ tooltip, label, defaultValue, controlComponent, name, type }) => {
  const { control } = useFormContext();

  return (
    <Box
      alignItems="center"
      className={`controlWrapper ${type === "textarea" ? "textareaWrapper" : ""}`}
      display="flex"
      flexDirection="row"
    >
      <label htmlFor={name}>
        <Box display="flex" flexDirection="row">
          <Typography className="accountLabel">
            <FormattedMessage id={label} />
          </Typography>
          {tooltip && (
            <CustomTooltip title={<FormattedMessage id={tooltip} />}>
              <Help />
            </CustomTooltip>
          )}
        </Box>
      </label>
      {controlComponent || (
        <Controller
          control={control}
          defaultValue={defaultValue}
          name={name}
          render={({ onChange, onBlur, value }) => (
            <Switch checked={value} onBlur={onBlur} onChange={(e) => onChange(e.target.checked)} />
          )}
        />
      )}
    </Box>
  );
};

export default ExchangeAccountForm;
