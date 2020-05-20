import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";
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
    "Descending Results",
    "Ascending Results",
    "Descending Name",
    "Ascending Name",
    "Descending Subscription Fee",
    "Ascending Subscription Fee",
    "Descending Creation Date",
    "Ascending Creation Date",
  ];

  const [sort, setSort] = useState("");

  const clearFilters = () => {
    setSort("");
  };

  useEffect(() => {
    onChange(sort);
  }, [sort]);

  return (
    <Box className="providersSort">
      <CustomFilters onClear={clearFilters} onClose={onClose} title="Sort by">
        <CustomSelect label="" onChange={setSort} options={sorts} value={sort} />
      </CustomFilters>
    </Box>
  );
};

ProvidersSort.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProvidersSort;
