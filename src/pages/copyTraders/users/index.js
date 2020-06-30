import React, { useState, useEffect } from "react";
import "./users.scss";
import { Box, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import tradeApi from "../../../services/tradeApiClient";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import UsersTable from "../../../components/Provider/Users/UsersTable";

const CopyTradersUsers = () => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      {loading && <CircularProgress color="primary" />}
      {!loading && (
        <UsersTable
          list={userList}
          loadData={loadFollowersList}
          persistKey="copytProfileUsers"
          title="srv.users"
        />
      )}
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersUsers);
