import React from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import "./AutoclosePanel.scss";

/**
 * Manual trading autoclose panel component.
 *
 * @returns {JSX.Element} Take profit panel element.
 */
const AutoclosePanel = () => {
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearError, errors, getValues, register, setError } = useFormContext();

  /**
   * Validate that autoclose time is greater than zero.
   *
   * @return {Void} None.
   */
  const autocloseChange = () => {
    const draftPosition = getValues();
    const autoclose = parseFloat(draftPosition.autoclose);

    clearError("autoclose");
    if (isNaN(autoclose) || autoclose <= 0) {
      setError("autoclose", "error", "Autoclose hours must be greater than zero.");
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
              <div className="currencyBox">Hours</div>
            </Box>
            {displayFieldErrors("autoclose")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AutoclosePanel);
