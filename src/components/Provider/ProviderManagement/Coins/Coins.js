import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@material-ui/core";
import CoinsTable from "../../../Balance/Coins/CoinsTable";
import CoinsFilter from "../../../Balance/Coins/CoinsFilter";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import useProviderAssets from "hooks/useProviderAssets";

/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserExchangeAssetObject} UserExchangeAssetObject
 * @typedef {import("../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 */
/**
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider Provider object.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Coins = ({ provider }) => {
  const [list, setList] = useState([]);
  const storeSettings = useStoreSettingsSelector();
  const assets = useProviderAssets(storeSettings.selectedExchange.internalId, provider.id);
  const data = Object.values(assets);
  const loading = data.length === 0;

  const initData = () => {
    setList(data);
  };

  useEffect(initData, [data.length]);

  /**
   * @param {Array<UserExchangeAssetObject>} filtered Filtered equity data.
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
          <CoinsTable list={list} persistKey="exchangeAssets" title={embedFilter} />
        </Box>
      )}
    </>
  );
};

export default Coins;
