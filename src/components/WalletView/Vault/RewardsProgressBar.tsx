import { Box } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import { formatPrice } from "utils/formatters";
import CoinIcon from "../CoinIcon";

const Bar = styled.div`
  margin: 0 15px;
  display: flex;
  border: 1px solid #413ba0;
  box-shadow: inset 0px 1px 1px -1px rgba(73, 9, 123, 0.25);
  border-radius: 100px;
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  height: 16px;
  width: calc(100% - 15px);
`;

const BarFilled = styled.div`
  height: 100%;
  background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
  position: relative;
  border-radius: 100px;

  ${(props: { filled: number }) =>
    css`
      width: ${props.filled}%;
    `}
`;

const CoinCircle = styled.div`
  width: 34px;
  height: 34px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -10px;
  right: -16px;

  img {
    width: 24px;
    height: 24px;
  }
`;

const CoinsAmount = styled.div`
  position: absolute;
  font-size: 11px;
  line-height: 16px;
  top: -14px;
  white-space: nowrap;
`;

const Coin = styled.span`
  color: ${(props) => props.theme.newTheme.purple};
`;

interface RewardsProgressBarProps {
  vault: Vault;
}

const RewardsProgressBar = ({ vault }: RewardsProgressBarProps) => {
  const { rewardsTotal, rewardsRemaining, coinReward } = vault;
  const percFilled = ((rewardsTotal - rewardsRemaining) / rewardsTotal) * 100;
  return (
    <Bar>
      <BarFilled filled={percFilled}>
        <CoinCircle>
          <CoinsAmount>
            {formatPrice(rewardsRemaining, "", " ", true)} <Coin>{coinReward}</Coin>
          </CoinsAmount>
          <CoinIcon coin={coinReward} />
        </CoinCircle>
      </BarFilled>
    </Bar>
  );
};

export default RewardsProgressBar;
