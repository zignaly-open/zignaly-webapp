// Dependencies
import React, { useCallback, useEffect, useState } from "react";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";

// Styled Components
import { ModalContainer, Title, Actions, Desc } from "../styles";

// Assets
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import { TextField } from "@mui/material";

import * as styled from "./styles";
import { Button, CloseIcon, IconButton, InputAmount, InputText } from "zignaly-ui";
import cloudinary from "lib/cloudinary";
import { BigNumber, ethers } from "ethers";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeModal } from "src/store/actions/ui";
import Modal from "components/Modals/Modal";
import { CoinNetwork } from "src/services/tradeApiClient.types";

type DepositModalTypesProps = {
  initialCoin: string;
  open: boolean;
  onClose: () => void;
};

function WithdrawModal({ initialCoin, open, onClose }: DepositModalTypesProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState<CoinNetwork>(null);
  const [confirmData, setConfirmData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    // Reset selected network on coin change
    setSelectedNetwork(null);
  }, [selectedCoin]);

  const onSubmit = (data) => {
    setConfirmData({ ...data });
  };

  const amount = register("amount", {
    required: true,
  });

  // const coinRHF = register("coin", {
  //   required: true,
  // });
  // const networkRHF = register("network", {
  //   required: true,
  // });

  const close = useCallback(() => {
    // dispatch(closeModal());
    onClose();
  }, []);

  // const confirm = useCallback(() => {}, []);
  // if (confirmData) {
  //   return (
  //     <Modal
  //       open={open}
  //       width="large"
  //       onClose={onClose}
  //       title={<FormattedMessage id="withdraw.title" />}
  //     ></Modal>
  //   );
  // }

  return (
    <Modal
      open={open}
      width="large"
      onClose={onClose}
      title={<FormattedMessage id="withdraw.title" />}
    >
      <Desc variant="h3">
        <FormattedMessage id="withdraw.desc" />
      </Desc>
      {assets ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <styled.Body>
            <AssetSelect
              assets={assets}
              // {...coinRHF}
              // onSelectItem={(item) => {
              //   setSelectedCoin(item.value);
              //   console.log(item.value);
              //   coinRHF.onChange({
              //     target: {
              //       value: item.value,
              //       name: coinRHF.name,
              //     },
              //     type: "change",
              //   });
              // }}
              fullWidth={true}
              selectedAsset={selectedCoin}
              onChange={(item) => setSelectedCoin(item.value)}
            />
            {selectedCoin && (
              <>
                <NetworkSelect
                  // {...networkRHF}
                  // onSelectItem={(item) => {
                  //   // setSelectedCoin(item.value);
                  //   console.log(item.value);
                  //   coinRHF.onChange({
                  //     target: {
                  //       value: item.value.network,
                  //       name: networkRHF.name,
                  //     },
                  //     type: "change",
                  //   });
                  // }}
                  fullWidth={true}
                  selectedNetwork={selectedNetwork?.network}
                  networks={assets[selectedCoin].networks}
                  onChange={(item) => setSelectedNetwork(item.value)}
                />
                {selectedNetwork && (
                  <>
                    <InputText
                      {...register("address", {
                        required: true,
                        pattern: {
                          value: RegExp(selectedNetwork?.addressRegex),
                          message: intl.formatMessage({ id: "wallet.withdraw.address.invalid" }),
                        },
                      })}
                      label={intl.formatMessage({ id: "withdraw.toAddress" })}
                      placeholder={intl.formatMessage({ id: "wallet.withdraw.address.paste" })}
                      error={errors.address?.message || Boolean(errors.address)}
                    />
                    <InputAmount
                      {...amount}
                      label={intl.formatMessage({ id: "withdraw.amountToWithdraw" })}
                      error={Boolean(errors.amount)}
                      tokens={[
                        {
                          id: 1,
                          name: selectedCoin,
                          image: cloudinary({ folder: "coins-binance", id: selectedCoin }),
                          balance: ethers.utils
                            .parseEther(assets[selectedCoin].balanceFree)
                            .toString(),
                        },
                      ]}
                    />
                  </>
                )}
              </>
            )}
          </styled.Body>
          <Actions>
            <Button
              caption={intl.formatMessage({ id: "confirm.cancel" })}
              size="xlarge"
              variant="secondary"
              onClick={close}
            />
            <Button
              caption={intl.formatMessage({ id: "wallet.withdraw.continue" })}
              type="submit"
              size="xlarge"
              disabled={!isValid}
            />
          </Actions>
        </form>
      ) : (
        <Loader />
      )}
    </Modal>
  );
}

export default WithdrawModal;
