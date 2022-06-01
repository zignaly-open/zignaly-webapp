import { Box, Slider, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useContext, useState } from "react";
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

const StyledTextDesc = styled(TextDesc)`
  margin-bottom: 24px;
`;

const SliderContainer = styled.div`
  margin: 4px 32px 36px;
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

const BalanceLabel = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  margin-left: 4px;
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
    formState: { isValid },
    setValue,
    trigger,
  } = useForm<FormType>({ mode: "onChange" });

  const coinData = coins ? coins[coin] : null;
  const { walletBalance } = useContext(PrivateAreaContext);
  const balanceAmount = walletBalance[coin].total;
  const [boostId, setBoostId] = useState(0);
  const [confirmData, setConfirmData] = useState<FormType>(null);
  const selectedBoost = vaultProject.boosts ? vaultProject.boosts[boostId] : null;
  const balanceAmountAside = walletBalance[vaultProject.asideCoin].total;
  const enoughZIG =
    !vaultProject.asideMinimum ||
    balanceAmountAside.availableBalance >=
      (boostId ? vaultProject.boosts[boostId].minimum : vaultProject.asideMinimum);

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

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.stake" />
        </Title>
        <StyledTextDesc>
          <FormattedMessage
            id={`vault.stake.desc${vaultProject.boostable ? ".boost" : ""}`}
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
            <SecondaryText>
              <FormattedMessage id="wallet.staking.minBalance" />
            </SecondaryText>
            <BalanceLabel>
              <NumberFormat
                value={vaultProject.minBalance}
                displayType="text"
                thousandSeparator={true}
                decimalScale={coinData?.decimals}
              />
              &nbsp;{coin}
            </BalanceLabel>
          </Box>
          <br />
          {vaultProject.boostable && (
            <>
              <StakeTypography>
                <FormattedMessage id="vault.boostStake" values={{ coin: vaultProject.asideCoin }} />
              </StakeTypography>
              <SliderContainer>
                <Slider
                  marks={boostMarks}
                  max={boostMarks[boostMarks.length - 1].value}
                  onChange={(_, value: number) => setBoostId(value)}
                  valueLabelFormat={() => `${vaultProject.boosts[boostId].percentage}x`}
                  step={null}
                  value={boostId}
                  valueLabelDisplay="auto"
                />
              </SliderContainer>
              <Typography variant="h3" style={{ marginBottom: "14px" }}>
                <FormattedMessage id="vault.boost" />
                &nbsp;{vaultProject.boosts[boostId].percentage}x
              </Typography>
            </>
          )}
          {vaultProject.asideMinimum > 0 && (
            <>
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
              <Typography>
                {!enoughZIG ? (
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
                ) : (
                  <FormattedMessage id="vault.reduceBoost" />
                )}
              </Typography>
            </>
          )}
          <br />
          <Typography>
            {!vaultProject.unstakeEnabled ? (
              <FormattedMessage id="vault.unstake.notPossible" />
            ) : (
              vaultProject.penalties?.length && (
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
              )
            )}
          </Typography>
          <Button
            variant="contained"
            disabled={!enoughZIG || !isValid}
            style={{ margin: "18px auto 0" }}
            type="submit"
          >
            <FormattedMessage id="wallet.withdraw.continue" />
          </Button>
        </Form>
      </Modal>
    </CustomModal>
  );
};

export default VaultStakeModal;
