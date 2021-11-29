import React from "react";
import styled, { css } from "styled-components";
import { formatPrice } from "utils/formatters";
import CoinIcon from "../CoinIcon";

const Bar = styled.div`
  margin: 0 15px;
  display: flex;
  box-shadow: inset 0px 1px 1px -1px rgba(73, 9, 123, 0.25);
  border-radius: 100px;
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  height: 16px;
  width: calc(100% - 15px);

  ${({ theme }) =>
    theme.palette.type === "dark" &&
    css`
      border: 1px solid #413ba0;
    `}
`;

const BarFilled = styled.div`
  height: 100%;
  background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
  position: relative;
  border-radius: 100px;

  ${({ filled }: { filled: number }) =>
    css`
      width: ${filled}%;
    `}

  ${({ theme }) =>
    theme.palette.type === "light" &&
    css`
      background: linear-gradient(
        121.21deg,
        #a600fb 10.7%,
        #6f06fc 31.3%,
        #4959f5 60.13%,
        #2e8ddf 76.19%,
        #12c1c9 89.78%
      );
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

  ${({ theme }) =>
    theme.palette.type === "light" &&
    css`
      // todo: temp for old theme
      border: 1px solid rgba(0, 0, 0, 0.1);
    `}
`;

const CoinsAmount = styled.div`
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  top: -15px;
  white-space: nowrap;
  font-weight: 600;
`;

const Coin = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme.newTheme.purple};
`;

interface RewardsProgressBarProps {
  vault: VaultOffer;
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
