import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useState } from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage } from "react-intl";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { ConfirmDialogConfig } from "components/Dialogs/ConfirmDialog/ConfirmDialog";
import { ConfirmDialog } from "components/Dialogs";
import styled from "styled-components";
import AmountControl from "../AmountControl";
import { Controller, useForm } from "react-hook-form";

const PenaltyRow = ({ penalty }: { penalty: Penalty }) => {
  return (
    <>
      <FormattedMessage id="wallet.staking.offer.unstakingDays" values={{ days: penalty.days }} />
      &nbsp;&rarr;&nbsp;
      <FormattedMessage
        id="wallet.staking.offer.unstakingPenalty"
        values={{ percentage: penalty.percentage }}
      />
    </>
  );
};

export const Label = styled(Typography)`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 4px;
`;

interface UnstakeModalProps {
  onClose: () => void;
  onCancel: () => void;
  onSuccess: () => void;
  open: boolean;
  program: VaultOffer;
  coins: WalletCoins;
}

interface FormType {
  amount: string;
  penalty: string;
}

const UnstakeModal = ({
  onClose,
  onCancel,
  onSuccess,
  program,
  coins,
  open,
}: UnstakeModalProps) => {
  const dispatch = useDispatch();
  const [confirmConfig, setConfirmConfig] = useState<ConfirmDialogConfig>({
    titleTranslationId: "vault.staking.terms.title",
    messageTranslationId: "vault.staking.terms",
    values: { coin: program.coin },
    visible: false,
  });
  const coinData = coins ? coins[program.coin] : null;

  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
  } = useForm<FormType>({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = ({ amount }: FormType) => {
    setLoading(true);
    tradeApi
      .decreaseStake({
        programId: program.id,
        amount,
      })
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

  const setBalanceMax = () => {
    setValue("amount", program.stakeAmount);
    trigger("amount");
  };

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.unstake" />
        </Title>
        <ConfirmDialog
          confirmConfig={confirmConfig}
          showCancel={false}
          setConfirmConfig={setConfirmConfig}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          {program.unstakeEnabled ? (
            <>
              <AmountControl
                balance={program.stakeAmount}
                balanceLabel="vault.staked"
                setBalanceMax={setBalanceMax}
                decimals={coinData?.decimals}
                errors={errors}
                control={control}
                coin={program.coin}
                label="vault.unstake.amount"
                newDesign={true}
              />
              {program.penalties?.length > 0 && (
                <Box marginTop="36px">
                  <Label>
                    <FormattedMessage id="vault.unstake.chooseDuration" />
                  </Label>

                  <Controller
                    render={(data) => (
                      <RadioGroup aria-labelledby="penalties-label" name="penalties">
                        {program.penalties.map((p) => (
                          <FormControlLabel
                            key={p.percentage}
                            value={p.days.toString()}
                            control={<Radio />}
                            label={<PenaltyRow penalty={p} />}
                          />
                        ))}
                      </RadioGroup>
                    )}
                    name="penalty"
                    control={control}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography>
              <FormattedMessage id="vault.unstake.notPossible2" />
            </Typography>
          )}
          <Box display="flex" mt="8px">
            <Box
              display="flex"
              flexDirection="row"
              mt="32px"
              justifyContent="center"
              gridGap="12px"
            >
              <Button variant="outlined" onClick={onCancel}>
                <FormattedMessage id="accounts.back" />
              </Button>
              {program.unstakeEnabled && (
                <Button variant="contained" disabled={!isValid} loading={loading} type="submit">
                  <FormattedMessage id="vault.unstake" />
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Modal>
    </CustomModal>
  );
};

export default UnstakeModal;
