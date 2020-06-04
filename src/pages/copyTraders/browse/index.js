import React from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { useIntl } from "react-intl";
import withProvidersLayout from "../../../layouts/providersLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
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
  const intl = useIntl();

  return (
    <Box className="ctBrowsePage">
      <Helmet>
        <title>{intl.formatMessage({ id: "menu.copytraders" })}</title>
      </Helmet>

      <ProvidersBrowse
        type="copyt"
        openFilters={toggleFilters}
        openSort={toggleSort}
        showFilters={showFilters}
        showSort={showSort}
        connectedOnly={false}
      />
    </Box>
  );
};

export default compose(withProvidersLayout)(CopyTradersBrowse);
