import React from "react";
import { Box } from "@material-ui/core";
import { useIntl } from "react-intl";
import withProvidersLayout from "../../../layouts/providersLayout";
import { Helmet } from "react-helmet";
import ProvidersBrowse from "../../../components/Providers/ProvidersBrowse";
import "./mySignalProviders.scss";

/**
 * Provides a list to browse copy traders.
 *
 * @returns {JSX.Element} Component JSX.
 */
const MySignalProviders = () => {
  const intl = useIntl();

  return (
    <Box className="mySPPage">
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.signalproviders",
          })} - ${intl.formatMessage({
            id: "srv.myservices",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <ProvidersBrowse myServices={true} type="signal_providers" />
    </Box>
  );
};

export default withProvidersLayout(MySignalProviders);
