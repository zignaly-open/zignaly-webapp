import React from "react";
import { CircularProgress } from "@material-ui/core";
import UsersTable from "../UsersTable";
import useProviderUsers from "../../../../hooks/useProviderUsers";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProviderUsers = ({ provider }) => {
  const { loading, list, loadFollowersList } = useProviderUsers(provider.id);
  return (
    <>
      {loading && <CircularProgress color="primary" />}
      {!loading && (
        <UsersTable
          list={list}
          loadData={loadFollowersList}
          persistKey="copytProfileUsers"
          title={<FormattedMessage id="srv.users" />}
        />
      )}
    </>
  );
};

export default ProviderUsers;
