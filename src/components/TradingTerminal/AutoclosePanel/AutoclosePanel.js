import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import { isValidIntOrFloat } from "../../../utils/validators";
import "./AutoclosePanel.scss";

/**
 * Manual trading autoclose panel component.
 *
 * @returns {JSX.Element} Take profit panel element.
 */
const AutoclosePanel = () => {
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearErrors, errors, getValues, register, setError } = useFormContext();
  const { formatMessage } = useIntl();

  /**
   * Validate that autoclose time is greater than zero.
   *
   * @return {Void} None.
   */
  const autocloseChange = () => {
    const draftPosition = getValues();
    const autoclose = parseFloat(draftPosition.autoclose);

    clearErrors("autoclose");
    if (!isValidIntOrFloat(draftPosition.autoclose) || autoclose <= 0) {
      setError("autoclose", {
        type: "manual",
        message: formatMessage({ id: "terminal.autoclose.limit.zero" }),
      });
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
      clearErrors("autoclose");
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);

  return (
    <Box className={`panel autoclosePanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.timeautoclose" />
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
          <Box className="autoclose" display="flex" flexDirection="row" flexWrap="wrap">
            <HelperLabel
              descriptionId="terminal.timeautoclose.help"
              labelId="terminal.timeautoclose"
            />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="autoclose"
                onChange={autocloseChange}
              />
              <div className="currencyBox">
                <FormattedMessage id="terminal.hours" />
              </div>
            </Box>
            {displayFieldErrors("autoclose")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AutoclosePanel);
