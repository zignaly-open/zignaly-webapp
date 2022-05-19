// Dependencies
import React, { useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { Button, InputAmount } from "zignaly-ui";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import Modal, { Actions } from "components/modals/Modal";

type MinBalanceModalProps = {
  open: boolean;
  onClose: () => void;
  initialValue: number;
};

function MinBalanceModal({
  open,
  onClose,
  initialValue,
}: MinBalanceModalProps): React.ReactElement {
  const intl = useIntl();
  const [amount, setAmount] = useState(initialValue);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data) => {
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      title={<FormattedMessage id="management.minBalance.title" />}
      width="small"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <InputAmount
          label=""
          value={ethers.utils.parseEther(initialValue.toString())}
          onChange={(v) => setAmount(v)}
        />
        <Actions>
          <Button
            caption={intl.formatMessage({ id: "form.button.save" })}
            disabled={!isValid}
            size="xlarge"
            type="submit"
          />
        </Actions>
      </form>
    </Modal>
  );
}

export default MinBalanceModal;
