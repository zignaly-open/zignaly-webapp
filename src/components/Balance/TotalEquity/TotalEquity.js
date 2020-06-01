import React, { useEffect } from "react";
import "./TotalEquity.scss";
import { Box, Typography } from "@material-ui/core";
import GenericChart from "../../Graphs/Chart";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";

const TotalEquity = () => {
  const storeSession = useStoreSessionSelector();
  let chartData = { values: [100, 200, 150, 200, 220, 250], labels: ["", "", "", "", "", ""] };

  let colorsOptions = {
    backgroundColor: "",
    borderColor: "#a946f6",
    gradientColor1: "#a946f6",
    gradientColor2: "#fafafa",
  };

  useEffect(() => {
    const loadEquity = async () => {
      try {
        const payload = {
          token: storeSession.tradeApi.accessToken,
        };
        const response = await tradeApi.userEquityGet(payload);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    loadEquity();
  }, []);

  return (
    <Box
      alignItems="flex-start"
      className="totalEquity"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="equityHeader"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Typography className="boxTitle" variant="h3">
            <FormattedMessage id="dashboard.balance.totalequity" />
          </Typography>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={1}
          >
            <Typography variant="h4">BTC 0.5346 </Typography>
            <Typography className="smallText" variant="subtitle2">
              {" "}
              = USD 3450.6
            </Typography>
          </Box>
        </Box>
        <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <label>
            <FormattedMessage id="dashboard.balance.show" />
          </label>
          <select>
            <option>Last year</option>
          </select>
        </Box>
      </Box>
      <GenericChart chartData={chartData} colorsOptions={colorsOptions} id="myChart">
        <canvas className="chartCanvas" id="myChart" />
      </GenericChart>
    </Box>
  );
};

export default TotalEquity;
