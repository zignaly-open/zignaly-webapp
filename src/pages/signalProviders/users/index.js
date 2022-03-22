import React from "react";
import "./users.scss";
import { Box } from "@mui/material";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import ProviderUsers from "../../../components/Provider/ProviderUsers";

const SignalProvidersUsers = () => {
  const storeViews = useStoreViewsSelector();
  const intl = useIntl();

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
      <ProviderUsers provider={storeViews.provider} />
    </Box>
  );
};

export default SignalProvidersUsers;
