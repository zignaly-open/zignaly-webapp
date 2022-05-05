// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import QRCode from "qrcode.react";

// Styled Components
import { Desc } from "../styles";

import { ErrorMessage, InputText, Typography, TextButton } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets, useExchangeDepositAddress } from "lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import Loader from "components/common/Loader/Loader";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";
import { Box } from "@mui/material";
import * as styled from "./styles";
import NumberFormat from "react-number-format";
import Modal from "components/modals/Modal";
import CopyButton from "components/common/CopyButton";

type DepositModalTypesProps = {
  open: boolean;
  onClose: () => void;
  initialCoin: string;
};

function DepositModal({ open, onClose, initialCoin }: DepositModalTypesProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState<CoinNetwork>(null);
  const { data: depositAddress } = useExchangeDepositAddress(
    selectedExchange?.internalId,
    selectedCoin,
    selectedNetwork?.network,
  );

  useEffect(() => {
    // Reset selected network on coin change
    setSelectedNetwork(null);
  }, [selectedCoin]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      title={<FormattedMessage id="deposit.title" />}
      width="large"
    >
      <Desc>
        <FormattedMessage id="deposit.reflect" />
      </Desc>
      <styled.Body>
        {assets ? (
          <>
            <styled.SelectCoinContainer>
              <AssetSelect
                assets={assets}
                onChange={(item) => setSelectedCoin(item.value)}
                selectedAsset={selectedCoin}
              />
              {selectedCoin && (
                <styled.Balances>
                  <Typography>
                    <FormattedMessage id="wallet.balance" />
                    <NumberFormat
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                      value={assets[selectedCoin].balanceTotal}
                    />
                    {selectedCoin}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="deposit.inOrders" />
                    <NumberFormat
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                      value={assets[selectedCoin].balanceLocked}
                    />
                    {selectedCoin}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="balance.avail" />
                    <NumberFormat
                      displayType="text"
                      prefix=" "
                      suffix=" "
                      thousandSeparator={true}
                      value={assets[selectedCoin].balanceFree}
                    />
                    {selectedCoin}
                  </Typography>
                </styled.Balances>
              )}
            </styled.SelectCoinContainer>
            {selectedCoin && (
              <>
                <NetworkSelect
                  fullWidth={true}
                  networks={assets[selectedCoin].networks}
                  onChange={(item) => setSelectedNetwork(item.value)}
                  selectedNetwork={selectedNetwork?.network}
                />
                {selectedNetwork &&
                  (depositAddress ? (
                    <>
                      <InputText
                        defaultValue={depositAddress.address}
                        readOnly={true}
                        rightSideElement={
                          <CopyButton
                            content={depositAddress.address}
                            successMessage={intl.formatMessage({ id: "deposit.address.copied" })}
                          />
                        }
                      />
                      {selectedNetwork && (
                        <Box alignItems="center" display="flex">
                          <ErrorMessage
                            text={intl.formatMessage(
                              {
                                id: "wallet.deposit.caution",
                              },
                              {
                                coin: selectedCoin,
                                network: selectedNetwork.name,
                              },
                            )}
                          />
                          <TextButton
                            caption={<FormattedMessage id="wallet.deposit.notsure" />}
                            href="https://help.zignaly.com"
                          />
                          {/* <styled.NotSure href="https://help.zignaly.com" target="_blank">
                            <FormattedMessage id="wallet.deposit.notsure" />
                          </styled.NotSure> */}
                        </Box>
                      )}
                      <styled.QRCodeContainer>
                        <QRCode size={156} value={depositAddress.address} />
                      </styled.QRCodeContainer>
                      {depositAddress.tag && (
                        <>
                          <InputText defaultValue={depositAddress.tag} readOnly={true} />
                          <styled.QRCodeContainer>
                            <QRCode size={156} value={depositAddress.tag} />
                          </styled.QRCodeContainer>
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
      </styled.Body>
    </Modal>
  );
}

export default DepositModal;
