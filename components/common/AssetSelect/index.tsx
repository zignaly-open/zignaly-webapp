import React from "react";
import { useIntl } from "react-intl";
import { ExchangeAssetsDict } from "src/services/tradeApiClient.types";
import { Select, Typography } from "zignaly-ui";
import CoinIcon from "../CoinIcon";

import * as styled from "./styles";

interface AssetSelectProps {
  assets: ExchangeAssetsDict;
  onSelectItem: any;
  value: any;
  fullWidth?: boolean;
}

const AssetSelect = ({ assets, onSelectItem, value, fullWidth }: AssetSelectProps) => {
  const intl = useIntl();

  const coinsOptions =
    assets &&
    Object.keys(assets)
      .map((coin) => {
        return {
          caption: coin,
          value: coin,
          leftElement: (
            <styled.SelectIcon>
              <CoinIcon coin={coin} />
            </styled.SelectIcon>
          ),
        };
      })
      .sort((a, b) => a.caption.localeCompare(b.caption));

  return (
    <Select
      fullWidth={fullWidth}
      options={coinsOptions}
      // initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
      onSelectItem={onSelectItem}
      placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
      // label={<Typography variant="h3">{intl.formatMessage({ id: "deposit.coin" })}</Typography>}
      label={intl.formatMessage({ id: "deposit.coin" })}
    />
  );
};

export default AssetSelect;
