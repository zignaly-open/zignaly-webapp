import { Box, Checkbox, FormControlLabel, Slider, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useContext, useState } from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { Controller } from "react-hook-form";
import { ConfirmDialogConfig } from "components/Dialogs/ConfirmDialog/ConfirmDialog";
import { ConfirmDialog } from "components/Dialogs";
import NumberFormat from "react-number-format";
import styled from "styled-components";

const StakeValue = styled(Typography)`
  font-size: 18px;
`;

interface VaultStakeConfirmModalProps {
  onClose: () => void;
  onCancel: () => void;
  onSuccess: () => void;
  open: boolean;
  amount: number | string;
  addAmount: number | string; // For Edit
  asideAmount: number | string;
  addAsideAmount: number | string; // For Edit
  program: VaultOffer;
  coins: WalletCoins;
  boost: number;
  isEdit: boolean;
}

const VaultStakeConfirmModal = ({
  onClose,
  onSuccess,
  onCancel,
  open,
  amount,
  addAmount,
  asideAmount,
  addAsideAmount,
  program,
  coins,
  boost,
  isEdit,
}: VaultStakeConfirmModalProps) => {
  const dispatch = useDispatch();
  const [confirmConfig, setConfirmConfig] = useState<ConfirmDialogConfig>({
    titleTranslationId: "vault.staking.terms.title",
    messageTranslationId: "vault.staking.terms",
    values: { coin: program.coin },
    visible: false,
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    const data = {
      programId: program.id,
      amount: isEdit ? addAmount : amount,
      asideAmount: isEdit ? addAsideAmount : asideAmount,
    };
    const method = isEdit ? tradeApi.increaseStake(data) : tradeApi.stake(data);
    method
      .then(() => {
        dispatch(showSuccessAlert("", "wallet.staking.success"));
        onSuccess();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.confirmStake" />
        </Title>
        <ConfirmDialog
          confirmConfig={confirmConfig}
          showCancel={false}
          setConfirmConfig={setConfirmConfig}
        />
        <StakeValue>
          <>
            <FormattedMessage
              id={isEdit ? "wallet.staking.stakedAlready" : "wallet.staking.coin"}
            />
            &nbsp;
            <b>
              <NumberFormat
                value={amount}
                displayType="text"
                thousandSeparator={true}
                decimalScale={coins[program.coin].decimals}
                suffix={` ${program.coin}`}
              />
            </b>
            {Boolean(asideAmount) && (
              <>
                &nbsp;+&nbsp;
                <b>
                  <NumberFormat
                    value={asideAmount}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={coins[program.asideCoin].decimals}
                    suffix={` ${program.asideCoin}`}
                  />
                </b>
              </>
            )}
          </>
        </StakeValue>
        {Boolean(addAmount) && (
          <StakeValue>
            <>
              <FormattedMessage
                id="wallet.staking.stakeAdd"
                values={{
                  amount: (
                    <b>
                      <NumberFormat
                        value={addAmount}
                        displayType="text"
                        thousandSeparator={true}
                        decimalScale={coins[program.coin].decimals}
                        suffix={` ${program.coin}`}
                      />
                    </b>
                  ),
                }}
              />
              {Boolean(addAsideAmount) && (
                <>
                  &nbsp;+&nbsp;
                  <b>
                    <NumberFormat
                      value={addAsideAmount}
                      displayType="text"
                      thousandSeparator={true}
                      decimalScale={coins[program.asideCoin].decimals}
                      suffix={` ${program.asideCoin}`}
                    />
                  </b>
                </>
              )}
            </>
          </StakeValue>
        )}
        {boost && (
          <StakeValue>
            <FormattedMessage id="vault.boost" />
            &nbsp;<b>{boost}x</b>
          </StakeValue>
        )}
        <FormControlLabel
          style={{
            marginTop: "24px",
            marginBottom: "12px",
            alignItems: "flex-start",
          }}
          control={
            <Checkbox
              style={{ marginTop: "-9px" }}
              checked={termsChecked}
              onChange={(e, value) => setTermsChecked(value)}
            />
          }
          label={
            <FormattedMessage
              id="vault.staking.terms.agree"
              values={{
                a: (chunks: string) => (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                    onClick={(e) => {
                      setConfirmConfig({ ...confirmConfig, visible: true });
                      e.preventDefault();
                    }}
                  >
                    {chunks}
                  </a>
                ),
              }}
            />
          }
        />

        <Box display="flex" flexDirection="row" mt="32px" justifyContent="center" gridGap="12px">
          <Button variant="outlined" onClick={onCancel}>
            <FormattedMessage id="accounts.back" />
          </Button>
          <Button variant="contained" onClick={submit} disabled={!termsChecked} loading={loading}>
            <FormattedMessage id="vault.stakeExcl" />
          </Button>
        </Box>
      </Modal>
    </CustomModal>
  );
};

export default VaultStakeConfirmModal;
