import React, { useState, useEffect } from "react";
import "./users.scss";
import { Box, CircularProgress } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import UsersTable from "../../../components/Provider/Users/UsersTable";
import { FormattedMessage, useIntl } from "react-intl";
import { Helmet } from "react-helmet";

const SignalProvidersUsers = () => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  const loadFollowersList = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };
    tradeApi
      .providerFollowersListGet(payload)
      .then((response) => {
        setUserList(response);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  useEffect(loadFollowersList, []);

  return (
    <Box
      alignItems="center"
      className="profileUsersPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.users",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {loading && <CircularProgress color="primary" />}
      {!loading && (
        <UsersTable
          list={userList}
          loadData={loadFollowersList}
          persistKey="copytProfileUsers"
          title={<FormattedMessage id="srv.users" />}
        />
      )}
    </Box>
  );
};

export default SignalProvidersUsers;
