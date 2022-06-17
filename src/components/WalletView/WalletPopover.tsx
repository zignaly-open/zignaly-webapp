import React from "react";
import styled from "styled-components";
import { Box, Grid, Popover, Typography } from "@material-ui/core";
import { getChainIcon } from "utils/chain";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

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

interface BalanceRowProps {
  network?: string;
  label?: string;
  amount: number;
  coin: WalletCoin;
}

const BalanceRow = ({ network, label, amount, coin }: BalanceRowProps) => (
  <Row>
    <Col>
      {network ? (
        <>
          <NetworkIcon network={network} />
          <Typography>{network}</Typography>
        </>
      ) : (
        <Typography>
          <FormattedMessage id={label} />
        </Typography>
      )}
    </Col>
    <Col>
      <Typography>
        <NumberFormat
          value={amount}
          displayType="text"
          thousandSeparator={true}
          decimalScale={coin.name === "ZIG" ? 2 : coin.decimals}
        />
        <Coin>{coin.name}</Coin>
      </Typography>
    </Col>
  </Row>
);

interface WalletPopoverProps {
  anchorEl: Element;
  handleClose: any;
  balance: BalanceData;
  coin: WalletCoin;
  showNetworks?: boolean;
  showLocked?: boolean;
}
const WalletPopover = ({
  anchorEl,
  handleClose,
  balance,
  coin,
  showNetworks,
  showLocked,
}: WalletPopoverProps) => {
  return (
    <StyledPopover anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
      {showNetworks && (
        <>
          {Object.entries(balance).map(
            ([network, amount]) =>
              network !== "total" && (
                <BalanceRow network={network} amount={amount.balance} coin={coin} />
              ),
          )}
          <Divider />
        </>
      )}
      {showLocked && (
        <>
          <BalanceRow label="balance.available" amount={balance.availableBalance} coin={coin} />
          <BalanceRow label="balance.locked" amount={balance.locked} coin={coin} />
          <Divider />
        </>
      )}
      <BalanceRow label="balance.staked" amount={balance.staked} coin={coin} />
      <BalanceRow label="balance.unstaking" amount={balance.unstaking} coin={coin} />
    </StyledPopover>
  );
};

export default WalletPopover;
