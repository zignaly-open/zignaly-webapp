import React from "react";
import "./TitleBar.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import useStoreUserSelector from "../../../../hooks/useStoreUserSelector";

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
  const storeUser = useStoreUserSelector();

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
          <Typography variant="h4">
            BTC {storeUser.dailyBalance.length ? storeUser.dailyBalance[0].totalBTC : "0"}{" "}
          </Typography>
          <Typography className="smallText" variant="subtitle2">
            = USD {storeUser.dailyBalance.length ? storeUser.dailyBalance[0].totalUSD : "0"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;
