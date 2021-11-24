import { Button } from "@material-ui/core";
import CustomButton from "components/CustomButton";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import styled, { css } from "styled-components";
import { isMobile } from "styles/styles";

const ButtonStyled = styled(CustomButton)`
  && {
    min-width: auto;
    min-height: auto;
    width: auto;
  }

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
  color: #36373f;

  ${isMobile(css`
    min-width: 98px;
  `)}
`;

interface VaultDepositButtonProps {
  onClick: () => void;
  vault: Vault;
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
