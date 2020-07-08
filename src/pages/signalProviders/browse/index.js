import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { useIntl } from "react-intl";
import withProvidersLayout from "../../../layouts/providersLayout/withProvidersLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
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

  return (
    <Box className="spBrowsePage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.signalproviders",
          })} - ${intl.formatMessage({
            id: "srv.browse",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>

      <ProvidersBrowse
        connectedOnly={false}
        showFilters={showFilters}
        showSort={showSort}
        toggleFilters={toggleFilters}
        toggleSort={toggleSort}
        type="signalp"
      />
    </Box>
  );
};

export default compose(withProvidersLayout)(SignalProvidersBrowse);
