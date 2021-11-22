import { Box } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";

const Bar = styled.div`
  display: flex;
  border: 1px solid #413ba0;
  box-shadow: inset 0px 1px 1px -1px rgba(73, 9, 123, 0.25);
  border-radius: 100px;
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  height: 16px;
  width: 100%;
`;

const BarFilled = styled.div`
  height: 100%;
  background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);

  ${(props: { filled: number }) =>
    css`
      width: ${props.filled}%;
    `}
`;

interface RewardsProgressBarProps {
  vault: Vault;
}

const RewardsProgressBar = ({ vault }: RewardsProgressBarProps) => {
  const percFilled = (vault.rewardsRemaining / vault.rewardsTotal) * 100;

  return (
    <Bar>
      <BarFilled filled={percFilled} />
    </Bar>
  );
};

export default RewardsProgressBar;
