import React, { useState, useEffect } from "react";
import "./connectedTraders.scss";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import { Helmet } from "react-helmet";
import tradeApi from "../../../services/tradeApiClient";
import ProvidersList from "../../../components/Providers/ProvidersList";

const ConnectedTraders = () => {
  /**
   * @typedef {import("../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
   * @type {ProvidersCollection} initialState
   */
  const initialState = [];
  const [providers, setProviders] = useState(initialState);
  const authenticateUser = async () => {
    const loginPayload = {
      email: "mail22sygn6vvi@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadProviders = async () => {
      const userEntity = await authenticateUser();
      const sessionPayload = {
        token: userEntity.token,
        type: "all",
        ro: true,
        copyTradersOnly: true,
        timeFrame: 90,
      };

      try {
        const responseData = await tradeApi.providersGet(sessionPayload);
        setProviders(responseData);
      } catch (e) {
        setProviders([]);
      }
    };
    loadProviders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Connected Traders</title>
      </Helmet>
      <Box
        className="connectedTradersPage"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box className="headlineBox">
          <Typography variant="h4">Traders I am copying:</Typography>
        </Box>
        <Box
          alignItems="center"
          className="tradersBox"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          {/* list && list.map((item) => <TraderCard data={item} key={item} showSummary={true} />) */}
          <ProvidersList providers={providers} showSummary={true} />
        </Box>
      </Box>
    </>
  );
};

export default compose(withPageContext, withAppLayout, withDashboardLayout)(ConnectedTraders);
