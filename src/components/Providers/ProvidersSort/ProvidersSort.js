import React, { useState, useEffect, useCallback } from "react";
import { useIntl } from "react-intl";
import { Box } from "@material-ui/core";
import "./ProvidersSort.scss";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {Object} ProvidersSortPropTypes
 * @property {function} onChange Callback that delegate sorting changes to caller.
 * @property {function} onClose Callback that delegate sorting toggle state to caller.
 * @property {string} sort value Selected value.
 * @property {function} clearFilters Callback that delegate filters clearing to caller.
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
      val: "returns-desc",
    },
    {
      label: "Ascending Results",
      val: "returns-asc",
    },
    {
      label: "Descending Name",
      val: "name-desc",
    },
    {
      label: "Ascending Name",
      val: "name-asc",
    },
    {
      label: "Descending Subscription Fee",
      val: "fee-desc",
    },
    {
      label: "Ascending Subscription Fee",
      val: "fee-asc",
    },
    {
      label: "Descending Creation Date",
      val: "createdAt-desc",
    },
    {
      label: "Ascending Creation Date",
      val: "createdAt-asc",
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
