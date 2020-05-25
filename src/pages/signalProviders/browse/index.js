import React from "react";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import { FormattedMessage, useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withSignalProvidersLayout from "../../../layouts/signalProvidersLayout/withSignalProvidersLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import useProvidersList from "../../../hooks/useProvidersList";
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
  const intl = useIntl();
  const [providers, provComponents] = useProvidersList(
    false,
    false,
    false,
    toggleFilters,
    toggleSort,
  );
  const { ProvidersList, ProvidersFilters, ProvidersSort, TimeFrameSelect } = provComponents;

  return (
    <Box className="spBrowsePage">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: "menu.signalproviders",
          })}
        </title>
      </Helmet>

      {showFilters && <ProvidersFilters />}
      {showSort && <ProvidersSort />}

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="regularHeading" variant="h3">
          {providers.length} <FormattedMessage id="copyt.traders" />
        </Typography>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <TimeFrameSelect />
        </Box>
      </Box>
      <ProvidersList />
    </Box>
  );
};

export default compose(
  withPageContext,
  withAppLayout,
  withSignalProvidersLayout,
)(SignalProvidersBrowse);
