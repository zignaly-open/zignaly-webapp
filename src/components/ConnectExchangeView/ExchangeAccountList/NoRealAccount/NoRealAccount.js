import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import "./NoRealAccount.scss";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../../CustomButton";
import { Typography } from "@material-ui/core";
import ModalPathContext from "../../ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {function} navigateToAction Callback to navigate to action.
 */

/**
 * Displays buttons to connect or create real exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const NoRealAccount = () => {
  const { navigateToPath } = useContext(ModalPathContext);
  return (
    <Box className="noRealAccount">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" className="connectHead">
          <FormattedMessage id="accounts.connect" />
        </Typography>
        <Typography variant="h4" className="body1 connectDesc">
          <FormattedMessage id="accounts.connect.first" />
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className="exchangeButtons"
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">
            <FormattedMessage id="accounts.connect.noaccount" />
          </Typography>
          <CustomButton
            className="body2 bgPurple exchangeButton"
            onClick={() => navigateToPath("createAccount")}
          >
            <FormattedMessage id="accounts.create.exchange" />
          </CustomButton>
          <Box className="exchangeSubtitle">
            <FormattedMessage id="accounts.powered" />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">
            <FormattedMessage id="accounts.connect.haveaccount" />
          </Typography>
          <CustomButton
            className="body2 textPurple borderPurple exchangeButton"
            onClick={() => navigateToPath("connectAccount")}
          >
            <FormattedMessage id="accounts.connect.existing" />
          </CustomButton>
          <Box className="exchangeSubtitle">
            <FormattedMessage id="accounts.exchanges" />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">
            <FormattedMessage id="accounts.connect.experiment" />
          </Typography>
          <CustomButton
            className="body2 textPurple exchangeButton"
            onClick={() => navigateToPath("createDemoAccount")}
          >
            <FormattedMessage id="accounts.create.demo" />
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NoRealAccount;
