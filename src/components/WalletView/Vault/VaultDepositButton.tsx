import Button from "components/Button";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import styled, { css } from "styled-components";

const ButtonStyled = styled(Button)`
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
  height: 32px;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.palette.type === "dark" ? "#B1F7CA" : "#36373f")};
  span {
    white-space: nowrap;
  }
`;

const ActivatedButtonPledge = styled(ActivatedButton)`
  text-transform: capitalize;
  padding: 12px;
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
  pledged: number;
}

export const PledgeButton = ({ pledged, onClick }: PledgeButtonProps) => {
  return pledged ? (
    <ActivatedButtonPledge>
      <FormattedMessage id="zigpad.pledged" />
      &nbsp;
      <NumberFormat value={pledged} thousandSeparator={true} displayType="text" suffix=" ZIG" />
    </ActivatedButtonPledge>
  ) : (
    <ButtonStyled onClick={onClick}>
      <FormattedMessage id="zigpad.pledge" />
    </ButtonStyled>
  );
};
