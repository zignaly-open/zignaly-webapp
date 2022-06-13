import React from "react";
import styled from "styled-components";
import { Box, Grid, Popover, Typography } from "@material-ui/core";
import { getChainIcon } from "utils/chain";
import { FormattedMessage } from "react-intl";

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
  margin-left: 4px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Col = styled.div`
  display: flex;
  margin-right: 28px;
`;

const Divider = styled.span`
  background: #413ba0;
  width: 100%;
  height: 1px;
  align-self: center;
  margin: 15px 10px;
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
      {Object.entries(balance).map(
        ([network, amount]) =>
          network !== "total" && (
            <Row>
              <Col>
                <NetworkIcon network={network} />
                <Typography>{network}</Typography>
              </Col>
              <Col>
                <Typography>
                  {amount.balance}
                  <Coin>{coin.name}</Coin>
                </Typography>
              </Col>
            </Row>
          ),
      )}
      <Divider />
      <Row>
        <Col>
          <Typography>
            <FormattedMessage id="balance.available" />
          </Typography>
        </Col>
        <Col>
          <Typography>
            {balance.total.availableBalance}
            <Coin>{coin.name}</Coin>
          </Typography>
        </Col>
      </Row>
      <Row>
        <Col>
          <Typography>
            <FormattedMessage id="balance.locked" />
          </Typography>
        </Col>
        <Col>
          <Typography>
            {balance.total.balance - balance.total.availableBalance}
            <Coin>{coin.name}</Coin>
          </Typography>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col>
          <Typography>
            <FormattedMessage id="balance.staked" />
          </Typography>
        </Col>
        <Col>
          <Typography>
            {balance.total.staked}
            <Coin>{coin.name}</Coin>
          </Typography>
        </Col>
      </Row>
      <Row>
        <Col>
          <Typography>
            <FormattedMessage id="balance.unstaking" />
          </Typography>
        </Col>
        <Col>
          <Typography>
            {balance.total.unstaking}
            <Coin>{coin.name}</Coin>
          </Typography>
        </Col>
      </Row>
    </StyledPopover>
  );
};

export default WalletPopover;
