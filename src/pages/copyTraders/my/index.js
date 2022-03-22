import React from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import withProvidersLayout from "../../../layouts/providersLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import "./myCopyTraders.scss";

/**
 * Provides a list to browse copy traders.
 *
 * @returns {JSX.Element} Component JSX.
 */
const MyCopyTraders = () => {
  const intl = useIntl();

  return (
    <Box className="psMyPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.copytraders",
          })} - ${intl.formatMessage({
            id: "srv.myservices",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse myServices={true} type="copy_trading" />
    </Box>
  );
};

export default withProvidersLayout(MyCopyTraders);
