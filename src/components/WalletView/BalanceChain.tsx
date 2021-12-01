import { Box } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import React, { useState } from "react";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import { getChainIcon } from "utils/chain";
import WalletPopover from "./WalletPopover";

const BalanceChainBox = styled(Box)`
  line-height: 16px;
`;

const BalanceText = styled.span`
  color: ${(props) => props.theme.newTheme.secondaryText};
  margin-left: 8px;
  font-weight: 600;
  font-size: 12px;
`;

const Zig = styled.span`
  color: ${(props) => props.theme.newTheme.purple};
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 16px;
  margin-left: 4px;
`;

const ChevronRightStyled = styled(ChevronRight)`
  color: #65647e;
  cursor: pointer;
`;

interface BalanceChainProps {
  walletBalance: WalletBalance;
  coins: WalletCoins;
}

const BalanceChain = ({ walletBalance, coins }: BalanceChainProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Wait for data fetching, and ZIG balance
  if (!walletBalance?.ZIG || !coins) return null;

  const networks = Object.keys(walletBalance.ZIG).filter((k) => k !== "total");

  // Get 1st chain with coins
  const chainWithCoin = networks.find((key) => {
    return parseFloat(walletBalance.ZIG[key].balance) > 0;
  });
  if (!chainWithCoin) return null;

  return (
    <BalanceChainBox alignItems="center" display="flex" flexDirection="row" mt="3px">
      <img width={20} height={20} src={getChainIcon(chainWithCoin)} title={chainWithCoin} />
      <BalanceText>
        <NumberFormat
          value={walletBalance.ZIG[chainWithCoin]?.balance || 0}
          thousandSeparator={true}
          displayType="text"
        />
      </BalanceText>
      <Zig>ZIG</Zig> {networks.length > 1 && <ChevronRightStyled onClick={handleClick} />}
      <WalletPopover
        anchorEl={anchorEl}
        balance={walletBalance.ZIG}
        coin={coins.ZIG}
        handleClose={handleClose}
      />
    </BalanceChainBox>
  );
};
export default BalanceChain;
