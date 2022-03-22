import React from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import withProvidersLayout from "../../../layouts/providersLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import "./myProfitSharing.scss";

/**
 * Provides a list to browse copy traders.
 *
 * @returns {JSX.Element} Component JSX.
 */
const MyProfitSharing = () => {
  const intl = useIntl();

  return (
    <Box className="myProfitSharingPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.profitSharing",
          })} - ${intl.formatMessage({
            id: "srv.myservices",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse myServices={true} type="profit_sharing" />
    </Box>
  );
};

export default withProvidersLayout(MyProfitSharing);
