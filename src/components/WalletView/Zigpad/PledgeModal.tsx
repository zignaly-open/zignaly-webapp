import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { isMobile, Modal, Title } from "styles/styles";
import AmountControl from "../AmountControl";
import PrivateAreaContext from "context/PrivateAreaContext";
import tradeApi from "services/tradeApiClient";
import styled, { css } from "styled-components";
import RocketIcon from "images/launchpad/rocket.svg";
import Button from "components/Button";
import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import { zigpadTermsUrl } from "utils/affiliateURLs";
import PledgeModalConfirm from "./PledgeModalConfirm";

const StyledButton = styled(Button)`
  min-width: 150px;
  margin-top: 12px;

  ${isMobile(css`
    width: 100%;
  `)}
`;

interface PledgeModalProps {
  project: LaunchpadProject;
  onPledged: (amount: number) => void;
}

const PledgeModal = ({ project, onPledged }: PledgeModalProps) => {
  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
    watch,
  } = useForm({ mode: "onChange" });
  const { walletBalance, setWalletBalance } = useContext(PrivateAreaContext);
  const balanceZIG = walletBalance?.ZIG?.total || { balance: 0, availableBalance: 0 };
  const amount = watch("amount");
  const [confirmAmount, setConfirmAmount] = useState(null);

  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  }, []);

  const setBalanceMax = () => {
    setValue("amount", balanceZIG.availableBalance);
    trigger("amount");
  };

  const onSubmit = () => {
    setConfirmAmount(amount);
  };

  if (confirmAmount) {
    return (
      <PledgeModalConfirm
        amount={confirmAmount}
        project={project}
        onPledged={onPledged}
        onCancel={() => setConfirmAmount(null)}
      />
    );
  }

  return (
    <Modal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Title>
          <img src={RocketIcon} width={40} height={40} />
          {project.coin}&nbsp;
          <FormattedMessage id="zigpad.pledge" />
        </Title>
        <Typography>
          <FormattedMessage id="zigpad.pledge.info1" values={{ project: project.name }} />
        </Typography>
        <br />
        <Typography>
          <FormattedMessage id="zigpad.pledge.info2" />
        </Typography>

        <AmountControl
          balance={balanceZIG}
          setBalanceMax={setBalanceMax}
          decimals={2}
          errors={errors}
          control={control}
          coin="ZIG"
          label="zigpad.pledge.amount"
          newDesign={true}
          minAmount={project.minAmount}
        />
        <FormControlLabel
          style={{
            marginTop: "24px",
            marginBottom: "12px",
          }}
          control={
            <Controller
              control={control}
              defaultValue={false}
              name="terms"
              render={({ onChange, value }) => (
                <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
              )}
              rules={{
                required: true,
              }}
            />
          }
          label={
            <FormattedMessage
              id="zigpad.pledge.terms"
              values={{
                a: (chunks: string) => (
                  <a target="_blank" rel="noreferrer" href={zigpadTermsUrl}>
                    {chunks}
                  </a>
                ),
              }}
            />
          }
        />
        <StyledButton variant="contained" type="submit" disabled={!isValid}>
          <FormattedMessage id="zigpad.pledge" />
        </StyledButton>
      </form>
    </Modal>
  );
};

export default PledgeModal;
