import React from "react";
import { CircularProgress } from "@material-ui/core";
import UsersTable from "./UsersTable";
import useProviderUsers from "../../../hooks/useProviderUsers";
import UserFilters from "./UserFilters";

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
  const {
    loading,
    list,
    loadFollowersList,
    connectedOptions,
    activeOptions,
    suspendedOptions,
    exchangeOptions,
    filters,
    setFilters,
    filtersVisibility,
    setFiltersVisibility,
  } = useProviderUsers(provider);

  const embedFilters = () => {
    return (
      <UserFilters
        activeOptions={activeOptions}
        connectedOptions={connectedOptions}
        exchangeOptions={exchangeOptions}
        filters={filters}
        setFilters={setFilters}
        suspendedOptions={suspendedOptions}
      />
    );
  };

  return (
    <>
      {loading && <CircularProgress color="primary" />}
      {!loading && (
        <UsersTable
          filtersVisibility={filtersVisibility}
          list={list}
          loadData={loadFollowersList}
          persistKey="copytProfileUsers"
          provider={provider}
          setFiltersVisibility={setFiltersVisibility}
          title={embedFilters()}
        />
      )}
    </>
  );
};

export default ProviderUsers;
