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
import { Button, InputAmount, InputText } from "zignaly-ui";
import cloudinary from "utils/cloudinary";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import Modal from "components/modals/Modal";

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
      onClose={onClose}
      open={open}
      title={<FormattedMessage id="withdraw.title" />}
      width="large"
    >
      <Desc variant="h3">
        <FormattedMessage id="withdraw.desc" />
      </Desc>
      {assets ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
              onChange={(item) => setSelectedCoin(item.value)}
              selectedAsset={selectedCoin}
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
                  networks={assets[selectedCoin].networks}
                  onChange={(item) => setSelectedNetwork(item.value)}
                  selectedNetwork={selectedNetwork?.network}
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
                      error={errors.address?.message || Boolean(errors.address)}
                      label={intl.formatMessage({ id: "withdraw.toAddress" })}
                      placeholder={intl.formatMessage({ id: "wallet.withdraw.address.paste" })}
                    />
                    <InputAmount
                      {...amount}
                      // @ts-ignore
                      error={Boolean(errors.amount)}
                      label={intl.formatMessage({ id: "withdraw.amountToWithdraw" })}
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
              onClick={close}
              size="xlarge"
              variant="secondary"
            />
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

export default WithdrawModal;
