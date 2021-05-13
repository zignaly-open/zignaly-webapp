import React from "react";
import { Box } from "@material-ui/core";
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
 * @property {function} setModifiedFiltersCount Callback that delegate modifiedFiltersCount to caller.
 */

/**
 * Provides a list to browse copy traders.
 *
 * @param {CopyTradersBrowsePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTradersBrowse = (props) => {
  const { showFilters, showSort, toggleFilters, toggleSort, setModifiedFiltersCount } = props;
  const intl = useIntl();

  return (
    <Box className="psBrowsePage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.profitSharing",
          })} - ${intl.formatMessage({
            id: "srv.browse",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse
        setModifiedFiltersCount={setModifiedFiltersCount}
        showFilters={showFilters}
        showSort={showSort}
        toggleFilters={toggleFilters}
        toggleSort={toggleSort}
        type="profit_sharing"
      />
    </Box>
  );
};

export default withProvidersLayout(CopyTradersBrowse);
