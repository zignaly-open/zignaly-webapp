// Dependencies
import React, { useEffect, useState } from "react";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import { TextField } from "@mui/material";

import * as styled from "./styles";
import { Button, InputAmount } from "zignaly-ui";
import cloudinary from "lib/cloudinary";
import { BigNumber, ethers } from "ethers";
import { useForm } from "react-hook-form";

type DepositModalTypesProps = {
  action?: any;
  initialCoin: string;
};

function WithdrawModal({ action = null, initialCoin }: DepositModalTypesProps): React.ReactElement {
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
  }, [selectedCoin]);

  const onSubmit = (data) => console.log(data);

  const amount = register("amount", {
    required: true,
  });

  const coinRHF = register("coin", {
    required: true,
  });

  return (
    <ModalContainer width={"420px"}>
      <Title>
        <FormattedMessage id="withdraw.title" />
      </Title>
      {assets ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <styled.Desc variant="h3">
              <FormattedMessage id="withdraw.desc" />
            </styled.Desc>
            <AssetSelect
              assets={assets}
              // initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
              {...coinRHF}
              onSelectItem={(item) => {
                setSelectedCoin(item.value);
              }}
            />
            {selectedCoin && (
              <>
                <NetworkSelect
                  networks={assets[selectedCoin].networks}
                  onSelectItem={(item) => setSelectedNetwork(item.value)}
                />
                {selectedNetwork && (
                  <>
                    <InputAmount
                      {...amount}
                      label={intl.formatMessage({ id: "withdraw.amountToWithdraw" })}
                      error={Boolean(errors.amount)}
                      tokens={[
                        {
                          id: 1,
                          name: selectedCoin,
                          image: cloudinary({ folder: "coins-binance", id: selectedCoin }),
                          // balance: "10000000000000000000",
                          balance: ethers.utils
                            .parseEther(assets[selectedCoin].balanceFree)
                            .toString(),
                        },
                      ]}
                    />
                    <TextField
                      fullWidth
                      multiline
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Body>
          <Actions columns={1}>
            <Button
              caption={intl.formatMessage({ id: "wallet.withdraw.continue" })}
              type="submit"
            />
          </Actions>
        </form>
      ) : (
        <Loader />
      )}
    </ModalContainer>
  );
}

export default WithdrawModal;
