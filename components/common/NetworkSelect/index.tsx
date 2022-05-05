import React from "react";
import { useIntl } from "react-intl";
import { Select } from "zignaly-ui";
import { getChainIcon } from "utils/chain";

// import * as styled from "./styles";
import { SelectIcon } from "../AssetSelect/styles";

interface NetworkSelectProps {
  networks: CoinNetwork[];
  onChange: any;
  selectedNetwork: string;
  fullWidth?: boolean;
}

const NetworkSelect = ({ networks, onChange, selectedNetwork, fullWidth }: NetworkSelectProps) => {
  const intl = useIntl();

  const networkOptions = networks?.map((n) => {
    return {
      caption: n.name,
      value: n,
      // leftElement: <CoinIcon coin={n.network} />,
      leftElement: <SelectIcon>{getChainIcon(n.network)}</SelectIcon>,
    };
  });

  return (
    <Select
      fullWidth={fullWidth}
      options={networkOptions}
      onChange={onChange}
      placeholder={intl.formatMessage({ id: "deposit.network" })}
      label={intl.formatMessage({ id: "deposit.network" })}
      value={networkOptions?.find((o) => o.value.network === selectedNetwork)}
    />
  );
};

export default NetworkSelect;
