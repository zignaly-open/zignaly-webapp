import { Box, Slider, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Title, Modal, TextDesc } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import AmountControl from "../AmountControl";
import { useForm } from "react-hook-form";
import PrivateAreaContext from "context/PrivateAreaContext";
import Button from "components/Button";
import VaultStakeConfirmModal from "./VaultStakeConfirmModal";
import { Alert } from "@material-ui/lab";

const StyledTextDesc = styled(TextDesc)`
  margin-bottom: 24px;
`;

const SliderContainer = styled.div<{ value: number }>`
  margin: 0 32px 42px;

  .MuiSlider-markLabelActive[data-index="${({ value }) => value}"] {
    font-weight: 700;
  }
`;

const BoostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SecondaryText = styled(Typography)`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-weight: 600;
  font-size: 18px;
`;

const SecondaryTextSmall = styled(SecondaryText)`
  font-size: 14px;
`;

const BalanceLabel = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  margin-left: 4px;
`;

const BalanceLabelSmall = styled(BalanceLabel)`
  font-size: 14px;
`;

const StakeTypography = styled(Typography)`
  margin: 20px 0 22px;
  font-weight: 600;
`;

interface FormType {
  amount: string;
}

interface VaultStakeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  open: boolean;
  vaultProject: VaultOffer;
  coins: WalletCoins;
  onDepositMore: () => void;
  onOpenOffer: () => void;
}

const VaultStakeModal = ({
  onClose,
  open,
  vaultProject,
  coins,
  onSuccess,
  onDepositMore,
  onOpenOffer,
}: VaultStakeModalProps) => {
  const { coin } = vaultProject;
  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid, isDirty },
    setValue,
    trigger,
    watch,
  } = useForm<FormType>({
    mode: "onChange",
  });

  const coinData = coins ? coins[coin] : null;
  const { walletBalance } = useContext(PrivateAreaContext);
  const balanceAmount = walletBalance[coin].total;
  const [boostId, setBoostId] = useState(0);
  const [confirmData, setConfirmData] = useState<FormType>(null);
  const selectedBoost = vaultProject.boosts ? vaultProject.boosts[boostId] : null;
  const balanceAmountAside = vaultProject.asideCoin
    ? walletBalance[vaultProject.asideCoin].total
    : null;
  const enoughZIG =
    !vaultProject.asideMinimum ||
    balanceAmountAside.availableBalance >=
      (boostId ? vaultProject.boosts[boostId].minimum : vaultProject.asideMinimum);
  const isEdit = false;

  const getLabel = (boost: Boost) => (
    <BoostContainer>
      <NumberFormat
        value={boost.minimum}
        displayType="text"
        thousandSeparator={true}
        decimalScale={2}
        suffix={` ${vaultProject.asideCoin}`}
      />
      {boost.percentage}x
    </BoostContainer>
  );
  const boostMarks = vaultProject.boosts.map((b, index) => ({ value: index, label: getLabel(b) }));

  const setBalanceMax = () => {
    setValue("amount", balanceAmount.availableBalance);
    trigger("amount");
  };

  const onSubmit = (data: FormType) => {
    setConfirmData(data);
  };

  const Confirmation = useCallback(
    () => (
      <VaultStakeConfirmModal
        amount={isEdit ? vaultProject.stakeAmount : confirmData.amount}
        addAmount={isEdit ? confirmData.amount : null}
        program={vaultProject}
        asideAmount={selectedBoost?.minimum || vaultProject.asideMinimum}
        addAsideAmount={null}
        boost={selectedBoost?.percentage}
        onClose={onClose}
        onSuccess={onSuccess}
        onCancel={() => setConfirmData(null)}
        open={true}
        coins={coins}
        isEdit={isEdit}
      />
    ),
    [confirmData, selectedBoost, coins],
  );

  const MinStakingRequired = useCallback(
    () =>
      vaultProject.asideMinimum > 0 && (
        <Box marginTop="14px">
          {!enoughZIG && (
            <Typography color="error">
              <FormattedMessage
                id="vault.insufficientAmount"
                values={{
                  coin: vaultProject.asideCoin,
                  a: (chunks: string) => (
                    <a className="link" onClick={onDepositMore}>
                      {chunks}
                    </a>
                  ),
                }}
              />
            </Typography>
          )}
          {!isEdit && (
            <Typography>
              <FormattedMessage
                id="vault.minAmount"
                values={{
                  amount: (
                    <b>
                      <NumberFormat
                        value={vaultProject.asideMinimum}
                        displayType="text"
                        thousandSeparator={true}
                        decimalScale={2}
                        suffix={` ${vaultProject.asideCoin}`}
                      />
                    </b>
                  ),
                }}
              />
            </Typography>
          )}
        </Box>
      ),
    [enoughZIG],
  );

  const UnstakeWarning = useCallback(
    () => (
      <Box marginTop="14px">
        {!vaultProject.unstakeEnabled ? (
          <Alert severity="error">
            <FormattedMessage id="vault.unstake.notPossible" />
          </Alert>
        ) : (
          Boolean(vaultProject.penalties?.length) && (
            <Alert severity="error">
              <FormattedMessage
                id="vault.unstake.penalty"
                values={{
                  a: (chunks: string) => (
                    <a className="link" onClick={onOpenOffer}>
                      {chunks}
                    </a>
                  ),
                }}
              />
            </Alert>
          )
        )}
        {vaultProject.boostable && (
          <Alert severity="error">
            <FormattedMessage id="vault.reduceBoost" values={{ coin: vaultProject.asideCoin }} />
          </Alert>
        )}
      </Box>
    ),
    [],
  );

  const Submit = useCallback(
    () => (
      <Button
        variant="contained"
        disabled={!enoughZIG || !isValid}
        style={{ margin: "18px auto 0" }}
        type="submit"
      >
        <FormattedMessage id="wallet.withdraw.continue" />
      </Button>
    ),
    [enoughZIG, isValid],
  );

  if (isEdit) {
    return (
      <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
        <Modal>
          <Title>
            <img src={PiggyIcon} width={40} height={40} />
            <FormattedMessage id="vault.stakeEdit" />
          </Title>
          <StyledTextDesc>
            <FormattedMessage id="vault.stakeEdit.desc" />
          </StyledTextDesc>
          {confirmData && <Confirmation />}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" mt="8px">
              <SecondaryText>
                <FormattedMessage id="wallet.staking.stakedAlready" />
              </SecondaryText>
              <BalanceLabel>
                <>
                  <NumberFormat
                    value={vaultProject.stakeAmount}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={coinData?.decimals}
                    suffix={` ${coin}`}
                  />
                  {Boolean(vaultProject.asideAmount) && (
                    <>
                      &nbsp;&amp;&nbsp;
                      <b>
                        <NumberFormat
                          value={vaultProject.asideAmount}
                          displayType="text"
                          thousandSeparator={true}
                          decimalScale={coins[vaultProject.asideCoin].decimals}
                          suffix={` ${vaultProject.asideCoin}`}
                        />
                      </b>
                    </>
                  )}
                </>
              </BalanceLabel>
            </Box>
            <AmountControl
              balance={balanceAmount}
              setBalanceMax={setBalanceMax}
              decimals={coinData?.decimals}
              errors={errors}
              control={control}
              coin={coin}
              label="wallet.staking.stakeAmountAdd"
              newDesign={true}
            />
            <MinStakingRequired />
            <UnstakeWarning />
            <Submit />
          </Form>
        </Modal>
      </CustomModal>
    );
  }

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          {isEdit ? (
            <FormattedMessage id="vault.stakeEdit" />
          ) : (
            <FormattedMessage id="vault.stake" />
          )}
        </Title>
        <StyledTextDesc>
          {!isEdit ? (
            <FormattedMessage
              id={`vault.stake.desc${vaultProject.boostable ? ".boost" : ".min"}`}
              values={{
                coin,
                amount: (
                  <NumberFormat
                    value={vaultProject.minBalance}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={coinData?.decimals}
                  />
                ),
                asideCoin: vaultProject.asideCoin,
                asideAmount: (
                  <NumberFormat
                    value={vaultProject.asideMinimum}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={2}
                  />
                ),
              }}
            />
          ) : (
            <FormattedMessage id="vault.stakeEdit.desc" />
          )}
        </StyledTextDesc>
        {confirmData && (
          <VaultStakeConfirmModal
            amount={confirmData.amount}
            program={vaultProject}
            asideAmount={selectedBoost?.minimum || vaultProject.asideMinimum}
            boost={selectedBoost?.percentage}
            onClose={onClose}
            onSuccess={onSuccess}
            onCancel={() => setConfirmData(null)}
            open={true}
            coins={coins}
            isEdit={isEdit}
          />
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <AmountControl
            balance={balanceAmount}
            setBalanceMax={setBalanceMax}
            decimals={coinData?.decimals}
            errors={errors}
            control={control}
            coin={coin}
            label="vault.amount"
            newDesign={true}
            minAmount={vaultProject.minBalance}
          />
          <Box display="flex" mt="8px">
            <SecondaryTextSmall>
              <FormattedMessage id="wallet.staking.minBalance" />
            </SecondaryTextSmall>
            <BalanceLabelSmall>
              <NumberFormat
                value={vaultProject.minBalance}
                displayType="text"
                thousandSeparator={true}
                decimalScale={coinData?.decimals}
              />
              &nbsp;{coin}
            </BalanceLabelSmall>
          </Box>
          {vaultProject.boostable && (
            <>
              <br />
              <StakeTypography>
                <FormattedMessage id="vault.boostStake" values={{ coin: vaultProject.asideCoin }} />
              </StakeTypography>
              <SliderContainer value={boostId}>
                <Slider
                  marks={boostMarks}
                  max={boostMarks[boostMarks.length - 1].value}
                  onChange={(_, value: number) => setBoostId(value)}
                  step={null}
                  value={boostId}
                  valueLabelDisplay="off"
                />
              </SliderContainer>
            </>
          )}
          <MinStakingRequired />
          <UnstakeWarning />
          <Submit />
        </Form>
      </Modal>
    </CustomModal>
  );
};

export default VaultStakeModal;
