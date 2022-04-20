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
import CoinIcon from "components/CoinIcon";
import { TextField } from "@mui/material";

import * as styled from "./styles";
import { getChainIcon } from "src/utils/chain";
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

  const coinsOptions =
    assets &&
    Object.keys(assets)
      .map((coin) => {
        return {
          caption: coin,
          value: coin,
          leftElement: <CoinIcon coin={coin} />,
        };
      })
      .sort((a, b) => a.caption.localeCompare(b.caption));

  const networkOptions =
    assets &&
    assets[selectedCoin]?.networks.map((n) => {
      return {
        caption: n.name,
        value: n.network,
        // leftElement: <CoinIcon coin={n.network} />,
        leftElement: getChainIcon(n.network),
      };
    });

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
              <Select
                options={coinsOptions}
                initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
                onSelectItem={(item) => setSelectedCoin(item.value)}
                placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
                label={
                  <Typography variant="h3">{intl.formatMessage({ id: "deposit.coin" })}</Typography>
                }
              />
              {selectedCoin && (
                <styled.Balances>
                  <Typography>
                    <FormattedMessage id="wallet.balance" />
                    <NumberFormat
                      value={assets[selectedCoin].balanceTotal}
                      displayType="text"
                      prefix=" "
                      suffx=" "
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
                <Select
                  options={networkOptions}
                  onSelectItem={(item) => setSelectedNetwork(item.value)}
                  placeholder={intl.formatMessage({ id: "deposit.network" })}
                  label={
                    <Typography variant="h3">
                      {intl.formatMessage({ id: "deposit.network" })}
                    </Typography>
                  }
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
