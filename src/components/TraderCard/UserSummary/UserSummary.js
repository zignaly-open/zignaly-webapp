import React, { useState, useEffect } from "react";
import "./UserSummary.scss";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { Box, Typography } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import { FormattedMessage } from "react-intl";
import CustomTooltip from "../../CustomTooltip";
/**
 * @typedef {import('../../../services/tradeApiClient.types').ConnectedProviderUserInfo} ConnectedProviderUserInfo
 */

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
  /**
   * @type {ConnectedProviderUserInfo}
   */
  const initialState = {
    currentAllocated: 0,
    profitsSinceCopying: 0,
  };
  const [providerUserInfo, setProviderUserInfo] = useState(initialState);
  const profitPerc = providerUserInfo.currentAllocated
    ? (providerUserInfo.profitsSinceCopying / providerUserInfo.currentAllocated) * 100
    : 0;
  const color = profitPerc >= 0 ? "green" : "red";

  const storeSession = useStoreSessionSelector();

  const loadData = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      providerId,
    };

    tradeApi
      .connectedProviderUserInfoGet(payload)
      .then((data) => {
        setProviderUserInfo(data);
      })
      .catch((e) => {
        alert(`ERROR: ${e.message}`);
      });
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken]);

  return (
    <Box className="userSummary" display="flex" flexDirection="column" justifyContent="flex-start">
      <Typography variant="subtitle1">
        <FormattedMessage id="srv.allocated" />
      </Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">
          {quote} {formatFloat(providerUserInfo.currentAllocated)}
        </Typography>
        {/* <Typography variant="h5">$1280,46</Typography> */}
      </Box>
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
            {quote} {formatFloat(providerUserInfo.profitsSinceCopying)}
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
