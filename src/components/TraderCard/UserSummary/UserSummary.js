import React from "react";
import "./UserSummary.scss";
import { Box, Typography } from "@material-ui/core";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import { FormattedMessage } from "react-intl";
import CustomTooltip from "../../CustomTooltip";
/**
 * @typedef {import("services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {Object} DefaultProps
 * @property {ProviderEntity} provider Provider entity.
 * @property {string} quote Quote traded by provider.
 * @property {boolean} isCopyTrading Flag to indicate if it's a copy trader.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const UserSummary = ({ provider, quote, isCopyTrading }) => {
  const profitPerc = provider.allocatedBalance
    ? (provider.profitsSinceCopying / provider.allocatedBalance) * 100
    : 0;
  const color = profitPerc >= 0 ? "green" : "red";

  return (
    <Box className="userSummary" display="flex" flexDirection="column" justifyContent="flex-start">
      {isCopyTrading && (
        <>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.allocated" />
          </Typography>
          <Box
            className="returns"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              {quote} {formatFloat(provider.currentAllocated)}
            </Typography>
            {/* <Typography variant="h5">$1280,46</Typography> */}
          </Box>
        </>
      )}
      <Typography variant="subtitle1">
        <FormattedMessage id="sort.return" />
      </Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <CustomTooltip title={<FormattedMessage id="trader.returnsince.tooltip" />}>
          <Typography className={color} variant="h5">
            {formatFloat2Dec(profitPerc)}%
          </Typography>
        </CustomTooltip>
        <CustomTooltip title={<FormattedMessage id="trader.returnsince.tooltip" />}>
          <Typography className={color} variant="h5">
            {quote} {formatFloat(provider.profitsSinceCopying)}
          </Typography>
        </CustomTooltip>
      </Box>
      {/* <Typography variant="subtitle1">Open positions now</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="red" variant="h5">
          .7%%
        </Typography>
        <Typography className="red" variant="h5">
          $2.4
        </Typography>
      </Box> */}
    </Box>
  );
};

export default UserSummary;
