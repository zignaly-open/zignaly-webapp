// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import QRCode from "qrcode.react";

// Styled Components
import { Desc } from "../styles";

// Assets
import { ErrorMessage, IconButton, InputText, CopyIcon, Typography, TextButton } from "zignaly-ui";
import { closeModal, showSuccessAlert } from "src/store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets, useExchangeDepositAddress } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";
import { Box } from "@mui/material";
import * as styled from "./styles";
import NumberFormat from "react-number-format";
import Modal from "components/Modals/Modal";
import { CoinNetwork } from "src/services/tradeApiClient.types";

type DepositModalTypesProps = {
  open: boolean;
  onClose: () => void;
  initialCoin: string;
};

const CopyButton = ({ content, successMessage }: { content: string; successMessage: string }) => {
  const dispatch = useDispatch();

  const copyAddress = () => {
    navigator.clipboard.writeText(content).then(() => {
      dispatch(showSuccessAlert("Success", successMessage));
    });
  };

  return <IconButton onClick={copyAddress} icon={<CopyIcon />} />;
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
      open={open}
      width="large"
      onClose={onClose}
      title={<FormattedMessage id="deposit.title" />}
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
                  onChange={(item) => setSelectedNetwork(item.value)}
                  selectedNetwork={selectedNetwork?.network}
                  fullWidth={true}
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
                        <Box display="flex" alignItems="center">
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
                          <TextButton caption={<FormattedMessage id="wallet.deposit.notsure" />} />
                          {/* <styled.NotSure href="https://help.zignaly.com" target="_blank">
                            <FormattedMessage id="wallet.deposit.notsure" />
                          </styled.NotSure> */}
                        </Box>
                      )}
                      <styled.QRCodeContainer>
                        <QRCode value={depositAddress.address} size={156} />
                      </styled.QRCodeContainer>
                      {depositAddress.tag && (
                        <>
                          <InputText defaultValue={depositAddress.tag} readOnly={true} />
                          <styled.QRCodeContainer>
                            <QRCode value={depositAddress.tag} size={156} />
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
