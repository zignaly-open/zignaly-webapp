import CustomButton from "components/CustomButton";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { isMobile, Modal, Title } from "styles/styles";
import AmountControl from "../AmountControl";
import PrivateAreaContext from "context/PrivateAreaContext";
import tradeApi from "services/tradeApiClient";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

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
  onPledged: () => void;
}

const PledgeModal = ({ project, onPledged }: PledgeModalProps) => {
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  }, []);

  const setBalanceMax = () => {
    setValue("amount", balanceZIG.availableBalance);
    trigger("amount");
  };

  const pledge = (data) => {
    const { amount } = data;
    setLoading(true);
    tradeApi
      .pledge(project.id, amount)
      .then((response) => {
        setWalletBalance(response);
      })
      .then(() => {
        onPledged();
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit(pledge)}>
        <Title>
          {project.coin}&nbsp;
          <FormattedMessage id="zigpad.pledge" />
        </Title>
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
        <Button className="bgPurple" type="submit" disabled={!isValid}>
          <FormattedMessage id="zigpad.pledge" />
        </Button>
      </form>
    </Modal>
  );
};

export default PledgeModal;
