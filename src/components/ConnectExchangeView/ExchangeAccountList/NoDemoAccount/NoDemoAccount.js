import React from "react";
import { Box } from "@material-ui/core";
import "./NoDemoAccount.scss";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../../CustomButton";
import { Typography } from "@material-ui/core";

/**
 * @typedef {Object} DefaultProps
 * @property {function} navigateToAction Callback to navigate to action.
 */

/**
 * Displays buttons to create demo exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const NoDemoAccount = ({ navigateToAction }) => {
  return (
    <Box className="noDemoAccount">
      <Box alignItems="center" display="flex" flexDirection="column">
        <Typography className="connectHead" variant="h3">
          <FormattedMessage id="accounts.connect.experiment" />
        </Typography>
        <CustomButton
          className="body2 textPurple borderPurple exchangeButton"
          onClick={() => navigateToAction("createDemoAccount")}
        >
          <FormattedMessage id="accounts.create.demo" />
        </CustomButton>
        <Typography variant="h4">
          <FormattedMessage id="accounts.connect.existing.or" />
        </Typography>
        <Typography className="body1 connectDesc" variant="h4">
          <FormattedMessage id="accounts.connect.first" />
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDemoAccount;
