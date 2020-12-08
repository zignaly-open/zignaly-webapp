import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@material-ui/core";
import CoinsTable from "../../../Balance/Coins/CoinsTable";
import CoinsFilter from "../../../Balance/Coins/CoinsFilter";
import useProviderAssets from "hooks/useProviderAssets";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */
/**
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider object.
 * @property {ExchangeConnectionEntity} selectedExchange Selected exchange account.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Coins = ({ provider, selectedExchange }) => {
  const [list, setList] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const assets = useProviderAssets(selectedExchange.internalId, provider.id, updatedAt);
  const data = Object.values(assets);
  const loading = data.length === 0;

  const initData = () => {
    setList(data);
  };

  useEffect(initData, [data.length]);

  /**
   * @param {Array<ExchangeAsset>} filtered Filtered equity data.
   * @returns {void}
   */
  const handleChange = (filtered) => {
    setList(filtered);
  };

  const embedFilter = <CoinsFilter list={data} onChange={handleChange} />;

  return (
    <>
      {loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && (
        <Box
          alignItems="flex-start"
          className="providerCoins"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <CoinsTable
            list={list}
            loadData={() => setUpdatedAt(new Date())}
            persistKey="exchangeAssets"
            title={embedFilter}
          />
        </Box>
      )}
    </>
  );
};

export default Coins;
