import React from "react";
import { Box } from "@material-ui/core";
import "./NoDemoAccount.scss";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../../CustomButton";
import { Typography } from "@material-ui/core";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Exchange internal Id.
 */

/**
 * Provides data about the exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const NoDemoAccount = ({ internalId }) => {
  return (
    <Box className="noDemoAccount">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3" className="connectHead">
          <FormattedMessage id="accounts.connect.experiment" />
        </Typography>
        <CustomButton className="body2 textPurple borderPurple">
          <FormattedMessage id="accounts.create.demo" />
        </CustomButton>
        <Typography variant="h4">
          <FormattedMessage id="accounts.connect.existing.or" />
        </Typography>
        <Typography variant="h4" className="body1 connectDesc">
          <FormattedMessage id="accounts.connect.first" />
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDemoAccount;
