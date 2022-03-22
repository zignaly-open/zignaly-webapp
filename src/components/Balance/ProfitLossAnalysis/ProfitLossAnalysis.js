import React, { useEffect, useState } from "react";
import "./ProfitLossAnalysis.scss";
import { Box, Typography, CircularProgress } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { formatNumber } from "../../../utils/formatters";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ProfitLossAnalysis = ({ dailyBalance }) => {
  const inittialValues = {
    totalProfit: 0,
    totalLoss: 0,
    netProfitLoss: 0,
    winDays: 0,
    lossDays: 0,
    evenDays: 0,
    winRate: 0,
  };

  const [profitLossData, setProfitLossData] = useState(inittialValues);

  const prepareData = () => {
    let data = { ...inittialValues };
    dailyBalance.balances.forEach((item) => {
      if (item.pnlUSDT > 0) {
        data.totalProfit += item.pnlUSDT;
        data.winDays += 1;
      } else if (item.pnlUSDT < 0) {
        data.totalLoss += item.pnlUSDT;
        data.lossDays += 1;
      } else if (item.pnlUSDT === 0) {
        data.evenDays += 1;
      }
    });
    data.winRate = (data.winDays / dailyBalance.balances.length) * 100;
    data.netProfitLoss = data.totalProfit + data.totalLoss;
    setProfitLossData(data);
  };

  useEffect(prepareData, [dailyBalance.balances]);

  return (
    <>
      {dailyBalance.loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!dailyBalance.loading && (
        <Box
          alignItems="center"
          className="profitLossAnalysis"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Typography className="boxTitle" variant="h3">
            <FormattedMessage id="dashboard.balance.profitloss" />
          </Typography>

          <Box className="profitBox" display="flex" flexDirection="column">
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.totalprofit" />
              </Typography>
              <Typography className="value" variant="body1">
                {formatNumber(profitLossData.totalProfit, 2)} {"USDT"}
              </Typography>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.totalloss" />
              </Typography>
              <Typography className="value" variant="body1">
                {formatNumber(profitLossData.totalLoss, 2)} {"USDT"}
              </Typography>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.netprofitloss" />
              </Typography>
              <Typography className="value" variant="body1">
                {formatNumber(profitLossData.netProfitLoss, 2)} {"USDT"}
              </Typography>
            </Box>
          </Box>

          <Box className="winBox" display="flex" flexDirection="column">
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.windays" />
              </Typography>
              <Typography className="value" variant="body1">
                {profitLossData.winDays}
              </Typography>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.lossdays" />
              </Typography>
              <Typography className="value" variant="body1">
                {profitLossData.lossDays}
              </Typography>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.evendays" />
              </Typography>
              <Typography className="value" variant="body1">
                {profitLossData.evenDays}
              </Typography>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.winrate" />
              </Typography>
              <Typography className="value" variant="body1">
                {formatNumber(profitLossData.winRate, 2)} {"%"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfitLossAnalysis;
