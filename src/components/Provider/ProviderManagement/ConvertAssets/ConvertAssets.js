import React, { useState } from "react";
import { Convert } from "components/ConnectExchangeView/ExchangeAccountBalanceManagement/Convert";
import useProviderAssets from "hooks/useProviderAssets";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider object.
 * @property {ExchangeConnectionEntity} selectedExchange Selected exchange account.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConvertAssets = ({ provider, selectedExchange }) => {
  const [updatedAt, setUpdatedAt] = useState(null);
  const assets = useProviderAssets(selectedExchange.internalId, provider.id, updatedAt);

  return (
    <Convert
      assets={assets}
      loadData={() => setUpdatedAt(new Date())}
      selectedAccount={selectedExchange}
      showHeader={false}
    />
  );
};

export default ConvertAssets;
