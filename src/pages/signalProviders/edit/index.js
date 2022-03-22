import React from "react";
import "./edit.scss";
import { Box } from "@mui/material";
import EditProfileForm from "../../../components/Forms/EditProfileForm";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

const SignalProvidersEdit = () => {
  const storeViews = useStoreViewsSelector();
  const intl = useIntl();

  return (
    <Box
      alignItems="center"
      className="signalProviderEditPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.edit",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {<EditProfileForm provider={storeViews.provider} />}
    </Box>
  );
};

export default SignalProvidersEdit;
