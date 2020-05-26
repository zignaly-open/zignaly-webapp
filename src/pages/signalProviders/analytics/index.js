import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { FormattedMessage, useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withSignalProvidersLayout from "../../../layouts/signalProvidersLayout/withSignalProvidersLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import "./signalProvidersAnalytics.scss";

/**
 * @typedef {Object} SignalProvidersBrowsePropTypes
 * @property {boolean} showFilters Flag to indicate if filters should be rendered.
 * @property {boolean} showSort Flag to indicate if sort options should be rendered.
 * @property {React.MouseEventHandler} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {React.MouseEventHandler} toggleSort Callback that delegate sort toggle state to caller.
 */

/**
 * Provides a list to browse signal providers.
 *
 * @param {SignalProvidersBrowsePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const SignalProvidersAnalytics = (props) => {
  const intl = useIntl();

  return (
    <Box className="spBrowsePage">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: "srv.analytics",
          })}
        </title>
      </Helmet>
    </Box>
  );
};

export default compose(
  withPageContext,
  withAppLayout,
  withSignalProvidersLayout,
)(SignalProvidersAnalytics);
