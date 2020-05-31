import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useInterval from "use-interval";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {"open" | "closed" | "log"} PositionsCollectionType
 */

/**
 * Provides positions data load by collection type.
 *
 * Encapsulates the data fetch from Trade API and local state handling.
 *
 * @param {PositionsCollectionType} type Collection type to fetch.
 * @returns {UserPositionsCollection} Positions collection.
 */
const usePositionsList = (type) => {
  const [positions, setPositions] = useState([]);
  const storeSession = useStoreSessionSelector();
  const fetchPositions = async () => {
    try {
      const payload = {
        token: storeSession.tradeApi.accessToken,
      };

      if (type === "closed") {
        return await tradeApi.closedPositionsGet(payload);
      }

      if (type === "log") {
        return await tradeApi.logPositionsGet(payload);
      }

      return await tradeApi.openPositionsGet(payload);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }

    return [];
  };

  const loadData = () => {
    fetchPositions().then((fetchData) => {
      setPositions(fetchData);
    });
  };

  const updateData = () => {
    // Only open positions needs continuos updates.
    if (type === "open") {
      loadData();
    }
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken]);
  useInterval(updateData, 5000);

  return positions;
};

export default usePositionsList;
