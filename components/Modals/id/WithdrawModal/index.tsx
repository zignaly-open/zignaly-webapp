// Dependencies
import React, { useCallback, useEffect, useState } from "react";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";

// Styled Components
import { ModalContainer, Title, Actions } from "../styles";

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

type DepositModalTypesProps = {
  action?: any;
  initialCoin: string;
  open: boolean;
  onClose: () => void;
};

function WithdrawModal({
  action = null,
  initialCoin,
  open,
  onClose,
}: DepositModalTypesProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    // Reset selected network on coin change
    // todo: doesn't work due to Select component controlled
    setSelectedNetwork(null);
    setValue("network", "");
    setValue("test", "");
  }, [selectedCoin]);

  const onSubmit = (data) => console.log(data);
  const dispatch = useDispatch();

  // const amount = register("amount", {
  //   required: true,
  // });

  const coinRHF = register("coin", {
    required: true,
  });
  const networkRHF = register("network", {
    required: true,
  });

  const close = useCallback(() => {
    // dispatch(closeModal());
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      width="large"
      onClose={onClose}
      title={<FormattedMessage id="withdraw.title" />}
    >
      {/* <Title>
        <FormattedMessage id="withdraw.title" />
        <IconButton icon={CloseIcon} onClick={close} />
      </Title> */}
      {assets ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <styled.Body>
            <styled.Desc variant="h3">
              <FormattedMessage id="withdraw.desc" />
            </styled.Desc>
            <AssetSelect
              assets={assets}
              // initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
              {...coinRHF}
              onSelectItem={(item) => {
                setSelectedCoin(item.value);
                console.log(item.value);
                coinRHF.onChange({
                  target: {
                    value: item.value,
                    name: coinRHF.name,
                  },
                  type: "change",
                });
              }}
              fullWidth={true}
            />
            {selectedCoin && (
              <>
                <NetworkSelect
                  {...networkRHF}
                  onSelectItem={(item) => {
                    // setSelectedCoin(item.value);
                    console.log(item.value);
                    coinRHF.onChange({
                      target: {
                        value: item.value.network,
                        name: networkRHF.name,
                      },
                      type: "change",
                    });
                  }}
                  networks={assets[selectedCoin].networks}
                  // onSelectItem={(item) => setSelectedNetwork(item.value)}
                  fullWidth={true}
                />
                <InputText {...register("test", {})} />
                {selectedNetwork && (
                  <>
                    <InputText
                      // {...register("address", {
                      //   required: true,
                      //   pattern: {
                      //     value: RegExp(selectedNetwork?.addressRegex),
                      //     message: intl.formatMessage({ id: "wallet.withdraw.address.invalid" }),
                      //   },
                      // })}
                      label={intl.formatMessage({ id: "withdraw.toAddress" })}
                      placeholder={intl.formatMessage({ id: "wallet.withdraw.address.paste" })}
                      error={errors.address?.message || Boolean(errors.address)}
                    />
                    <InputAmount
                      // {...amount}
                      label={intl.formatMessage({ id: "withdraw.amountToWithdraw" })}
                      error={Boolean(errors.amount)}
                      tokens={[
                        {
                          id: 1,
                          name: selectedCoin,
                          image: cloudinary({ folder: "coins-binance", id: selectedCoin }),
                          balance: "10000000000000000000",
                          balance0: ethers.utils
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
