import React from "react";
import styled, { css } from "styled-components";
import { Grid, Popover, Typography } from "@material-ui/core";
import { getChainIcon } from "utils/chain";

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    background: #222249;
    border: 1px solid #413ba0;
    border-radius: 4px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 228px;
    color: #ffffff;
  }
`;

const Coin = styled.span`
  letter-spacing: 0.66px;
  text-transform: uppercase;
  color: #acb6ff;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin-left: 4px;
`;

const NetworkIcon = ({ network }: { network: string }) => {
  return <img height={20} src={getChainIcon(network)} style={{ marginRight: "10px" }} width={20} />;
};

interface WalletPopoverProps {
  anchorEl: Element;
  handleClose: any;
  balance: Record<string, BalanceData>;
  coin: WalletCoin;
}
const WalletPopover = ({ anchorEl, handleClose, balance, coin }: WalletPopoverProps) => {
  return (
    <StyledPopover anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
      <Grid container direction="column" spacing={2}>
        {Object.entries(balance).map(([key, amount]) => {
          if (key !== "total") {
            const network = coin.networks.find((n) => n.network === key);
            if (network) {
              return (
                <Grid alignItems="center" container item key={key} xs={12}>
                  <Grid container item wrap="nowrap" xs={6}>
                    <NetworkIcon network={network.network} />
                    <Typography>{network.network}</Typography>
                  </Grid>
                  <Grid container item xs={6}>
                    <Typography align="center" style={{ flex: 1 }}>
                      {amount.balance}
                      <Coin>{coin.name}</Coin>
                    </Typography>
                  </Grid>
                </Grid>
              );
            }
          }
          return null;
        })}
      </Grid>
    </StyledPopover>
  );
};

export default WalletPopover;
