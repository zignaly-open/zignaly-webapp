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
import { Button, IconButton, InputAmount, SwapVertIcon } from "zignaly-ui";
import { useForm } from "react-hook-form";
import Modal from "components/modals/Modal";
import { ethers } from "ethers";

type TransferModalProps = {
  open: boolean;
  onClose: () => void;
};

function TransferModal({ open, onClose }: TransferModalProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedNetwork, setSelectedNetwork] = useState<CoinNetwork>(null);
  const [confirmData, setConfirmData] = useState(null);
  const balance = ethers.utils.parseEther("100").toString();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // useEffect(() => {
  //   // Reset selected network on coin change
  //   setSelectedNetwork(null);
  // }, []);

  const onSubmit = (data) => {
    setConfirmData({ ...data });
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      title={<FormattedMessage id="management.transferFunds" />}
      width="large"
    >
      <Desc variant="h3">
        <FormattedMessage id="management.transferFunds.desc" />
      </Desc>
      {assets ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <styled.Body>
            <InputAmount
              label={intl.formatMessage({ id: "management.transfer.fromTradingAccount" })}
              tokens={[
                {
                  id: 1,
                  name: "USDT",
                  // image: BTCIcon,
                  balance: balance.toString(),
                },
              ]}
            />
            <IconButton
              size="large"
              icon={<SwapVertIcon />}
              variant="secondary"
              onClick={() => {}}
            />
          </styled.Body>
          <Actions>
            <Button
              caption={intl.formatMessage({ id: "wallet.withdraw.continue" })}
              disabled={!isValid}
              size="xlarge"
              type="submit"
            />
          </Actions>
        </form>
      ) : (
        <Loader />
      )}
    </Modal>
  );
}

export default TransferModal;
