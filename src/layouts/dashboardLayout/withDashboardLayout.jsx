import React, { useState } from "react";
import "./dashboardLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

/**
 *
 * @typedef {import('../../store/initialState').DefaultState} DefaultState
 */

/**
 *  App layout is defined here, the placement of header, sidebar, mobile appbar.
 *
 * @param {import('../../utils/getDisplayName').WrappedComponentType} Component
 * @returns {Object} Component
 */

const withDashboardLayout = (Component) => {
  /**
   *
   * @param {Object} props Default params.
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    /**
     *
     * @param {DefaultState} state
     */
    const selector = (state) => state.userExchanges;
    const userExchanges = useSelector(selector);

    return (
      <Box
        alignItems="flex-start"
        className="dashboardLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {userExchanges.length > 0 && (
          <>
            <DashboardHeader />
            <Box className="pageContent">
              <Component {...props} />
            </Box>
            <Box className="faq">
              <FAQ />
            </Box>
          </>
        )}
        {userExchanges.length === 0 && (
          <Box
            className="noExchangeBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <span className="title">
              <FormattedMessage id="dashboard.connectexchange.title" />
              <b>
                <FormattedMessage id="dashboard.connectexchange.bold.title" />
              </b>
            </span>
            <span className="subtitle">
              <FormattedMessage id="dashboard.connectexchange.subtitle" />
              <span>
                <FormattedMessage id="exchange.binance" />
              </span>
              ,
              <span>
                <FormattedMessage id="exchange.kucoin" />
              </span>
            </span>
          </Box>
        )}
      </Box>
    );
  };
  /**
   * @param {Object} Component
   */
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withDashboardLayout;
