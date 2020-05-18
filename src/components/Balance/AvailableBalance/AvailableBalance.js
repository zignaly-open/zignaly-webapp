import React from "react";
import "./AvailableBalance.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} AvailableBalanceProps
 * @property {Object} balance Object which will contain user balancs summary
 */

/**
 * User balance summary
 *
 * @param {AvailableBalanceProps} props Component properties.
 */

const AvailableBalance = (props) => {
  return (
    <Box
      alignItems="center"
      className="availableBalance"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        className="dataBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h4">
            <FormattedMessage id="dashboard.balance.available" />
          </Typography>
          <Typography className="smallText" variant="subtitle2">
            {" "}
            = USD 3450.6
          </Typography>
        </Box>
        <Typography variant="h5">BTC 1.5646</Typography>
      </Box>
      <span className="operator">+</span>
      <Box
        alignItems="flex-start"
        className="dataBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h4">
            <FormattedMessage id="dashboard.balance.invested" />
          </Typography>
          <Typography className="smallText" variant="subtitle2">
            {" "}
            = USD 3450.6
          </Typography>
        </Box>
        <Typography variant="h5">BTC 1.5646</Typography>
      </Box>
      <span className="operator">+</span>
      <Box
        alignItems="flex-start"
        className="dataBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h4">
            <FormattedMessage id="dashboard.balance.profit" />
          </Typography>
          <Typography className="smallText" variant="subtitle2">
            {" "}
            = USD 3450.6
          </Typography>
        </Box>
        <Typography variant="h5">BTC 1.5646</Typography>
      </Box>
      <span className="operator">=</span>
      <Box
        alignItems="flex-start"
        className="dataBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h4">
            <FormattedMessage id="dashboard.balance.total" />
          </Typography>
          <Typography className="smallText" variant="subtitle2">
            {" "}
            = USD 3450.6
          </Typography>
        </Box>
        <Typography variant="h5">BTC 1.5646</Typography>
      </Box>
    </Box>
  );
};

export default AvailableBalance;
