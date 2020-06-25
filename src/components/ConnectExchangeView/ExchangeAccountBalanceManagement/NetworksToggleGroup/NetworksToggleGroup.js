import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").CoinNetwork} CoinNetwork
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 * @typedef {Object} NetworksToggleGroupPropTypes
 * @property {Array<CoinNetwork>} networks Networks.
 * @property {CoinNetwork} selectedNetwork Selected network.
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
          <ToggleButton key={n.name} value={n}>
            {n.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default NetworksToggleGroup;
