import React from "react";
import "./TotalEquity.scss";
import { Box, Typography } from "@material-ui/core";
import Chart from "../../Graphs/Chart";
import { FormattedMessage } from "react-intl";

const TotalEquity = props => {
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
      <Chart id="myChart" type="line">
        <canvas className="chartCanvas" id="myChart" />
      </Chart>
    </Box>
  );
};

export default TotalEquity;
