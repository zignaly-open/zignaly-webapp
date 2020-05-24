import React, { useState, useEffect } from "react";
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
    { label: "Descending Results", val: "RESULTS_DESC" },
    { label: "Ascending Results", val: "RESULST_ASC" },
    { label: "Descending Name", val: "NAME_DES" },
    { label: "Ascending Name", val: "NAME_ASC" },
    { label: "Descending Subscription Fee", val: "FEE_DESC" },
    { label: "Ascending Subscription Fee", val: "FEE_ASC" },
    { label: "Descending Creation Date", val: "DATE_DESC" },
    { label: "Ascending Creation Date", val: "DATE_ASC" },
  ];

  const [sort, setSort] = useState("");

  const clearFilters = () => {
    setSort("");
  };

  useEffect(() => {
    onChange(sort);
  }, [sort, onChange]);

  return (
    <Box className="providersSort">
      <CustomFilters onClear={clearFilters} onClose={onClose} title="Sort by">
        <CustomSelect label="" onChange={setSort} options={sorts} value={sort} />
      </CustomFilters>
    </Box>
  );
};

export default ProvidersSort;
