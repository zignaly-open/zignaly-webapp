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
 */

/**
 * Provides sorting options for providers.
 *
 * @param {ProvidersSortPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersSort = ({ onChange, onClose }) => {
  const sorts = [
    {
      label: "Descending Results",
      val: "result-desc",
    },
    {
      label: "Ascending Results",
      val: "result-asc",
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
      val: "creationDate-desc",
    },
    {
      label: "Ascending Creation Date",
      val: "creationDate-asc",
    },
  ];

  const [sort, setSort] = useState("");
  const intl = useIntl();

  const clearFilters = () => {
    setSort("");
  };

  // Memoized callback to satisfy exhaustive-deps
  const triggerChange = useCallback((...args) => {
    onChange(...args);
  }, []);

  useEffect(() => {
    triggerChange(sort);
  }, [sort, triggerChange]);

  return (
    <Box className="providersSort">
      <CustomFilters
        onClear={clearFilters}
        onClose={onClose}
        title={intl.formatMessage({ id: "sort.sortby" })}
      >
        <CustomSelect label="" onChange={setSort} options={sorts} value={sort} />
      </CustomFilters>
    </Box>
  );
};

export default ProvidersSort;
