import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import UsersTable from "./UsersTable";
import useProviderUsers from "../../../hooks/useProviderUsers";
import UserFilters from "./UserFilters";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProviderUsers = ({ provider }) => {
  const persistKey = "copytProfileUsers";
  const storeSettings = useStoreSettingsSelector();
  const [paginationOptions, setPaginationOptions] = useState({
    page: 1,
    maxPerPage: storeSettings.rowsPerPage[persistKey] || 10,
    sort: storeSettings.sortColumns[persistKey] ? storeSettings.sortColumns[persistKey].name : null,
    direction: storeSettings.sortColumns[persistKey]
      ? storeSettings.sortColumns[persistKey].direction
      : null,
  });

  const {
    users,
    loadFollowersList,
    connectedOptions,
    activeOptions,
    suspendedOptions,
    filters,
    setFilters,
    filtersVisibility,
    setFiltersVisibility,
    total,
    loading,
  } = useProviderUsers(provider, paginationOptions);

  const embedFilters = () => {
    return (
      <UserFilters
        activeOptions={activeOptions}
        connectedOptions={connectedOptions}
        filters={filters}
        setFilters={setFilters}
        suspendedOptions={suspendedOptions}
      />
    );
  };

  return (
    <>
      {!users ? (
        <CircularProgress color="primary" />
      ) : (
        <UsersTable
          filtersVisibility={filtersVisibility}
          list={users}
          loadData={loadFollowersList}
          persistKey={persistKey}
          provider={provider}
          setFiltersVisibility={setFiltersVisibility}
          title={embedFilters()}
          loading={loading}
          paginationOptions={{
            total,
            onRowsPerPageChange: (value) => {
              setPaginationOptions({ ...paginationOptions, maxPerPage: value });
            },
            onPageChange: (value) => {
              setPaginationOptions({ ...paginationOptions, page: value });
            },
            onColumnSortChange: (value, direction) => {
              setPaginationOptions({ ...paginationOptions, sort: value, direction });
            },
          }}
        />
      )}
    </>
  );
};

export default ProviderUsers;
