import CustomButton from "components/CustomButton";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { isMobile, Modal, Title } from "styles/styles";
import AmountControl from "../AmountControl";
import PrivateAreaContext from "context/PrivateAreaContext";
import tradeApi from "services/tradeApiClient";
import styled, { css } from "styled-components";

const Button = styled(CustomButton)`
  && {
    min-width: 150px;
    margin-top: 12px;
  }

  ${isMobile(css`
    width: 100%;
  `)}
`;

interface PledgeModalProps {
  project: LaunchpadProject;
}

const PledgeModal = ({ project }: PledgeModalProps) => {
  const {
    handleSubmit,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
  } = useForm({ mode: "onChange" });
  const { walletBalance, setWalletBalance } = useContext(PrivateAreaContext);
  const balanceZIG = walletBalance?.ZIG?.total || { balance: 0, availableBalance: 0 };

  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  }, []);

  const setBalanceMax = () => {
    setValue("amount", balanceZIG.availableBalance);
    trigger("amount");
  };

  const pledge = () => {};
  return (
    <Modal>
      <form onSubmit={handleSubmit(pledge)}>
        <Title>
          {project.coin}&nbsp;
          <FormattedMessage id="zigpad.contribute" />
        </Title>
        <AmountControl
          balance={balanceZIG}
          setBalanceMax={setBalanceMax}
          decimals={2}
          errors={errors}
          control={control}
          coin="ZIG"
          label="zigpad.contribute.amount"
          newDesign={true}
          minAmount={project.minAmount}
        />
        <Button className="bgPurple" type="submit" disabled={!isValid}>
          <FormattedMessage id="zigpad.contribute" />
        </Button>
      </form>
    </Modal>
  );
};

export default PledgeModal;
