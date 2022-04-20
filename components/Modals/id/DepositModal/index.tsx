// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import QRCode from "qrcode.react";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
import { Button, Select, Typography } from "zignaly-ui";
import { closeModal } from "src/store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets, useExchangeDepositAddress } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";
import { TextField } from "@mui/material";

import * as styled from "./styles";
import NumberFormat from "react-number-format";

type DepositModalTypesProps = {
  action?: any;
  initialCoin: string;
};

function DepositModal({ action = null, initialCoin }: DepositModalTypesProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const { data: depositAddress } = useExchangeDepositAddress(
    selectedExchange?.internalId,
    selectedCoin,
    selectedNetwork,
  );

  useEffect(() => {
    // Reset selected network on coin change
    // todo: doesn't work due to Select component controlled
    setSelectedNetwork(null);
  }, [selectedCoin]);

  return (
    <ModalContainer width={"420px"}>
      <Title>
        <FormattedMessage id="deposit.title" />
      </Title>
      <Body>
        {assets ? (
          <>
            <styled.Desc variant="h3">
              <FormattedMessage id="deposit.reflect" />
            </styled.Desc>
            <styled.SelectCoinContainer>
              <AssetSelect
                assets={assets}
                // initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
                onSelectItem={(item) => setSelectedCoin(item.value)}
              />
              {selectedCoin && (
                <styled.Balances>
                  <Typography>
                    <FormattedMessage id="wallet.balance" />
                    <NumberFormat
                      value={assets[selectedCoin].balanceTotal}
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                    />
                    {selectedCoin}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="deposit.inOrders" />
                    <NumberFormat
                      value={assets[selectedCoin].balanceLocked}
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                    />
                    {selectedCoin}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="balance.avail" />
                    <NumberFormat
                      value={assets[selectedCoin].balanceFree}
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                    />
                    {selectedCoin}
                  </Typography>
                </styled.Balances>
              )}
            </styled.SelectCoinContainer>
            {selectedCoin && (
              <>
                <NetworkSelect
                  networks={assets[selectedCoin].networks}
                  onSelectItem={(item) => setSelectedNetwork(item.value)}
                />
                {selectedNetwork &&
                  (depositAddress ? (
                    <>
                      <TextField
                        value={depositAddress.address}
                        fullWidth
                        multiline
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <QRCode size={200} value={depositAddress.address} />
                      {depositAddress.tag && (
                        <>
                          <TextField
                            value={depositAddress.tag}
                            fullWidth
                            multiline
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                          <QRCode size={200} value={depositAddress.tag} />
                        </>
                      )}
                    </>
                  ) : (
                    <Loader />
                  ))}
              </>
            )}
          </>
        ) : (
          <Loader />
        )}
      </Body>
    </ModalContainer>
  );
}

export default DepositModal;
