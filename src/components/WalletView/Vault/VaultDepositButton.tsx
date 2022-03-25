import Button from "components/Button";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import styled, { css } from "styled-components";
import { getStep } from "../Zigpad/ProjectDetailsModal";

const ButtonStyled = styled(Button)`
  max-width: 210px;
  span {
    font-size: 13px;
    white-space: nowrap;
  }
`;

const ActivatedButton = styled.div`
  min-width: 98px;
  background: rgba(38, 196, 193, 0.28);
  border-radius: 40px;
  padding: 12px 24px;
  display: flex;
  min-height: 32px;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  color: ${({ theme }) => (theme.palette.mode === "dark" ? "#B1F7CA" : "#36373f")};
  max-width: 210px;
  span {
    white-space: nowrap;
  }
`;

const ActivatedButtonPledge = styled(ActivatedButton)`
  padding: 5px 7px;
  flex-wrap: wrap;
  ${({ active, theme }: { active?: boolean }) =>
    !active &&
    css`
      background: rgba(48, 122, 233, 0.28);
      color: ${theme.palette.mode === "dark" ? "#bec5fd" : "#3244d3"};
    `}
`;

const InactiveButton = styled(ActivatedButtonPledge)`
  white-space: nowrap;
`;

interface VaultDepositButtonProps {
  onClick: () => void;
  vault: VaultOffer;
  balance: number;
  depositEnabled: boolean;
}

const VaultDepositButton = ({
  balance,
  vault,
  depositEnabled,
  onClick,
}: VaultDepositButtonProps) => {
  return balance >= vault.minBalance ? (
    <ActivatedButton>
      <FormattedMessage id="vault.activated" />
    </ActivatedButton>
  ) : depositEnabled ? (
    <ButtonStyled className="textPurple borderPurple" onClick={onClick}>
      <FormattedMessage id="accounts.deposit" />
      &nbsp;
      <NumberFormat value={vault.minBalance} displayType="text" suffix={` ${vault.coin}`} />
    </ButtonStyled>
  ) : (
    <InactiveButton>
      <FormattedMessage id="vault.holders" values={{ coin: vault.coin }} />
    </InactiveButton>
  );
};

export default VaultDepositButton;

interface PledgeButtonProps {
  onClick: () => void;
  project: LaunchpadProject;
}

export const PledgeButton = ({ project, onClick }: PledgeButtonProps) => {
  const status = getStep(project);

  if (status === 1) {
    return (
      <ButtonStyled onClick={onClick}>
        <FormattedMessage id="zigpad.getready" />
      </ButtonStyled>
    );
  }

  return status > 2 || project.pledged ? (
    <ActivatedButtonPledge active={project.pledged > 0}>
      <span>
        {status === 2 ? (
          <FormattedMessage id="zigpad.pledged" />
        ) : status === 3 ? (
          <FormattedMessage
            id={`${project.pledged ? "zigpad.calculatingPledged" : "zigpad.calculating"}`}
          />
        ) : (
          <FormattedMessage id="zigpad.waitingDistribution" />
        )}
        &nbsp;
      </span>
      {project.pledged > 0 &&
        (status > 3 ? (
          <NumberFormat
            value={project.tokenReward}
            thousandSeparator={true}
            displayType="text"
            suffix={` ${project.coin}`}
          />
        ) : (
          <NumberFormat
            value={project.pledged}
            thousandSeparator={true}
            displayType="text"
            suffix=" ZIG"
          />
        ))}
    </ActivatedButtonPledge>
  ) : (
    <ButtonStyled onClick={onClick}>
      <FormattedMessage id="zigpad.pledge" />
    </ButtonStyled>
  );
};
