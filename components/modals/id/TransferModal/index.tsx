// Dependencies
import React, { useCallback, useEffect, useState } from "react";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";

// Styled Components
import { ModalContainer, Title, Actions, Desc } from "../styles";

import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets } from "lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import Loader from "components/common/Loader/Loader";
import * as styled from "./styles";
import { Button, IconButton, InputAmount, PriceLabel, SwapVertIcon, Typography } from "zignaly-ui";
import { useForm } from "react-hook-form";
import Modal from "components/modals/Modal";
import { ethers } from "ethers";
import NumberFormat from "react-number-format";

type TransferModalProps = {
  open: boolean;
  onClose: () => void;
};

function TransferModal({ open, onClose }: TransferModalProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const balance = ethers.utils.parseEther("100").toString();
  const [fromTradingAccount, setFromTradingAccount] = useState(true);
  const [amount, setAmount] = useState();

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
      title={<FormattedMessage id="management.transferFunds" />}
      width="large"
    >
      <styled.Desc>
        <FormattedMessage id="management.transferFunds.desc" />
      </styled.Desc>
      {assets ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <styled.Body>
            <InputAmount
              placeholder={intl.formatMessage({ id: "col.amount" })}
              fullWidth={true}
              label={intl.formatMessage({
                id: fromTradingAccount
                  ? "management.transfer.fromTradingAccount"
                  : "management.transfer.fromDiscAccount",
              })}
              tokens={[
                {
                  id: 1,
                  name: "USDT",
                  balance: balance.toString(),
                },
              ]}
              onChange={(e) => setAmount(e.target.value)}
            />
            <IconButton
              size="large"
              icon={<SwapVertIcon />}
              variant="secondary"
              onClick={() => {
                setFromTradingAccount(!fromTradingAccount);
              }}
            />
            <styled.ToContainer>
              <styled.ToOutline>
                <Typography variant="h2">
                  <FormattedMessage
                    id={`management.transfer.${
                      fromTradingAccount ? "toDiscAccount" : "toTradingAccount"
                    }`}
                  />
                </Typography>
                <styled.ToValue>
                  {amount || "--"}
                  <span>USDT</span>
                </styled.ToValue>
              </styled.ToOutline>
              <Typography>
                <FormattedMessage id="deposit.available" />
                <styled.TypographyBalance variant="body2" color="neutral000">
                  80 USDT
                </styled.TypographyBalance>
              </Typography>
            </styled.ToContainer>
          </styled.Body>
          <styled.Actions>
            <Button
              caption={intl.formatMessage({ id: "management.transfer.now" })}
              disabled={!isValid}
              size="xlarge"
              type="submit"
            />
          </styled.Actions>
        </form>
      ) : (
        <Loader />
      )}
    </Modal>
  );
}

export default TransferModal;
