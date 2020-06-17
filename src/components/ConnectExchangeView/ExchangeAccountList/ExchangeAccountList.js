import React, { useContext } from "react";
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
import ModalPathContext from "../ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {function} navigateToAction Callback to navigate to action.
 * @property {string} type Type of exchanges to display.
 */

/**
 * Provides list to display exchanges accounts details.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountList = ({ demo }) => {
  const {
    pathParams: { currentPath },
    navigateToPath,
  } = useContext(ModalPathContext);
  const storeUser = useStoreUserSelector();
  const storeSettings = useStoreSettingsSelector();
  const selectedExchangeInternalId = storeSettings.selectedExchange.internalId;
  const exchanges = storeUser.exchangeConnections.filter((e) =>
    e.paperTrading || e.isTestnet ? demo : !demo,
  );

  return (
    <Box className="exchangeAccountList">
      {!exchanges.length ? (
        !demo ? (
          <NoRealAccount />
        ) : (
          <NoDemoAccount />
        )
      ) : (
        <Box className={`exchangeAccountContainer ${currentPath}`}>
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
                    onClick={() => navigateToPath("settings", item)}
                  >
                    <FormattedMessage id="accounts.settings" />
                  </CustomButton>
                  <CustomButton
                    className="textPurple"
                    onClick={() => navigateToPath("deposit", item)}
                  >
                    <FormattedMessage id="accounts.deposit" />
                  </CustomButton>
                  <CustomButton
                    className="textPurple"
                    onClick={() => navigateToPath("withdraw", item)}
                  >
                    <FormattedMessage id="accounts.withdraw" />
                  </CustomButton>
                </Box>
              </Box>
              <ExchangeAccountData internalId={item.internalId} />
            </Box>
          ))}
          {!demo ? (
            <Box className="exchangeButtons" display="flex" justifyContent="flex-start">
              <Box display="flex" flexDirection="column">
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
              <Box display="flex" flexDirection="column">
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
            </Box>
          ) : (
            <Box className="exchangeButtons" display="flex" justifyContent="flex-start">
              <Box display="flex" flexDirection="column">
                <Typography variant="h4">
                  <FormattedMessage id="accounts.connect.experiment" />
                </Typography>
                <CustomButton
                  className="body2 textPurple borderPurple exchangeButton"
                  onClick={() => navigateToPath("createDemoAccount")}
                >
                  <FormattedMessage id="accounts.create.demo" />
                </CustomButton>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExchangeAccountList;
