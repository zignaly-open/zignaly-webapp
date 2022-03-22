import React from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

/**
 * @typedef {import("../../../../services/tradeApiClient.types").CoinNetwork} CoinNetwork
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Object} NetworksToggleGroupPropTypes
 * @property {Array<string>} networks Networks.
 * @property {string} selectedNetwork Selected network.
 * @property {function} setSelectedNetwork Callback to select network.
 */

/**
 * Provides a toggle buttons group to select network.
 *
 * @param {NetworksToggleGroupPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const NetworksToggleGroup = ({ networks, selectedNetwork, setSelectedNetwork }) => {
  if (networks.length < 1) return null;

  return (
    <Box>
      <Typography variant="body1">
        <FormattedMessage id="deposit.network" />
      </Typography>
      <ToggleButtonGroup
        className="networkButtons"
        exclusive
        onChange={(e, val) => setSelectedNetwork(val)}
        value={selectedNetwork}
      >
        {networks.map((n) => (
          <ToggleButton key={n} value={n}>
            {n}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default NetworksToggleGroup;
