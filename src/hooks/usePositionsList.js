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
  const [positions, setPositions] = useState({
    open: [],
    closed: [],
    log: [],
  });
  const storeSession = useStoreSessionSelector();
  const routeFetchMethod = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };

    if (type === "closed") {
      return tradeApi.closedPositionsGet(payload);
    }

    if (type === "log") {
      return tradeApi.logPositionsGet(payload);
    }

    if (type === "open") {
      return tradeApi.openPositionsGet(payload);
    }

    return false;
  };

  const loadData = () => {
    const fetchMethod = routeFetchMethod();
    if (fetchMethod) {
      fetchMethod
        .then((fetchData) => {
          const newPositions = { ...positions, [type]: fetchData };
          setPositions(newPositions);
        })
        .catch((e) => {
          alert(`ERROR: ${e.message}`);
        });
    }
  };

  const updateData = () => {
    // Only open positions needs continuos updates.
    if (type === "open") {
      loadData();
    }
  };

  useEffect(loadData, [storeSession.tradeApi.accessToken, type]);
  useInterval(updateData, 5000);

  return positions[type];
};

export default usePositionsList;
