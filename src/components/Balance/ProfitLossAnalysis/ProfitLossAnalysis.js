import React from "react";
import "./ProfitLossAnalysis.scss";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../utils/format";

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
              <span className="title">
                <FormattedMessage id="profitlossanalysis.totalprofit" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.totalloss" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.netprofitloss" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
          </Box>

          <Box className="winBox" display="flex" flexDirection="column">
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.windays" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.lossdays" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.evendays" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
            <Box
              className="dataBox"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <span className="title">
                <FormattedMessage id="profitlossanalysis.winrate" />
              </span>
              <span className="value">
                {formatFloat(0)} {"USDT"}
              </span>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfitLossAnalysis;
