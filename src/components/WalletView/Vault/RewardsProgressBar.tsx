import React from "react";
import styled, { css } from "styled-components";
import { formatPrice } from "utils/formatters";
import CoinIcon from "../CoinIcon";

const Bar = styled.div`
  display: flex;
  box-shadow: inset 0px 1px 1px -1px rgba(73, 9, 123, 0.25);
  border-radius: 0 100px 100px 0;
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  height: 16px;
  width: 100%;
  position: relative;

  ${({ theme }) =>
    theme.palette.mode === "dark" &&
    css`
      border: 1px solid #413ba0;
    `}
`;

const BarFilled = styled.div`
  height: 100%;
  background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
  border-radius: 0 100px 100px 0;

  ${({ filled }: { filled: number }) =>
    css`
      width: ${filled}%;
    `}

  ${({ theme }) =>
    theme.palette.mode === "light" &&
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

const HundredPercMark = styled.div`
  width: 2px;
  height: 100%;
  margin-left: -1px;
  background-color: #ffffff;
  position: absolute;

  ${({ position }: { position: number }) =>
    css`
      left: ${position}%;
    `}

  span {
    font-size: 10px;
    font-weight: 700;
    position: absolute;
    top: 17px;
    left: -12px;
  }
`;

const CoinCircle = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -10px;
  left: -37px;
  z-index: 1;

  img {
    width: 24px;
    height: 24px;
  }

  ${({ theme }) =>
    theme.palette.mode === "light" &&
    css`
      // todo: temp for old theme
      border: 1px solid rgba(0, 0, 0, 0.1);
    `}
`;

const CoinsAmount = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 0 5px 37px;
  min-width: 137px;
`;
interface RewardsProgressBarProps {
  amount: number;
  progress: number;
  coin?: string;
  zigpadVariant?: boolean;
}

const RewardsProgressBar = ({ amount, coin, progress, zigpadVariant }: RewardsProgressBarProps) => {
  let max = Math.ceil(progress / 100) * 100;
  // if (zigpadVariant && max < 150) {
  //   max = 150;
  // }
  const progressNormalized = (progress * 100) / max;
  let hundredFloor = Math.floor(progress / 100) * 100;
  const hundredFloorNormalized = (hundredFloor * 100) / max;

  return (
    <Container>
      <CoinsAmount>
        {formatPrice(amount, "", " ", true)} {coin}
      </CoinsAmount>
      <Bar>
        <CoinCircle>
          <CoinIcon coin={coin} width={24} height={24} />
        </CoinCircle>
        <BarFilled filled={progressNormalized} />
        {zigpadVariant && hundredFloor > 0 && (
          <HundredPercMark position={hundredFloorNormalized}>
            <span>{hundredFloor}%</span>
          </HundredPercMark>
        )}
      </Bar>
    </Container>
  );
};

export default RewardsProgressBar;
