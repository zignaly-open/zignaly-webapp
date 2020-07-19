import React, { useContext } from "react";
import { Box, useMediaQuery, Typography } from "@material-ui/core";
import "./ExchangeAccountTopBar.scss";
import { FormattedMessage } from "react-intl";
import ModalPathContext from "../../ModalPathContext";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import CustomButton from "../../../CustomButton";
import { useTheme } from "@material-ui/core/styles";
import { Settings, Sunset, Sunrise, Repeat } from "react-feather";
import CustomToolip from "../../../CustomTooltip";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} account Exchange account.
 */

/**
 * Provides data about the exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountTopBar = ({ account }) => {
  const storeSettings = useStoreSettingsSelector();
  const { navigateToPath } = useContext(ModalPathContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedExchangeInternalId = storeSettings.selectedExchange.internalId;

  return (
    <Box
      alignItems="center"
      className={`exchangeAccountTopBar ${
        selectedExchangeInternalId === account.internalId ? "active" : ""
      }`}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box alignItems="center" display="flex" flexDirection="row">
        <ExchangeIcon exchange={account.name.toLowerCase()} size="xlarge" />
        <Box className="accountName" display="flex" flexDirection="column">
          <Typography variant="h3">{account.internalName}</Typography>
          {selectedExchangeInternalId === account.internalId && (
            <Typography className="selected" variant="subtitle1">
              <FormattedMessage id="accounts.selected" />
            </Typography>
          )}
        </Box>
      </Box>
      <Box alignItems="center" className="actionsBox" display="flex" flexDirection="row">
        <CustomButton className="textDefault" onClick={() => navigateToPath("orders", account)}>
          {isMobile ? (
            <CustomToolip title={<FormattedMessage id="accounts.orders" />}>
              <Settings />
            </CustomToolip>
          ) : (
            <FormattedMessage id="accounts.orders" />
          )}
        </CustomButton>
        <CustomButton className="textDefault" onClick={() => navigateToPath("settings", account)}>
          {isMobile ? (
            <CustomToolip title={<FormattedMessage id="accounts.settings" />}>
              <Settings />
            </CustomToolip>
          ) : (
            <FormattedMessage id="accounts.settings" />
          )}
        </CustomButton>
        {account.isBrokerAccount && (
          <>
            <CustomButton
              className={isMobile ? "textDefault" : "textPurple"}
              onClick={() => navigateToPath("deposit", account)}
            >
              {isMobile ? (
                <CustomToolip title={<FormattedMessage id="accounts.deposit" />}>
                  <Sunset />
                </CustomToolip>
              ) : (
                <FormattedMessage id="accounts.deposit" />
              )}
            </CustomButton>
            <CustomButton
              className={isMobile ? "textDefault" : "textPurple"}
              onClick={() => navigateToPath("withdraw", account)}
            >
              {isMobile ? (
                <CustomToolip title={<FormattedMessage id="accounts.withdraw" />}>
                  <Sunrise />
                </CustomToolip>
              ) : (
                <FormattedMessage id="accounts.withdraw" />
              )}
            </CustomButton>
            <CustomButton
              className={isMobile ? "textDefault" : "textPurple"}
              onClick={() => navigateToPath("convert", account)}
            >
              {isMobile ? (
                <CustomToolip title={<FormattedMessage id="accounts.convert" />}>
                  <Repeat />
                </CustomToolip>
              ) : (
                <FormattedMessage id="accounts.convert" />
              )}
            </CustomButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExchangeAccountTopBar;
