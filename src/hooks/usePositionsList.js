import { useState, useEffect, useRef } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useInterval from "./useInterval";
import { assign, cloneDeep, filter, isEmpty, isFunction, omitBy } from "lodash";
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
 * @typedef {Object} PositionsState
 * @property {UserPositionsCollection} open
 * @property {UserPositionsCollection} closed
 * @property {UserPositionsCollection} log
 * @property {UserPositionsCollection} profileOpen
 * @property {UserPositionsCollection} profileClosed
 */

/**
 * Provides positions data load by collection type.
 *
 * Encapsulates the data fetch from Trade API and local state handling.
 *
 * @param {PositionsCollectionType} type Collection type to fetch.
 * @param {PositionEntity|null} [positionEntity] Position entity (optional) to narrow data to single position.
 * @param {function} [notifyPositionsUpdate] Callback to notify the updated positions list.
 * @returns {HookPositionsListData} Positions collection.
 */
const usePositionsList = (type, positionEntity = null, notifyPositionsUpdate = null) => {
  const typeRef = useRef(null);
  const storeSettings = useStoreSettingsSelector();
  const storeViews = useStoreViewsSelector();
  const exchangeRef = useRef(storeSettings.selectedExchange.exchangeId);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const defaultFilters = {
    provider: "all",
    pair: "all",
    side: "all",
    type: "all",
  };

  /**
   * @type {PositionsState}
   */
  const defaultPositionsState = {
    open: null,
    closed: null,
    log: null,
    profileOpen: null,
    profileClosed: null,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [positions, setPositions] = useState(cloneDeep(defaultPositionsState));

  const storeSession = useStoreSessionSelector();
  /**
   * Resolve a Trade API fetch method to fetch positions of a given category.
   *
   * @returns {Promise<UserPositionsCollection>} Promise method when category mapping is resolved, empty promise otherwise.
   */
  const routeFetchMethod = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    const providerPayload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
    };

    // Skip request if required parameters is empty.
    if (!isEmpty(payload.internalExchangeId) || !isEmpty(providerPayload.providerId)) {
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
    }

    // Fallback to null promise when method not resolved.
    return new Promise((resolve) => {
      resolve(null);
    });
  };

  /**
   * Filter positions list by filters criteria.
   *
   * @param {UserPositionsCollection} filterPositions Positions collection.
   * @returns {UserPositionsCollection} Filtered positions collection.
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

  const prepareNewPositionsState = () => {
    let newPositions = { ...positions };
    // Reset new positions state on exchange change.
    if (exchangeRef.current !== storeSettings.selectedExchange.internalId) {
      newPositions = cloneDeep(defaultPositionsState);
      exchangeRef.current = storeSettings.selectedExchange.internalId;
    }

    // Only show loader at initial load to avoid loader experience disruption on updates.
    if (newPositions[type] === null) {
      setLoading(true);
    }

    return newPositions;
  };

  const loadPositions = () => {
    const fetchMethod = routeFetchMethod();

    if (fetchMethod) {
      const newPositions = prepareNewPositionsState();
      fetchMethod
        .then((fetchData) => {
          // Prevent other tabs request leftover to from race condition that override current tab data.
          if (!typeRef.current || typeRef.current === type) {
            newPositions[type] = fetchData;
            setPositions(newPositions);

            if (isFunction(notifyPositionsUpdate)) {
              notifyPositionsUpdate(newPositions[type]);
            }
          }
        })
        .catch((e) => {
          if (e.code === 18 || e.code === 12) {
            newPositions[type] = [];
            setPositions(newPositions);
          } else {
            dispatch(showErrorAlert(e));
          }
        })
        .finally(() => {
          if (!typeRef.current || typeRef.current === type) {
            setLoading(false);
          }
        });
    }
  };
  useEffect(loadPositions, [
    type,
    storeSession.tradeApi.accessToken,
    storeSettings.selectedExchange.internalId,
  ]);

  /**
   * Load a specific position by ID.
   *
   * @returns {boolean} false in case that required parameter was missing, true otherwise.
   */
  const loadPosition = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId: positionEntity.positionId,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    // Skip request if required parameters are empty.
    if (isEmpty(payload.internalExchangeId) || isEmpty(positionEntity.positionId)) {
      return false;
    }

    const newPositions = prepareNewPositionsState();
    tradeApi
      .positionGet(payload)
      .then((data) => {
        newPositions[type] = [data];
        setPositions(newPositions);

        if (isFunction(notifyPositionsUpdate)) {
          notifyPositionsUpdate(newPositions[type]);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });

    return true;
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
  useInterval(updateData, 5000, true);

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
    positionsAll: positions[type] || [],
    positionsFiltered: filterData(positions[type] || []),
    setFilters: combineFilters,
    loading: loading,
  };
};

export default usePositionsList;
