import React from "react";
import { FormattedMessage } from "react-intl";
import { Label, Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Select from "../Select";
import { Control } from "../styles";
import ZignalyIcon from "images/exchanges/zignaly.svg";

interface SwapZIGProps {
  accountsBalances: BalanceExchange[];
  coinFrom?: string;
  coinTo?: string;
}

const SwapZIG = ({ coinFrom = "USDT", coinTo = "ZIG", accountsBalances }: SwapZIGProps) => {
  const exchangeOptions = accountsBalances.map((a) => ({
    value: a.exchangeId,
    label: a.name,
    icon: ZignalyIcon,
  }));

  return (
    <>
      <Title>
        <img src={WalletIcon} width={40} height={40} />
        <FormattedMessage id="wallet.zig.buy.title" values={{ coin: "ZIG" }} />
      </Title>
      <Control>
        <Label>
          <FormattedMessage id="wallet.zig.deposit.exchangeaccount" />
        </Label>
        <Select
          values={exchangeOptions}
          fullWidth
          value={internalId}
          handleChange={(e) => setInternalId(e.target.value)}
        />
      </Control>
    </>
  );
};
export default SwapZIG;
