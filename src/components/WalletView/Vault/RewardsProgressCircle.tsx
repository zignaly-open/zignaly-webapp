import React from "react";
import styled, { css } from "styled-components";
import { format2Dec, formatPrice } from "utils/formatters";
import CoinIcon from "../CoinIcon";
import { CircularProgress } from "@material-ui/core";

const CircleContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const CircularProgressBg = styled(CircularProgress)`
  padding: 0;

  .MuiCircularProgress-svg {
    color: #cccaef;
  }
`;

const CircularProgressFilled = styled(CircularProgress)`
  position: absolute;
  left: 0;
  padding: 0;

  .MuiCircularProgress-circle {
    stroke: url(#filled_gradient_dark);

    ${({ theme }) =>
      theme.palette.type === "light" &&
      css`
        stroke: url(#filled_gradient_light);
      `}
  }
`;

const Perc = styled.div`
  font-weight: 600;
  font-size: 13px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

interface RewardsProgressCircleProps {
  rewardsTotal: number;
  rewardsRemaining: number;
}

const RewardsProgressCircle = ({ rewardsTotal, rewardsRemaining }: RewardsProgressCircleProps) => {
  const percFilled = ((rewardsTotal - rewardsRemaining) / rewardsTotal) * 100;
  return (
    <CircleContainer>
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="filled_gradient_dark"
            x1="60"
            y1="0.000199556"
            x2="33.9945"
            y2="72.2376"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#149CAD" />
            <stop offset="1" stopColor="#4540C1" />
          </linearGradient>
          <linearGradient
            id="filled_gradient_light"
            x1="0.000487451"
            y1="49.6873"
            x2="33.7715"
            y2="-6.04836"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A600FB" />
            <stop offset="0.260417" stopColor="#6F06FC" />
            <stop offset="0.625" stopColor="#4959F5" />
            <stop offset="0.828125" stopColor="#2E8DDF" />
            <stop offset="1" stopColor="#12C1C9" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgressBg size={60} value={100} variant="determinate" />
      <CircularProgressFilled size={60} value={percFilled} variant="determinate" />
      <Perc>{percFilled.toFixed(2)}%</Perc>
    </CircleContainer>
  );
};

export default RewardsProgressCircle;
