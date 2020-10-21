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
              <Typography className="title" variant="body1">
                <FormattedMessage id="profitlossanalysis.totalprofit" />
              </Typography>
              <Typography className="value" variant="body1">
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
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
                {formatFloat(0)} {"USDT"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfitLossAnalysis;
