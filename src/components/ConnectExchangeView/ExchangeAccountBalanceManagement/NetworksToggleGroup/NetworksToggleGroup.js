import React from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

const NetworksToggleGroup = ({ networks, selectedNetwork, setSelectedNetwork }) => {
  if (networks.length < 1) return;

  return (
    <Box>
      <Typography variant="body1">
        <FormattedMessage id="deposit.network" />
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={selectedNetwork}
        onChange={(e, val) => setSelectedNetwork(val)}
        className="networkButtons"
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
