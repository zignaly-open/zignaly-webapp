import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import { FormattedMessage, useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withCopyTradersLayout from "../../../layouts/copyTradersLayout";
import withPageContext from "../../../pageContext";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import ProvidersSort from "../../../components/Providers/ProvidersSort";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import { Helmet } from "react-helmet";
import tradeApi from "../../../services/tradeApiClient";
import ProvidersList from "../../../components/Providers/ProvidersList";
import "./copyTradersBrowse.scss";

/**
 * @typedef {Object} CopyTradersBrowsePropTypes
 * @property {boolean} showFilters Flag to indicate if filters should be rendered.
 * @property {boolean} showSort Flag to indicate if sort options should be rendered.
 * @property {function} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {function} toggleSort Callback that delegate sort toggle state to caller.
 */

/**
 * Provides a list to browse copy traders.
 *
 * @param {CopyTradersBrowsePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTradersBrowse = (props) => {
  const { showFilters, showSort, toggleFilters, toggleSort } = props;
  const handleFiltersChange = (/* coin, exchange */) => {};
  const handleSortChange = () => {};
  const handleTimeFrameChange = () => {};
  const intl = useIntl();

  /**
   * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
   * @type {ProvidersCollection} initialState
   */
  const initialState = [];
  const [providers, setProviders] = useState(initialState);

  const authenticateUser = async () => {
    const loginPayload = {
      email: "mail22sygn6vvi@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadProviders = async () => {
      const userEntity = await authenticateUser();
      const sessionPayload = {
        token: userEntity.token,
        type: "all",
        ro: true,
        copyTradersOnly: true,
        timeFrame: 90,
      };

      try {
        const responseData = await tradeApi.providersGet(sessionPayload);
        setProviders(responseData);
      } catch (e) {
        setProviders([]);
      }
    };
    loadProviders();
  }, []);

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>{intl.formatMessage({ id: "menu.copytraders" })}</title>
      </Helmet>

      {showFilters && <ProvidersFilters onChange={handleFiltersChange} onClose={toggleFilters} />}
      {showSort && <ProvidersSort onChange={handleSortChange} onClose={toggleSort} />}
      <Box display="flex" flexDirection="row" justifyContent="space-between" pb="12px">
        <Typography className="regularHeading" variant="h3">
          {providers.length} <FormattedMessage id="copyt.traders" />
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <ProvidersList providers={providers} showSummary={false} />
    </Box>
  );
};

CopyTradersBrowse.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  showSort: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
};

export default compose(withPageContext, withAppLayout, withCopyTradersLayout)(CopyTradersBrowse);
