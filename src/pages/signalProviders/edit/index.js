import React from "react";
import "./edit.scss";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import EditProfileForm from "../../../components/Forms/EditProfileForm";

const CopyTradersEdit = () => {
  return (
    <Box
      alignItems="center"
      className="signalProviderEditPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      {<EditProfileForm />}
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersEdit);
