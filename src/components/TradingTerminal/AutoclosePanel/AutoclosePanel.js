import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, Typography, Switch } from "@mui/material";
import CustomNumberInput from "components/Forms/CustomNumberInput";
import { useFormContext } from "react-hook-form";
import useExpandable from "../../../hooks/useExpandable";
import "./AutoclosePanel.scss";

/**
 * Manual trading autoclose panel component.
 *
 * @returns {JSX.Element} Take profit panel element.
 */
const AutoclosePanel = () => {
  const { expanded, expandClass, setExpanded } = useExpandable();
  const { clearErrors, errors } = useFormContext();

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
        <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
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
              <CustomNumberInput name="autoclose" />
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
