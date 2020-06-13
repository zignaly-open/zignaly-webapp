import React from "react";
import "./UserSummary.scss";
import useProviderUserInfo from "../../../hooks/useProviderUserInfo";
import { Box, Typography } from "@material-ui/core";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";

/**
 * @typedef {Object} DefaultProps
 * @property {string} providerId Provider Id.
 * @property {string} quote Quote traded by provider.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const UserSummary = ({ providerId, quote }) => {
  const providerUserInfo = useProviderUserInfo(providerId);
  const profitPerc = providerUserInfo.currentAllocated
    ? (providerUserInfo.profitsSinceCopying / providerUserInfo.currentAllocated) * 100
    : 0;
  const color = profitPerc >= 0 ? "green" : "red";

  return (
    <Box className="userSummary" display="flex" flexDirection="column" justifyContent="flex-start">
      <Typography variant="subtitle1">Allocated</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">
          {quote} {formatFloat(providerUserInfo.currentAllocated)}
        </Typography>
        {/* <Typography variant="h5">$1280,46</Typography> */}
      </Box>
      <Typography variant="subtitle1">Return since copying</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className={color} variant="h5">
          {formatFloat2Dec(profitPerc)}%
        </Typography>
        <Typography className={color} variant="h5">
          {quote} {formatFloat(providerUserInfo.profitsSinceCopying)}
        </Typography>
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
