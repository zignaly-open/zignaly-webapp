import React from "react";
import { Box, Typography } from "@material-ui/core";
import ExchangeIcon from "../../ExchangeIcon";
import "./ExchangeAccountList.scss";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ExchangeAccountData from "./ExchangeAccountData";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import NoRealAccount from "./NoRealAccount";
import NoDemoAccount from "./NoDemoAccount";

/**
 * @typedef {Object} DefaultProps
 * @property {function} openExchangeAccountAction Callback to navigate to action.
 * @property {string} type Type of exchanges to display.
 */

/**
 * Provides list to display exchanges accounts details.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountList = ({ type, openExchangeAccountAction }) => {
  const storeUser = useStoreUserSelector();
  const storeSettings = useStoreSettingsSelector();
  const selectedExchangeInternalId = storeSettings.selectedExchange.internalId;
  const exchanges = storeUser.exchangeConnections.filter((e) =>
    e.paperTrading || e.isTestnet ? type === "demoAccount" : type === "realAccount",
  );

  if (![].length) return type === "realAccount" ? <NoRealAccount /> : <NoDemoAccount />;

  return (
    <Box className="exchangeAccountList">
      {exchanges.map((item) => (
        <Box className="exchangeAccountInfo" key={item.internalId}>
          <Box
            alignItems="center"
            className={`accountInfoHeader ${
              selectedExchangeInternalId === item.internalId ? "active" : ""
            }`}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box alignItems="center" display="flex" flexDirection="row">
              <ExchangeIcon exchange={item.name.toLowerCase()} size="xlarge" />
              <Box className="accountName" display="flex" flexDirection="column">
                <Typography variant="h3">{item.internalName}</Typography>
                {selectedExchangeInternalId === item.internalId && (
                  <Typography className="selected" variant="subtitle1">
                    <FormattedMessage id="accounts.selected" />
                  </Typography>
                )}
              </Box>
            </Box>
            <Box alignItems="center" className="actionsBox" display="flex" flexDirection="row">
              <CustomButton
                className="textDefault"
                onClick={() => openExchangeAccountAction(item.internalId, "settings")}
              >
                <FormattedMessage id="accounts.settings" />
              </CustomButton>
              <CustomButton className="textPurple">
                <FormattedMessage id="accounts.deposit" />
              </CustomButton>
              <CustomButton className="textPurple">
                <FormattedMessage id="accounts.withdraw" />
              </CustomButton>
            </Box>
          </Box>
          <ExchangeAccountData internalId={item.internalId} />
        </Box>
      ))}
    </Box>
  );
};

export default ExchangeAccountList;
