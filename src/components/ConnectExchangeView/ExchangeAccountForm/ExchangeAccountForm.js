import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Box,
  FormControlLabel,
  OutlinedInput,
  Typography,
  Switch,
  InputAdornment,
} from "@material-ui/core";
import "./ExchangeAccountForm.scss";
import { FormattedMessage, useIntl } from "react-intl";
import { Help } from "@material-ui/icons";
import CustomTooltip from "../../CustomTooltip";
import { Controller } from "react-hook-form";
import { uniqueId } from "lodash";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountForm = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      className="exchangeAccountForm"
      alignItems="flex-start"
    >
      {children}
    </Box>
  );
};

export const CustomInput = ({ inputRef, name, label, defaultValue, ...others }) => {
  const labelId = uniqueId();
  return (
    <Box display="flex" flexDirection="row" alignItems="center" className="controlWrapper">
      <label htmlFor={labelId}>
        <Typography className="accountLabel">
          <FormattedMessage id={label} />
        </Typography>
      </label>
      <OutlinedInput
        className="customInput"
        inputRef={inputRef}
        name={name}
        defaultValue={defaultValue || ""}
        {...others}
        id={labelId}
      />
    </Box>
  );
};

const SwitchInputComponent = ({ inputRef, name, defaultValue, type, unit }) => {
  const [checked, setChecked] = useState(!!defaultValue);

  return (
    <Box display="flex" flexDirection="row" alignItems="center" flex={1}>
      <Switch
        onChange={(e, checked) => {
          setChecked(checked);
        }}
        size="medium"
        className="switch"
        checked={checked}
      />
      {checked && (
        <OutlinedInput
          className="customInput"
          inputRef={inputRef}
          name={name}
          defaultValue={defaultValue || ""}
          endAdornment={unit ? <InputAdornment position="end">{unit}</InputAdornment> : null}
          type={type || "string"}
          multiline={type === "textarea"}
        />
      )}
    </Box>
  );
};

export const CustomSwitchInput = ({ inputRef, tooltip, label, defaultValue, name, type, unit }) => (
  <CustomSwitch
    tooltip={tooltip}
    label={label}
    // defaultValue={defaultValue}
    controlComponent={
      <SwitchInputComponent
        name={name}
        inputRef={inputRef}
        defaultValue={defaultValue}
        type={type}
        unit={unit}
      />
    }
  />
);
export const CustomSwitch = ({
  inputRef,
  tooltip,
  label,
  defaultValue,
  controlComponent,
  control,
  name,
}) => {
  const labelId = uniqueId();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" className="controlWrapper">
      <label htmlFor={labelId}>
        <Box display="flex" flexDirection="row">
          <Typography className="accountLabel">
            <FormattedMessage id={label} />
          </Typography>
          <CustomTooltip title={<FormattedMessage id={tooltip} />}>
            <Help />
          </CustomTooltip>
        </Box>
      </label>
      {controlComponent || (
        <Controller
          as={<Switch id={labelId} />}
          name={name}
          defaultValue={defaultValue}
          type="checkbox"
          control={control}
        />
      )}
    </Box>
  );
};

export default ExchangeAccountForm;
