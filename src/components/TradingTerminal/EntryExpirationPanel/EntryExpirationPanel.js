import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import "./EntryExpirationPanel.scss";

/**
 * Manual trading expiration panel component.
 *
 * @returns {JSX.Element} Take profit panel element.
 */
const EntryExpirationPanel = () => {
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearError, errors, getValues, register, setError } = useFormContext();
  const { formatMessage } = useIntl();

  /**
   * Validate that expiration time is greater than zero.
   *
   * @return {Void} None.
   */
  const expirationChange = () => {
    const draftPosition = getValues();
    const entryExpiration = parseFloat(draftPosition.entryExpiration);

    clearError("entryExpiration");
    if (isNaN(entryExpiration) || entryExpiration <= 0) {
      setError("entryExpiration", "error", formatMessage({ id: "terminal.expi.limit.zero" }));
    }
  };

  /**
   * Display property errors.
   *
   * @param {string} propertyName Property name to display errors for.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayFieldErrors = (propertyName) => {
    if (errors[propertyName]) {
      return <span className="errorText">{errors[propertyName].message}</span>;
    }

    return null;
  };

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      clearError("entryExpiration");
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel entryExpirationPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.entryexpiration" />
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
          <Box className="entryExpiration" display="flex" flexDirection="row" flexWrap="wrap">
            <HelperLabel
              descriptionId="terminal.entryexpiration.help"
              labelId="terminal.entryexpiration"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="entryExpiration"
                onChange={expirationChange}
              />
              <div className="currencyBox">
                <FormattedMessage id="terminal.minutes" />
              </div>
            </Box>
            {displayFieldErrors("entryExpiration")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(EntryExpirationPanel);
