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
  text-transform: uppercase;
  color: ${({ theme }) => (theme.palette.type === "dark" ? "#B1F7CA" : "#36373f")};
  max-width: 210px;
  span {
    white-space: nowrap;
  }
`;

const ActivatedButtonPledge = styled(ActivatedButton)`
  text-transform: capitalize;
  padding: 5px 5px;
  flex-wrap: wrap;
  ${({ active = true }: { active: boolean }) =>
    !active &&
    css`
      background: rgba(48, 122, 233, 0.28);
    `}
`;

interface VaultDepositButtonProps {
  onClick: () => void;
  vault: VaultOffer;
  balance: number;
}

const VaultDepositButton = ({ balance, vault, onClick }: VaultDepositButtonProps) => {
  return balance >= vault.minBalance ? (
    <ActivatedButton>
      <FormattedMessage id="vault.activated" />
    </ActivatedButton>
  ) : (
    <ButtonStyled className="textPurple borderPurple" onClick={onClick}>
      <FormattedMessage id="accounts.deposit" />
      &nbsp;
      <NumberFormat value={vault.minBalance} displayType="text" suffix={` ${vault.coin}`} />
    </ButtonStyled>
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

  return status >= 3 ? (
    <ActivatedButtonPledge active={project.pledged > 0}>
      <span>
        {status === 3 ? (
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
      {project.pledged ? (
        <>
          <FormattedMessage id="zigpad.pledged" />
          &nbsp;
          <NumberFormat
            value={project.pledged}
            thousandSeparator={true}
            displayType="text"
            suffix=" ZIG"
          />
        </>
      ) : (
        <FormattedMessage id="zigpad.pledge" />
      )}
    </ButtonStyled>
  );
};
