import React from "react";
import "./edit.scss";
import { Box } from "@material-ui/core";
import EditProfileForm from "../../../components/Forms/EditProfileForm";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

const SignalProvidersEdit = () => {
  const storeViews = useStoreViewsSelector();

  return (
    <Box
      alignItems="center"
      className="signalProviderEditPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      {<EditProfileForm provider={storeViews.provider} />}
    </Box>
  );
};

export default SignalProvidersEdit;
