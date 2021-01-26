import React, { useState } from "react";
import "./MobileHeader.scss";
import { Box, Typography } from "@material-ui/core";
import Enabled from "../../../images/header/enabled.svg";
import EnabledWhite from "../../../images/header/enabledWhite.svg";
import Disabled from "../../../images/header/disabled.svg";
import DisabledWhite from "../../../images/header/disabledWhite.svg";
import MobileExchangeList from "./MobileExchangeList";
import BalanceBox from "../Header/TopBalance";
import { FormattedMessage } from "react-intl";
import ConnectExchangeButton from "../Header/ConnectExchangeButton";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

const MobileHeader = () => {
  const storeSettings = useStoreSettingsSelector();
  const [showBalance, setShowBalance] = useState(false);
  const exchangeConnections = useStoreUserExchangeConnections();

  return (
    <Box
      alignItems="center"
      className={"mobileHeader"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      {exchangeConnections.length > 0 && (
        <Box
          alignItems="flex-start"
          className="connectedBox"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Box
            alignItems="center"
            className="actionBox"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <MobileExchangeList />
            <Box
              alignItems="center"
              className="iconBox"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              onClick={() => setShowBalance(!showBalance)}
            >
              {storeSettings.darkStyle && (
                <img
                  alt="zignaly"
                  className="expandIcon"
                  src={showBalance ? DisabledWhite : EnabledWhite}
                />
              )}
              {!storeSettings.darkStyle && (
                <img alt="zignaly" className="expandIcon" src={showBalance ? Disabled : Enabled} />
              )}
              <Typography variant="h4">
                <FormattedMessage id="dashboard.balance" />
              </Typography>
            </Box>
          </Box>
          {showBalance && <BalanceBox />}
        </Box>
      )}
      {exchangeConnections.length === 0 && <ConnectExchangeButton />}
    </Box>
  );
};

export default MobileHeader;
