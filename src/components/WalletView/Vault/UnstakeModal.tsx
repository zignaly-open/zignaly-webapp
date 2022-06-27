import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useState } from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/Button";
import tradeApi from "services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "store/actions/ui";
import { ConfirmDialogConfig } from "components/Dialogs/ConfirmDialog/ConfirmDialog";
import styled from "styled-components";
import AmountControl from "../AmountControl";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { floatify, formatDateTimeUTC } from "utils/format";
import dayjs from "dayjs";
import { BalanceLabelSmall, SecondaryTextSmall } from "./VaultStakeModal";

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
  days: string;
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
  const [confirmData, setConfirmData] = useState<FormType>(null);
  const coinData = coins ? coins[program.coin] : null;
  const intl = useIntl();

  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
    setError,
  } = useForm<FormType>({
    mode: "onChange",
    defaultValues: {
      days: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data: FormType) => {
    const remainingAmount = program.stakeAmount - parseFloat(data.amount);
    if (remainingAmount > 0 && remainingAmount < program.minBalance) {
      // User unstake not all, and remaining is under min balance
      setError("amount", {
        type: "notMatch",
        message: intl.formatMessage({ id: "form.error.unstake.minAmount" }),
      });
      return;
    }

    setConfirmData(data);
  };

  const unstake = () => {
    setLoading(true);
    tradeApi
      .decreaseStake({
        programId: program.id,
        amount: confirmData.amount,
        days: confirmData.days,
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

  const getPenalty = () =>
    confirmData.days
      ? program.penalties.find((p) => p.days.toString() === confirmData.days).percentage
      : 0;

  const getFinalAmount = () => {
    return floatify((parseFloat(confirmData.amount) * (100 - getPenalty())) / 100);
  };

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.unstake" />
        </Title>
        {confirmData ? (
          <>
            {confirmData.days && (
              <>
                <Typography>
                  <FormattedMessage id="vault.unstake.penalty" />
                  &nbsp;
                  {getPenalty()}%
                </Typography>
                <br />
              </>
            )}
            <Typography>
              <FormattedMessage
                id={
                  parseFloat(confirmData?.days) > 0
                    ? "vault.unstake.confirmWithDate"
                    : "vault.unstake.confirm"
                }
                values={{
                  amount: (
                    <>
                      <b>
                        <NumberFormat
                          value={getFinalAmount()}
                          displayType="text"
                          thousandSeparator={true}
                          decimalScale={coinData.decimals}
                          suffix={` ${coinData.name}`}
                        />
                      </b>
                      {program.asideAmount > 0 &&
                        program.stakeAmount === parseFloat(confirmData.amount) && (
                          <>
                            &nbsp;+&nbsp;
                            <b>
                              <NumberFormat
                                value={program.asideAmount}
                                displayType="text"
                                thousandSeparator={true}
                                decimalScale={coins[program.asideCoin].decimals}
                                suffix={` ${program.asideCoin}`}
                              />
                            </b>
                          </>
                        )}
                    </>
                  ),
                  date: (
                    <b>
                      {formatDateTimeUTC(dayjs().add(parseInt(confirmData.days), "d").toString())}
                    </b>
                  ),
                }}
              />
            </Typography>
            <br />
            {!(parseFloat(confirmData?.days) > 0) && (
              <Typography>
                <FormattedMessage id="vault.unstake.timeWarning" />
              </Typography>
            )}
            <Box
              display="flex"
              flexDirection="row"
              mt="32px"
              justifyContent="center"
              gridGap="12px"
            >
              <Button variant="outlined" onClick={() => setConfirmData(null)}>
                <FormattedMessage id="accounts.back" />
              </Button>
              <Button variant="contained" onClick={unstake} loading={loading}>
                <FormattedMessage id="vault.unstake" />
              </Button>
            </Box>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {program.unstakeEnabled && (
              <>
                <AmountControl
                  balance={program.stakeAmount}
                  balanceLabel="vault.staked"
                  setBalanceMax={setBalanceMax}
                  maxAmount={program.stakeAmount}
                  decimals={coinData?.decimals}
                  errors={errors}
                  control={control}
                  coin={program.coin}
                  label="vault.unstake.amount"
                  newDesign={true}
                />
                <Box display="flex" mt="8px">
                  <SecondaryTextSmall>
                    <FormattedMessage id="wallet.staking.minBalance" />
                  </SecondaryTextSmall>
                  <BalanceLabelSmall>
                    <NumberFormat
                      value={program.minBalance}
                      displayType="text"
                      thousandSeparator={true}
                      decimalScale={coinData?.decimals}
                    />
                    &nbsp;{program.coin}
                  </BalanceLabelSmall>
                </Box>
                {program.penalties?.length > 0 && (
                  <Box marginTop="36px">
                    <Label>
                      <FormattedMessage id="vault.unstake.chooseDuration" />
                    </Label>

                    <Controller
                      render={(data) => (
                        <RadioGroup aria-labelledby="penalties-label" name="penalties" {...data}>
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
                      name="days"
                      control={control}
                      rules={{ required: true }}
                    />
                  </Box>
                )}
              </>
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
        )}
      </Modal>
    </CustomModal>
  );
};

export default UnstakeModal;
