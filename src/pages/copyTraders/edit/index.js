import React from "react";
import "./edit.scss";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import CopyTraderEditProfileForm from "../../../components/Forms/CopyTraderEditProfileForm";

const CopyTradersProfile = () => {
  return (
    <Box className="profileEditPage">
      <CopyTraderEditProfileForm />
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
