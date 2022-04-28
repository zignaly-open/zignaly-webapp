import React from "react";
import { useIntl } from "react-intl";
import { ExchangeAssetsDict } from "src/services/tradeApiClient.types";
import { Select, Typography } from "zignaly-ui";
import CoinIcon from "../CoinIcon";

import * as styled from "./styles";

interface AssetSelectProps {
  assets: ExchangeAssetsDict;
  onChange: any;
  selectedAsset?: string;
  fullWidth?: boolean;
}

const AssetSelect = ({ assets, onChange, selectedAsset, fullWidth }: AssetSelectProps) => {
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
      value={coinsOptions?.find((o) => o.value === selectedAsset)}
      onChange={onChange}
      placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
      // label={<Typography variant="h3">{intl.formatMessage({ id: "deposit.coin" })}</Typography>}
      label={intl.formatMessage({ id: "deposit.coin" })}
    />
  );
};

export default AssetSelect;
