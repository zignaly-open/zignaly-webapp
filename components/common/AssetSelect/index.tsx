import React from "react";
import { useIntl } from "react-intl";
import { Select, Typography } from "zignaly-ui";
import CoinIcon from "../CoinIcon";

import * as styled from "./styles";

interface AssetSelectProps {
  assets: ExchangeAssets;
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
      label={intl.formatMessage({ id: "deposit.coin" })}
      onChange={onChange}
      options={coinsOptions}
      placeholder={intl.formatMessage({ id: "deposit.selectcoin" })}
      // label={<Typography variant="h3">{intl.formatMessage({ id: "deposit.coin" })}</Typography>}
      value={coinsOptions?.find((o) => o.value === selectedAsset)}
    />
  );
};

export default AssetSelect;
