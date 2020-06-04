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
 * @property {React.MouseEventHandler} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {React.MouseEventHandler} toggleSort Callback that delegate sort toggle state to caller.
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
          {intl.formatMessage({
            id: "menu.signalproviders",
          })}
        </title>
      </Helmet>

      <ProvidersBrowse
        type="signalp"
        openFilters={toggleFilters}
        openSort={toggleSort}
        showFilters={showFilters}
        showSort={showSort}
        connectedOnly={false}
      />
    </Box>
  );
};

export default compose(withProvidersLayout)(SignalProvidersBrowse);
