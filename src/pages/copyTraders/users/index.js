import React from "react";
import "./users.scss";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import ProviderUsers from "../../../components/Provider/ProviderUsers";

const CopyTradersUsers = () => {
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

export default CopyTradersUsers;
