import { useState, useEffect, useRef } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useInterval from "use-interval";
import { assign, filter, omitBy } from "lodash";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useStoreViewsSelector from "./useStoreViewsSelector";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {"open" | "closed" | "log" | "profileOpen" | "profileClosed"} PositionsCollectionType
 */

/**
 * @typedef {Object} HookPositionsListData
 * @property {UserPositionsCollection} positionsAll
 * @property {UserPositionsCollection} positionsFiltered
 * @property {Function} setFilters
 * @property {Boolean} loading
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
  const typeRef = useRef(null);
  const storeSettings = useStoreSettingsSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const defaultFilters = {
    provider: "all",
    pair: "all",
    side: "all",
    type: "all",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [positions, setPositions] = useState({
    open: null,
    closed: null,
    log: null,
    profileOpen: null,
    profileClosed: null,
  });

  const storeSession = useStoreSessionSelector();
  const routeFetchMethod = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    const providerPayload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
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
    } else if (type === "profileOpen") {
      return tradeApi.providerOpenPositions(providerPayload);
    } else if (type === "profileClosed") {
      return tradeApi.providerSoldPositions(providerPayload);
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
      // Only show loader at initial load to avoid loader experience disruption on updates.
      if (positions[type] === null) {
        setLoading(true);
      }

      fetchMethod
        .then((fetchData) => {
          // Prevent other tabs request leftover to from race condition that override current tab data.
          if (!typeRef.current || typeRef.current === type) {
            const newPositions = { ...positions, [type]: fetchData };
            setPositions(newPositions);
          }
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loadPosition = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId: positionEntity.positionId,
    };

    tradeApi
      .positionGet(payload)
      .then((data) => {
        const newPositions = { ...positions, [type]: [data] };
        setPositions(newPositions);
        setLoading(false);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
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
  useEffect(loadPositions, [
    type,
    storeSession.tradeApi.accessToken,
    storeSettings.selectedExchange.internalId,
  ]);
  useInterval(updateData, 5000);

  /**
   * Update filters with selected exchange.
   *
   * @returns {Void} None.
   */
  const updateFilters = () => {
    const newFilters = {
      ...filters,
    };

    setFilters(newFilters);
  };
  useEffect(updateFilters, []);

  const handlePositionTypeChange = () => {
    typeRef.current = type;
  };
  useEffect(handlePositionTypeChange, [type]);

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
    loading: loading,
  };
};

export default usePositionsList;
