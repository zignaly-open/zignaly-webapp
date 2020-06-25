import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useInterval from "use-interval";
import { assign, filter, omitBy } from "lodash";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {"open" | "closed" | "log"} PositionsCollectionType
 */

/**
 * @typedef {Object} HookPositionsListData
 * @property {UserPositionsCollection} positionsAll
 * @property {UserPositionsCollection} positionsFiltered
 * @property {Function} setFilters
 */

/**
 * Provides positions data load by collection type.
 *
 * Encapsulates the data fetch from Trade API and local state handling.
 *
 * @param {PositionsCollectionType} type Collection type to fetch.
 * @param {PositionEntity|null} [positionEntity] Position entity (optional) to narrow data to single position.
 * @returns {HookPositionsListData} Positions collection.
 */
const usePositionsList = (type, positionEntity = null) => {
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const defaultFilters = {
    provider: "all",
    pair: "all",
    side: "all",
    type: "all",
    internalExchangeId: storeSettings.selectedExchange.internalId,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [positions, setPositions] = useState({
    open: [],
    closed: [],
    log: [],
  });

  const storeSession = useStoreSessionSelector();
  const routeFetchMethod = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    if (positionEntity) {
      // On fist load rely on position entity passed by parent to avoid extra rquest.
      return new Promise((resolve) => {
        resolve([positionEntity]);
      });
    } else if (type === "closed") {
      return tradeApi.closedPositionsGet(payload);
    } else if (type === "log") {
      return tradeApi.logPositionsGet(payload);
    } else if (type === "open") {
      return tradeApi.openPositionsGet(payload);
    }

    return false;
  };

  /**
   * Filter positions list by filters criteria.
   *
   * @param {UserPositionsCollection} filterPositions Positions collection.
   * @returns {UserPositionsCollection | null} Filtered positiosn collection.
   */
  const filterData = (filterPositions) => {
    /**
     * Checks if value equals to "all".
     *
     * @param {string} value Value to check.
     * @returns {boolean} TRUE when equals, FALSE otherwise.
     */
    const isAll = (value) => value === "all";
    const filterValues = omitBy(filters, isAll);

    // Only use the type filter on log positions table.
    if (type !== "log") {
      delete filterValues.type;
    }

    const matches = filter(filterPositions, filterValues);

    return /** @type {UserPositionsCollection} */ (matches);
  };

  const loadPositions = () => {
    const fetchMethod = routeFetchMethod();

    if (fetchMethod) {
      fetchMethod
        .then((fetchData) => {
          const newPositions = { ...positions, [type]: fetchData };
          setPositions(newPositions);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  const loadPosition = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId: positionEntity.positionId,
    };

    tradeApi
      .positionGet(payload)
      .then((data) => {
        const newPositions = { ...positions, [type]: [data] };
        setPositions(newPositions);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  const updateData = () => {
    // Only open positions needs continuos updates.
    if (type === "open") {
      // Single position update.
      if (positionEntity) {
        loadPosition();
      } else {
        // Multiples position update.
        loadPositions();
      }
    }
  };

  useEffect(loadPositions, [type, storeSession.tradeApi.accessToken]);
  useInterval(updateData, 5000);

  /**
   * Update filters with selected exchange.
   *
   * @returns {Void} None.
   */
  const updateFilters = () => {
    const newFilters = {
      ...filters,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    setFilters(newFilters);
  };

  useEffect(updateFilters, [storeSettings.selectedExchange.internalId]);

  /**
   * Combine external state filters with local state.
   *
   * @param {defaultFilters} values External filter values.
   *
   * @returns {Void} None.
   */
  const combineFilters = (values) => {
    const newFilters = assign({}, filters, values);
    setFilters(newFilters);
  };

  return {
    positionsAll: positions[type],
    positionsFiltered: filterData(positions[type]),
    setFilters: combineFilters,
  };
};

export default usePositionsList;
