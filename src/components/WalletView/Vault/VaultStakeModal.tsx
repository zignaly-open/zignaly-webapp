import { Box, Slider, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useContext, useState } from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import AmountControl from "../AmountControl";
import { useForm } from "react-hook-form";
import PrivateAreaContext from "context/PrivateAreaContext";
import Button from "components/Button";

const StyledSlider = styled(Slider)`
  margin: 4px 12px 40px;
`;

const TitleDesc = styled(Typography)`
  font-weight: 500;
  font-size: 32px;
  margin-bottom: 16px;
`;

interface VaultStakeModalProps {
  onClose: () => void;
  open: boolean;
  vaultProject: VaultOffer;
  coins: WalletCoins;
  onDepositMore: () => void;
}

const VaultStakeModal = ({
  onClose,
  open,
  vaultProject,
  coins,
  onDepositMore,
}: VaultStakeModalProps) => {
  const intl = useIntl();
  const { coin } = vaultProject;
  const {
    handleSubmit,
    register,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
    watch,
  } = useForm({ mode: "onChange" });

  const coinData = coins ? coins[coin] : null;
  const { walletBalance } = useContext(PrivateAreaContext);
  const balanceAmount = walletBalance[coin].total;
  console.log(balanceAmount);
  // const coinData = coins ? coins[coin] : null;
  const boostMarks = [
    {
      value: 100,
      label: "100 ZIG",
    },
    {
      value: 200,
      label: "200 ZIG",
    },
    {
      value: 500,
      label: "500 ZIG",
    },
    {
      value: 600,
      label: "600 ZIG",
    },
    {
      value: 2000,
      label: "2000 ZIG",
    },
  ];
  const boostable = true;
  const unstakeEnabled = true;
  const penalties = true;
  const asideMinimum = 10000000;
  const asideCoin = "ZIG";
  const balanceAmountAside = walletBalance[asideCoin].total;
  const enoughZIG = !asideMinimum || balanceAmountAside.availableBalance >= asideMinimum;
  const valid = enoughZIG;

  const setBalanceMax = () => {
    setValue("amount", balanceAmount.availableBalance);
    trigger("amount");
  };

  const [asideAmount, setAsideAmount] = useState(boostMarks[0].value);

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.stake" />
        </Title>
        <TitleDesc>
          <FormattedMessage id="vault.stake.desc" values={{ coin }} />
        </TitleDesc>
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
        <br />
        {boostable && (
          <>
            <Typography variant="h3">
              <FormattedMessage id="vault.boost" />
              &nbsp;{asideAmount / boostMarks[0].value}x
            </Typography>
            <StyledSlider
              // className="privacySlider"
              marks={boostMarks}
              min={boostMarks[0].value}
              max={boostMarks[boostMarks.length - 1].value}
              onChange={(_, value: number) => setAsideAmount(value)}
              // defaultValue={[1, 2]}
              // onChangeCommitted={handleChange}
              step={null}
              value={asideAmount}
              valueLabelDisplay="off"
            />
          </>
        )}
        {asideMinimum > 0 && (
          <>
            <Typography>
              <FormattedMessage
                id="vault.minAmount"
                values={{
                  amount: (
                    <b>
                      <NumberFormat
                        value={asideMinimum}
                        displayType="text"
                        thousandSeparator={true}
                        decimalScale={2}
                        suffix={` ${asideCoin}`}
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
                    coin,
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
          {!unstakeEnabled ? (
            <FormattedMessage id="vault.unstake.notPossible" />
          ) : (
            penalties && (
              <FormattedMessage
                id="vault.unstake.penalty"
                values={{
                  a: (chunks: string) => (
                    <a className="link" onClick={() => {}}>
                      {chunks}
                    </a>
                  ),
                }}
              />
            )
          )}
        </Typography>
        <Button variant="contained" disabled={!valid} style={{ margin: "18px auto 0" }}>
          <FormattedMessage id="wallet.withdraw.continue" />
        </Button>
      </Modal>
    </CustomModal>
  );
};

export default VaultStakeModal;
