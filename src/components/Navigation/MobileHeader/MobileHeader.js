import React, { useState } from "react";
import "./MobileHeader.scss";
import { Box, Grow, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import CustomButton from "../../CustomButton";
import Enabled from "../../../images/header/enabled.svg";
import EnabledWhite from "../../../images/header/enabledWhite.svg";
import Disabled from "../../../images/header/disabled.svg";
import DisabledWhite from "../../../images/header/disabledWhite.svg";
import UserExchangeList from "../Header/UserExchangeList";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const MobileHeader = () => {
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {boolean} Flag that indicates if darkStyle is enabled.
   */

  const selector = (state) => state.settings.darkStyle;
  const darkStyle = useSelector(selector);
  const [showBalance, setShowBalance] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <Box
      alignItems="center"
      className={"mobileHeader"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      {connected && (
        <Box
          alignItems="flex-start"
          className="connectedBox"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Box
            alignItems="center"
            className={"actionBox"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <UserExchangeList />
            <Box
              alignItems="center"
              className="iconBox"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              onClick={() => setShowBalance(!showBalance)}
            >
              {darkStyle && (
                <img
                  alt="zignaly"
                  className={"expandIcon"}
                  src={showBalance ? DisabledWhite : EnabledWhite}
                />
              )}
              {!darkStyle && (
                <img
                  alt="zignaly"
                  className={"expandIcon"}
                  src={showBalance ? Disabled : Enabled}
                />
              )}
              <Typography variant="h4">
                <FormattedMessage id="dashboard.balance" />
              </Typography>
            </Box>
          </Box>
          {showBalance && (
            <Grow in={true}>
              <Box
                alignItems="center"
                className="balanceContainer"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box
                  alignItems="flex-start"
                  className="balanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    <FormattedMessage id="balance.available" />
                  </Typography>
                  <Typography className="balance" variant="h5">
                    btc 0.256
                  </Typography>
                </Box>
                <Box
                  alignItems="flex-start"
                  className="balanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    <FormattedMessage id="balance.invested" />
                  </Typography>
                  <Typography className="balance" variant="h5">
                    btc 0.452
                  </Typography>
                </Box>
                <Box
                  alignItems="flex-start"
                  className="balanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    <FormattedMessage id="col.plnumber" />
                  </Typography>
                  <Typography className="balance green" variant="h5">
                    btc +0.47
                  </Typography>
                </Box>
              </Box>
            </Grow>
          )}
        </Box>
      )}
      {!connected && (
        <CustomButton className="headerButton" onClick={() => setConnected(true)}>
          Connect Account
        </CustomButton>
      )}
    </Box>
  );
};

export default MobileHeader;
