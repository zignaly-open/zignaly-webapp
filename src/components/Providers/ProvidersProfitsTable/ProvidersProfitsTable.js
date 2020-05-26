import React, { useEffect, useState } from "react";
import "./ProvidersProfitsTable.scss";
import { Box, Table } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import ProvidersProfitsTableHead from "./ProvidersProfitsTableHead";
import ProvidersProfitsTableBody from "./ProvidersProfitsTableBody";

const ProvidersProfitsTable = () => {
  const [stats, setStats] = useState([]);

  const authenticateUser = async () => {
    const loginPayload = {
      email: "me@brbordallo.com",
      password: "09876aaA!",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadProvidersStats = async () => {
      try {
        const userEntity = await authenticateUser();
        const payload = {
          token: userEntity.token,
          ro: true,
          quote: "BTC",
          base: "all",
          timeFrame: "2months",
          DCAFilter: "withoutDCA",
        };
        const responseData = await tradeApi.providersStatsGet(payload);
        setStats(responseData);
      } catch (e) {
        // TODO: Display error in alert.
      }
    };

    loadProvidersStats();
  }, []);

  return (
    <Box
      alignItems="center"
      className="ProvidersProfitsTable"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        className="tableBox hideScroll"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Table className="table">
          <ProvidersProfitsTableHead />
          <ProvidersProfitsTableBody stats={stats} />
        </Table>
      </Box>
    </Box>
  );
};

export default ProvidersProfitsTable;
