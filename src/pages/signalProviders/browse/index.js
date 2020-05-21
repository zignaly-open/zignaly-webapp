import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import { FormattedMessage, useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withSignalProvidersLayout from "../../../layouts/signalProvidersLayout/withSignalProvidersLayout";
import withPageContext from "../../../pageContext";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import ProvidersSort from "../../../components/Providers/ProvidersSort";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import ProvidersList from "../../../components/Providers/ProvidersList";
import { Helmet } from "react-helmet";
import tradeApi from "../../../services/tradeApiClient";
import "./signalProvidersBrowse.scss";

/**
 * @typedef {Object} SignalProvidersBrowsePropTypes
 * @property {boolean} showFilters Flag to indicate if filters should be rendered.
 * @property {boolean} showSort Flag to indicate if sort options should be rendered.
 * @property {function} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {function} toggleSort Callback that delegate sort toggle state to caller.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {SignalProvidersBrowsePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const SignalProvidersBrowse = (props) => {
  const { showFilters, showSort, toggleFilters, toggleSort } = props;
  const handleFiltersChange = (/* type, mda, trader */) => {};
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
      email: "mailkdqvw4bplp@example.test",
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
        copyTradersOnly: false,
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
    <Box className="spBrowsePage">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: "menu.signalproviders",
          })}
        </title>
      </Helmet>

      {showFilters && <ProvidersFilters onChange={handleFiltersChange} onClose={toggleFilters} />}
      {showSort && <ProvidersSort onChange={handleSortChange} onClose={toggleSort} />}

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="regularHeading" variant="h3">
          {providers.length} <FormattedMessage id="copyt.traders" />
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <ProvidersList providers={providers} />
    </Box>
  );
};

SignalProvidersBrowse.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  showSort: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
};

export default compose(
  withPageContext,
  withAppLayout,
  withSignalProvidersLayout,
)(SignalProvidersBrowse);
