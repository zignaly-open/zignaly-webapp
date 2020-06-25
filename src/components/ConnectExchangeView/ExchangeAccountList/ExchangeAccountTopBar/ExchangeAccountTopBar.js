import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import "./ExchangeAccountTopBar.scss";
import { FormattedMessage } from "react-intl";
import ModalPathContext from "../../ModalPathContext";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import CustomButton from "../../../CustomButton";

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
        <CustomButton className="textDefault" onClick={() => navigateToPath("settings", account)}>
          <FormattedMessage id="accounts.settings" />
        </CustomButton>
        {account.isBrokerAccount && (
          <>
            <CustomButton className="textPurple" onClick={() => navigateToPath("deposit", account)}>
              <FormattedMessage id="accounts.deposit" />
            </CustomButton>
            <CustomButton
              className="textPurple"
              onClick={() => navigateToPath("withdraw", account)}
            >
              <FormattedMessage id="accounts.withdraw" />
            </CustomButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExchangeAccountTopBar;
