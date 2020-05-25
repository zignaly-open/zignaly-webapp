import React from "react";
import { useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import "./ProvidersSort.scss";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {import("react").MouseEventHandler} MouseEventHandler
 * @typedef {Object} ProvidersSortPropTypes
 * @property {Function} onChange Callback that delegate sorting changes to caller.
 * @property {MouseEventHandler} onClose Callback that delegate sorting toggle state to caller.
 * @property {string} sort value Selected value.
 * @property {Function} clearFilters Callback that delegate filters clearing to caller.
 */

/**
 * Provides sorting options for providers.
 *
 * @param {ProvidersSortPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersSort = ({ onChange, onClose, sort, clearFilters }) => {
  const sorts = [
    {
      label: "Descending Results",
      val: "RETURNS_DESC",
    },
    {
      label: "Ascending Results",
      val: "RETURNS_ASC",
    },
    {
      label: "Descending Name",
      val: "NAME_DESC",
    },
    {
      label: "Ascending Name",
      val: "NAME_ASC",
    },
    {
      label: "Descending Subscription Fee",
      val: "FEE_DESC",
    },
    {
      label: "Ascending Subscription Fee",
      val: "FEE_ASC",
    },
    {
      label: "Descending Creation Date",
      val: "CREATEDAT_DESC",
    },
    {
      label: "Ascending Creation Date",
      val: "createdAt_asc",
    },
  ];

  const intl = useIntl();

  return (
    <Box className="providersSort">
      <CustomFilters
        onClear={clearFilters}
        onClose={onClose}
        title={intl.formatMessage({ id: "sort.sortby" })}
      >
        <CustomSelect label="" onChange={onChange} options={sorts} value={sort} />
      </CustomFilters>
    </Box>
  );
};

export default ProvidersSort;
