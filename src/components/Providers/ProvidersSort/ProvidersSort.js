import React from "react";
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
 * @property {boolean} open Flag to indicates if the sort bar is open.
 * @property {string} provType
 */

/**
 * Provides sorting options for providers.
 *
 * @param {ProvidersSortPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersSort = ({ onChange, onClose, sort, clearFilters, open, provType }) => {
  const intl = useIntl();
  const copyTraders = provType === "copytraders";
  const profitSharing = provType === "profitsharing";

  const sorts = [
    ...(copyTraders || profitSharing
      ? [
          {
            label: intl.formatMessage({ id: "sort.returns.desc" }),
            val: "RETURNS_DESC",
          },
          {
            label: intl.formatMessage({ id: "sort.returns.asc" }),
            val: "RETURNS_ASC",
          },
        ]
      : [
          {
            label: intl.formatMessage({ id: "sort.signals.desc" }),
            val: "SIGNALS_DESC",
          },
          {
            label: intl.formatMessage({ id: "sort.signals.asc" }),
            val: "SIGNALS_ASC",
          },
          {
            label: intl.formatMessage({ id: "sort.newfollowers.desc" }),
            val: "NEWFOLLOWERS_DESC",
          },
          {
            label: intl.formatMessage({ id: "sort.newfollowers.asc" }),
            val: "NEWFOLLOWERS_ASC",
          },
        ]),
    {
      label: intl.formatMessage({ id: "sort.followers.desc" }),
      val: "FOLLOWERS_DESC",
    },
    {
      label: intl.formatMessage({ id: "sort.followers.asc" }),
      val: "FOLLOWERS_ASC",
    },
    {
      label: intl.formatMessage({ id: "sort.name.desc" }),
      val: "NAME_DESC",
    },
    {
      label: intl.formatMessage({ id: "sort.name.asc" }),
      val: "NAME_ASC",
    },
    {
      label: intl.formatMessage({ id: "sort.fee.desc" }),
      val: "FEE_DESC",
    },
    {
      label: intl.formatMessage({ id: "sort.fee.asc" }),
      val: "FEE_ASC",
    },
    {
      label: intl.formatMessage({ id: "sort.date.desc" }),
      val: "DATE_DESC",
    },
    {
      label: intl.formatMessage({ id: "sort.date.asc" }),
      val: "DATE_ASC",
    },
  ];

  return (
    <Box className="providersSort">
      <CustomFilters
        onClear={clearFilters}
        onClose={onClose}
        open={open}
        title={intl.formatMessage({ id: "sort.sortby" })}
      >
        <CustomSelect label="" onChange={onChange} options={sorts} value={sort} />
      </CustomFilters>
    </Box>
  );
};

export default ProvidersSort;
