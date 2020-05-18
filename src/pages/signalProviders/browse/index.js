import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import { injectIntl, intlShape } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withSignalProvidersLayout from "../../../layouts/signalProvidersLayout/withSignalProvidersLayout";
import withPageContext from "../../../pageContext";
import ProvidersFilters from "../../../components/Providers/ProvidersFilters";
import ProvidersSort from "../../../components/Providers/ProvidersSort";
import TimeFrameSelect from "../../../components/TimeFrameSelect";
import ProvidersList from "../../../components/Providers/ProvidersList";
import Helmet from "react-helmet";
import tradeApi from "../../../services/tradeApiClient";
import * as TradeApiTypes from "../../../services/tradeApiClient.types";
import "./signalProvidersBrowse.scss";

const SignalProvidersBrowse = ({ showFilters, showSort, toggleFilters, toggleSort, intl }) => {
  const handleFiltersChange = (type, mda, trader) => {
    console.log(type, mda, trader);
  };
  const handleSortChange = (sort) => {
    console.log(sort);
  };
  const handleTimeFrameChange = (val) => {
    console.log(val);
  };
  const [providers, setProviders] = useState([1, 2, 3]);
  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  const loadProviders = async () => {
    const userEntity = await authenticateUser();
    const sessionPayload = {
      token: userEntity.token,
      type: "all",
      ro: true,
      copyTradersOnly: false,
    };

    const positions = await tradeApi.providersGet(sessionPayload);
    setProviders(positions);
  };

  useEffect(() => {
    // loadProviders();
  }, []);

  /**
   * @type {TradeApiTypes.UserPositionsCollection} positionsCollection
   */
  const providersCollections = providers;

  return (
    <Box className="spBrowsePage">
      <Helmet>
        <title>{intl.formatMessage({ id: "signalProviders" })}</title>
      </Helmet>

      {showFilters && <ProvidersFilters onChange={handleFiltersChange} onClose={toggleFilters} />}
      {showSort && <ProvidersSort onChange={handleSortChange} onClose={toggleSort} />}

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="regularHeading" variant="h3">
          7 traders
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect onChange={handleTimeFrameChange} />
        </Box>
      </Box>
      <ProvidersList providers={providersCollections} />
    </Box>
  );
};

SignalProvidersBrowse.propTypes = {
  toggleFilters: PropTypes.func,
  toggleSort: PropTypes.func,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
  intl: intlShape.isRequired,
};

export default compose(
  withPageContext,
  withAppLayout,
  withSignalProvidersLayout,
  injectIntl,
)(SignalProvidersBrowse);
