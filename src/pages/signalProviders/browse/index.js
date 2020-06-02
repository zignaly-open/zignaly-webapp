import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { useIntl } from "react-intl";
import withAppLayout from "../../../layouts/appLayout";
import withProvidersLayout from "../../../layouts/providersLayout/withProvidersLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import useProvidersList from "../../../hooks/useProvidersList";
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
  const providersOptions = { copyTradersOnly: false, connectedOnly: false, showSummary: false };
  const providersCallbacks = { toggleFilters, toggleSort };
  const [, provComponents] = useProvidersList(providersOptions, providersCallbacks);
  const {
    ProvidersList,
    ProvidersFilters,
    ProvidersSort,
    ProvidersTimeFrameSelect,
  } = provComponents;

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
      <ProvidersTimeFrameSelect />
      <ProvidersList />
    </Box>
  );
};

export default compose(withPageContext, withAppLayout, withProvidersLayout)(SignalProvidersBrowse);
