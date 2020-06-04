import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserEquityEntity} UserEquityEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserEquityEntity>} list
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const TitleBar = (props) => {
  const { list } = props;

  const getTotalBTC = () => {
    let date = new Date().getDate();
    let found = [...list].find((item) => {
      return new Date(item.date).getDate() === date;
    });
    if (found) {
      return found.totalBTC;
    }
    return "";
  };

  const getTotalUSDT = () => {
    let date = new Date().getDate();
    let found = [...list].find((item) => {
      return new Date(item.date).getDate() === date;
    });
    if (found) {
      return found.totalUSDT;
    }
    return "";
  };

  return (
    <Box
      alignItems="center"
      className="titleBar"
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
          <Typography variant="h4">BTC {getTotalBTC()}</Typography>
          <Typography className="smallText" variant="subtitle2">
            = USD {getTotalUSDT()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;
