import React, { useState, useCallback, useContext, useEffect } from "react";
import { Box, FormControlLabel, OutlinedInput, Typography, Switch } from "@material-ui/core";
import "./ExchangeAccountForm.scss";
import { FormattedMessage, useIntl } from "react-intl";
import { Help } from "@material-ui/icons";
import CustomTooltip from "../../CustomTooltip";

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

export const CustomInput = ({ inputRef, name, label, defaultValue, ...others }) => (
  <FormControlLabel
    control={
      <OutlinedInput
        className="customInput"
        inputRef={inputRef}
        name={name}
        defaultValue={defaultValue || ""}
        {...others}
      />
    }
    label={
      <Typography className="accountLabel">
        <FormattedMessage id={label} />
      </Typography>
    }
    labelPlacement="start"
  />
);

const SwitchInputComponent = ({ inputRef, defaultValue }) => {
  const [checked, setChecked] = useState(!!defaultValue);

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Switch
        onChange={(e, checked) => {
          setChecked(checked);
        }}
        size="small"
        className="switch"
        checked={checked}
      />
      {checked && (
        <OutlinedInput
          className="customInput"
          inputRef={inputRef}
          name={name}
          defaultValue={defaultValue || ""}
        />
      )}
    </Box>
  );
};

export const CustomSwitchInput = ({ inputRef, tooltip, label, defaultValue }) => (
  <>
    <FormControlLabel
      control={<SwitchInputComponent inputRef={inputRef} defaultValue={defaultValue} />}
      label={
        <Box display="flex" flexDirection="row" className="accountLabelWrapper">
          <Typography className="accountLabel">
            <FormattedMessage id={label} />
          </Typography>
          <CustomTooltip title={<FormattedMessage id={tooltip} />}>
            <Help />
          </CustomTooltip>
        </Box>
      }
      labelPlacement="start"
    />
  </>
);

export default ExchangeAccountForm;
