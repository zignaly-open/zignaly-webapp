import React from "react";
import "./edit.scss";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import EditProfileForm from "../../../components/Forms/EditProfileForm";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

const CopyTradersEdit = () => {
  const storeViews = useStoreViewsSelector();

  return (
    <Box
      alignItems="center"
      className="copyTradersEditPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      {<EditProfileForm provider={storeViews.provider} />}
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersEdit);
