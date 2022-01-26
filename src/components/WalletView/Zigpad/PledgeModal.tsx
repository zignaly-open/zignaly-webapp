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
import { ConfirmDialog } from "components/Dialogs";
import { ConfirmDialogConfig } from "components/Dialogs/ConfirmDialog/ConfirmDialog";
import RocketIcon from "images/launchpad/rocket.svg";
import Button from "components/Button";
import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import { zigpadTermsUrl } from "utils/affiliateURLs";

const StyledButton = styled(Button)`
  width: 150px;
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const amount = watch("amount");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  }, []);

  const setBalanceMax = () => {
    setValue("amount", balanceZIG.availableBalance);
    trigger("amount");
  };

  const pledgeConfirm = () => {
    setConfirmConfig((c) => ({ ...c, visible: true, values: { amount, coin: "ZIG" } }));
  };

  const pledge = () => {
    setLoading(true);
    const amountValue = parseFloat(amount);
    tradeApi
      .pledge(project.id, amountValue)
      .then((response) => {
        setWalletBalance(response);
      })
      .then(() => {
        onPledged(amountValue);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  const [confirmConfig, setConfirmConfig] = useState<ConfirmDialogConfig>({
    titleTranslationId: "zigpad.pledge",
    messageTranslationId: "zigpad.pledge.definitive",
    visible: false,
  });

  return (
    <Modal>
      <form onSubmit={handleSubmit(pledgeConfirm)}>
        <Title>
          <img src={RocketIcon} width={32} height={32} />
          {project.coin}&nbsp;
          <FormattedMessage id="zigpad.pledge" />
        </Title>
        <ConfirmDialog
          confirmConfig={confirmConfig}
          executeActionCallback={pledge}
          setConfirmConfig={setConfirmConfig}
        />
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
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
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
        <StyledButton
          variant="contained"
          type="submit"
          disabled={!isValid || !checked}
          loading={loading}
        >
          <FormattedMessage id="zigpad.pledge" />
        </StyledButton>
      </form>
    </Modal>
  );
};

export default PledgeModal;
