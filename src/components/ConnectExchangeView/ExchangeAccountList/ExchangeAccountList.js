import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import "./ExchangeAccountList.scss";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import ExchangeAccountData from "./ExchangeAccountData";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import NoRealAccount from "./NoRealAccount";
import NoDemoAccount from "./NoDemoAccount";
import ModalPathContext from "../ModalPathContext";
import { SubNavModalHeader } from "../../SubNavHeader";
import ExchangeAccountTopBar from "./ExchangeAccountTopBar";
import { useDispatch } from "react-redux";
import { setUserExchanges } from "../../../store/actions/user";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import LazyLoad from "react-lazyload";

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} demo Flag to indicate if displaying demo accounts.
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
    resetToPath,
  } = useContext(ModalPathContext);

  const storeUser = useStoreUserSelector();
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const exchanges = storeUser.exchangeConnections.filter((e) =>
    e.paperTrading || e.isTestnet ? demo : !demo,
  );

  const loadAccounts = () => {
    const authorizationPayload = {
      token: storeSession.tradeApi.accessToken,
    };
    dispatch(setUserExchanges(authorizationPayload));
  };
  // Refresh accounts
  useEffect(loadAccounts, []);

  const tabs = [
    {
      id: "realAccounts",
      title: "accounts.real",
    },
    {
      id: "demoAccounts",
      title: "accounts.demo",
    },
  ];

  /**
   * Navigation callback
   * @param {string} id tab id
   * @returns {void}
   */
  const handleTabChange = (id) => {
    resetToPath(id);
  };

  return (
    <Box className="exchangeAccountList">
      <SubNavModalHeader currentPath={currentPath} links={tabs} onClick={handleTabChange} />
      {!exchanges.length ? (
        !demo ? (
          <NoRealAccount />
        ) : (
          <NoDemoAccount />
        )
      ) : (
        <Box className={`exchangeAccountContainer ${currentPath}`}>
          {exchanges.map((account) => (
            <Box className="exchangeAccountInfo" key={account.internalId}>
              <LazyLoad height={512} offset={200} overflow={true} scrollContainer=".modal">
                <ExchangeAccountTopBar account={account} />
                <ExchangeAccountData account={account} />
              </LazyLoad>
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
