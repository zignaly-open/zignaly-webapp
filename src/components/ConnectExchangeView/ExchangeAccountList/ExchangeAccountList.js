import React, { useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";
import "./ExchangeAccountList.scss";
import { useStoreUserExchangeConnections } from "../../../hooks/useStoreUserSelector";
import ExchangeAccountData from "./ExchangeAccountData";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import NoRealAccount from "./NoRealAccount";
import NoDemoAccount from "./NoDemoAccount";
import ModalPathContext from "../ModalPathContext";
import { SubNavModalHeader } from "../../SubNavHeader";
import ExchangeAccountTopBar from "./ExchangeAccountTopBar";
import LazyLoad from "react-lazyload";
import useExchangeList from "../../../hooks/useExchangeList";
import useSelectedExchange from "hooks/useSelectedExchange";
import { getExchangeNamesCombined } from "../../../utils/helpers";

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} demo Flag to indicate if displaying demo accounts.
 * @property {string} searchFilter text for filtering the list.
 */

/**
 * Provides list to display exchanges accounts details.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountList = ({ demo, searchFilter = "" }) => {
  const {
    pathParams: { currentPath },
    navigateToPath,
    resetToPath,
  } = useContext(ModalPathContext);

  const exchangeConnections = useStoreUserExchangeConnections();
  const { exchanges } = useExchangeList();
  const userExchanges = exchangeConnections.filter((e) =>
    e.paperTrading || e.isTestnet ? demo : !demo,
  );
  const hasDemoAccounts = exchangeConnections.find((e) => e.paperTrading || e.isTestnet);

  const selectedExchange = useSelectedExchange();
  const [filteredUserExchanges, setFilteredUserExchanges] = useState([]);

  useEffect(() => {
    setFilteredUserExchanges(exchangeConnections
      .filter((item) => item.paperTrading || item.isTestnet ? demo : !demo)
      .filter((item) => item.internalName.toLowerCase().search(searchFilter.toLowerCase()) !== -1)
      .sort((item) => item.internalId === selectedExchange.internalId ? -1 : 0)
    );
  }, [selectedExchange, searchFilter, demo]);

  const tabs = [
    {
      id: "realAccounts",
      title: "accounts.real",
    },
  ];

  // Only show demo tab if the user already has demo accounts
  if (hasDemoAccounts) {
    tabs.push({
      id: "demoAccounts",
      title: "accounts.demo",
    });
  }

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

      {!userExchanges.length ? (
        !demo ? (
          <NoRealAccount />
        ) : (
          <NoDemoAccount />
        )
      ) : (
        <Box className={`exchangeAccountContainer ${currentPath}`}>
          {filteredUserExchanges.map((account) => (
            <Box className="exchangeAccountInfo" key={account.internalId}>
              <LazyLoad height={400} overflow={true} scrollContainer=".modal">
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
                  {/* <FormattedMessage id="accounts.exchanges" /> */}
                  {getExchangeNamesCombined(exchanges, "or")}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className="exchangeButtons" display="flex" justifyContent="flex-start">
              {/* <Box display="flex" flexDirection="column">
                <Typography variant="h4">
                  <FormattedMessage id="accounts.connect.experiment" />
                </Typography>
                <CustomButton
                  className="body2 textPurple borderPurple exchangeButton"
                  onClick={() => navigateToPath("createDemoAccount")}
                >
                  <FormattedMessage id="accounts.create.demo" />
                </CustomButton>
              </Box> */}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExchangeAccountList;
