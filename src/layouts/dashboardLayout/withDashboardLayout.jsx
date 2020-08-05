import React from "react";
import "./DashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box, Typography } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../components/ExchangeIcon";
import { useStoreUserExchangeConnections } from "../../hooks/useStoreUserSelector";
import { navigate as navigateReach } from "@reach/router";

/**
 * HOC wrap component with dashboard layout.
 *
 * App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withDashboardLayout = (Component) => {
  /**
   *
   * @typedef {Object} DefaultProps
   * @property {String} path
   */

  /**
   * @param {DefaultProps} props Default params.
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    const exchangeConnections = useStoreUserExchangeConnections();

    const handleClickEvent = () => {
      navigateReach("#exchangeAccounts");
    };

    return (
      <Box
        alignItems="flex-start"
        className="dashboardLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {exchangeConnections.length > 0 && (
          <>
            <DashboardHeader path={props.path} />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </>
        )}
        {exchangeConnections.length === 0 && (
          <Box
            className="noExchangeBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h1">
              <FormattedMessage id="dashboard" />
            </Typography>
            <span className="title">
              <FormattedMessage id="dashboard.connectexchange.preText" />
              <b onClick={handleClickEvent}>
                <FormattedMessage id="dashboard.connectexchange.bold.title" />
              </b>
              <FormattedMessage id="dashboard.connectexchange.postText" />
            </span>
            <span className="subtitle">
              <FormattedMessage id="dashboard.connectexchange.subtitle" />
              <span>
                <FormattedMessage id="exchange.binance" />
              </span>
              or
              <span>
                <FormattedMessage id="exchange.kucoin" />
              </span>
            </span>
            <Box display="flex" flexDirection="row" justifyContent="flex-start">
              <ExchangeIcon exchange="binance" size="xlarge" />
              <ExchangeIcon exchange="kucoin" size="xlarge" />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;

  return WrapperComponent;
};

export default withDashboardLayout;
