// Dependencies
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import QRCode from "qrcode.react";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
import { Button, Select } from "zignaly-ui";
import { closeModal } from "src/store/actions/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets, useExchangeDepositAddress } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import CoinIcon from "components/CoinIcon";
import { TextField } from "@mui/material";

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
        // todo: return coin as network coin
        // leftElement: <CoinIcon coin={n.coin} />,
      };
    });

  return (
    <ModalContainer width={"420px"}>
      <Title>
        <FormattedMessage id="deposit.title" />
      </Title>
      <Body>
        {assets ? (
          <>
            <FormattedMessage id="deposit.reflect" />
            <Select
              options={coinsOptions}
              initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
              onSelectItem={(item) => setSelectedCoin(item.value)}
              placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
            />
            {selectedCoin && (
              <>
                <Select
                  options={networkOptions}
                  onSelectItem={(item) => setSelectedNetwork(item.value)}
                  placeholder={intl.formatMessage({ id: "deposit.network" })}
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
