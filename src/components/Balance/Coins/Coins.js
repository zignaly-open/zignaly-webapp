import React, { useState, useEffect } from "react";
import "./Coins.scss";
import { Box, CircularProgress } from "@material-ui/core";
import CoinsTable from "./CoinsTable";
import useUserExchangeAssets from "../../../hooks/useUserExchangeAssets";
import CoinsFilter from "./CoinsFilter";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import("../../../services/tradeApiClient.types").UserExchangeAssetObject} UserExchangeAssetObject
 */

const Coins = () => {
  const [list, setList] = useState([]);
  const storeSettings = useStoreSettingsSelector();
  const assets = useUserExchangeAssets(storeSettings.selectedExchange.internalId);
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
          className="history"
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
