import { useState, useEffect, useRef } from "react";
import tradeApi from "../services/tradeApiClient";
import useInterval from "./useInterval";
import {
  assign,
  cloneDeep,
  filter,
  isEmpty,
  isFunction,
  omitBy,
  partial,
  sortBy,
  uniqBy,
} from "lodash";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import useStoreViewsSelector from "./useStoreViewsSelector";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useFilters from "./useFilters";

/**
 * @typedef {import("../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../services/tradeApiClient.types").PositionEntity} PositionEntity
 * @typedef {"open" | "closed" | "log" | "profileOpen" | "profileClosed"} PositionsCollectionType
 * @typedef {import('../components/CustomSelect/CustomSelect').OptionType} OptionType
 * @typedef {import("../store/initialState").Filters} Filters
 * @typedef {Object<string, boolean>} UpdatingIndex
 */

/**
 * @typedef {Object} HookPositionsListData
 * @property {UserPositionsCollection} positionsAll
 * @property {UserPositionsCollection} positionsFiltered
 * @property {Function} setFilters
 * @property {function} clearFilters
 * @property {Boolean} loading
 * @property {Function} flagPositionUpdating
 * @property {Boolean} filtersVisibility
 * @property {Function} setFiltersVisibility
 * @property {Filters['dashboardPositions']} filters
 * @property {number} modifiedFilters
 * @property {Array<OptionType>} providerOptions
 * @property {Array<OptionType>} pairOptions
 * @property {Array<OptionType>} sides
 * @property {Array<OptionType>} types
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
 * @param {"dashboardPositions"} [persistKey] Key to persist filters to store.
 * @returns {HookPositionsListData} Positions collection.
 */
const usePositionsList = (
  type,
  positionEntity = null,
  notifyPositionsUpdate = null,
  persistKey,
) => {
  const typeRef = useRef(null);
  const storeSettings = useStoreSettingsSelector();
  const selectedExchange = useSelectedExchange();
  const storeViews = useStoreViewsSelector();
  const exchangeRef = useRef(selectedExchange.exchangeId);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    // Fix wrong value at first render
    noSsr: true,
  });

  /**
   * Track the position IDs that have performed an open position update action.
   */
  const [updatingIndex, setUpdatingIndex] = useState(
    /** @type {UpdatingIndex} updatingIndex */ ({}),
  );

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
  const [positions, setPositions] = useState(defaultPositionsState);
  const positionsAll = positions[type] || [];
  const [filtersVisibility, setFiltersVisibility] = useState(!isMobile);

  const extractPairOptions = () => {
    const coinsDistinct = uniqBy(positionsAll, "pair").map((position) => {
      return { label: position.pair, val: position.pair };
    });

    return [{ label: "All Pairs", val: "all" }].concat(sortBy(coinsDistinct, "label"));
  };

  const extractProviderOptions = () => {
    const providersDistinct = uniqBy(positionsAll, "providerName").map((position) => {
      return {
        label: position.providerName,
        val: position.providerId,
      };
    });

    return [{ label: "All Providers", val: "all" }].concat(sortBy(providersDistinct, "label"));
  };

  const pairOptions = extractPairOptions();
  const sides = [
    { label: "All Sides", val: "all" },
    { label: "SHORT", val: "SHORT" },
    { label: "LONG", val: "LONG" },
  ];

  const types = [
    { label: "All Types", val: "all" },
    { label: "UNSOLD", val: "unsold" },
    { label: "UNOPEN", val: "unopen" },
  ];

  const providerOptions = extractProviderOptions();

  const storeFilters = storeSettings.filters[persistKey];
  const defaultFilters = {
    providerId: "all",
    pair: "all",
    side: "all",
    type: "all",
    status: "",
  };
  const optionsFilters = {
    providerId: providerOptions,
    pair: pairOptions,
    side: sides,
    type: types,
  };

  const res = useFilters(defaultFilters, storeFilters, optionsFilters, persistKey);
  const { setFilters, clearFilters, modifiedFilters } = res;
  /**
   * @type {Filters[typeof persistKey]}
   */
  // @ts-ignore
  const filters = res.filters;

  const statusRef = useRef(filters.status);

  /**
   * Resolve a Trade API fetch method to fetch positions of a given category.
   *
   * @returns {Promise<UserPositionsCollection>} Promise method when category mapping is resolved, empty promise otherwise.
   */
  const routeFetchMethod = () => {
    const payload = {
      internalExchangeId: selectedExchange.internalId,
    };

    const providerId = storeViews.provider.id;

    // Skip request if required parameters is empty.
    if (!isEmpty(payload.internalExchangeId) || !isEmpty(providerId)) {
      if (positionEntity) {
        // On first load rely on position entity passed by parent to avoid extra request.
        return new Promise((resolve) => {
          resolve([positionEntity]);
        });
      } else if (type === "closed") {
        return tradeApi.closedPositionsGet(payload);
      } else if (type === "log") {
        if (filters.status === "all") {
          return tradeApi.logPositionsGet({ ...payload, extendedStatuses: true });
        }

        return tradeApi.logPositionsGet(payload);
      } else if (type === "open") {
        return tradeApi.openPositionsGet(payload);
      } else if (type === "profileOpen") {
        return tradeApi.providerOpenPositions(providerId);
      } else if (type === "profileClosed") {
        return tradeApi.providerSoldPositions(providerId);
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
     * @param {string|OptionType} value Value to check.
     * @returns {boolean} TRUE when equals, FALSE otherwise.
     */
    const isAll = (value) => {
      if (typeof value === "object") {
        return value.val === "all";
      }
      return value === "all" || value === "";
    };
    let filterValues = omitBy(filters, isAll);

    // Only use the type filter on log positions table.
    if (type !== "log") {
      delete filterValues.type;
    }
    const matches = filter(filterPositions, filterValues);

    return /** @type {UserPositionsCollection} */ (matches);
  };

  /**
   * Prepare new positions state, clearing any previous state when needed.
   *
   * @param {string} initiatorExchangeInternalId Exchange that was selected at the moment when fetch was triggered.
   * @returns {PositionsState} Positions state.
   */
  const prepareNewPositionsState = (initiatorExchangeInternalId) => {
    let newPositions = { ...positions };
    // Reset new positions state on exchange change.
    if (exchangeRef.current !== initiatorExchangeInternalId) {
      newPositions = cloneDeep(defaultPositionsState);
      exchangeRef.current = selectedExchange.internalId;
    }

    // Only show loader at initial load to avoid loader experience disruption on updates.
    if (newPositions[type] === null) {
      setLoading(true);
    }

    if (statusRef.current !== filters.status) {
      setLoading(true);
      statusRef.current = filters.status;
    }

    return newPositions;
  };

  /**
   * Get all statuses log positions.
   *
   * Fallback request when reduced statuses requests don't retrieved positions.
   *
   * @returns {Promise<UserPositionsCollection|null>} All statuses log positions.
   */
  const fallbackLogPositionsAllStatuses = async () => {
    let requestData = null;
    const payload = {
      internalExchangeId: selectedExchange.internalId,
    };

    try {
      requestData = await tradeApi.logPositionsGet({ ...payload, extendedStatuses: true });
      // If got results, activate all statuses checkbox.
      if (!isEmpty(requestData)) {
        setFilters({
          ...filters,
          status: "all",
        });
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }

    return requestData;
  };

  /**
   * Load user positions for a given exchange.
   *
   * @param {string} initiatorExchangeInternalId Exchange that was selected at the moment when fetch was triggered.
   * @returns {function():void} Effect clean callback.
   */
  const loadPositions = (initiatorExchangeInternalId) => {
    let cancel = false;
    const fetchMethod = routeFetchMethod();
    const newPositions = prepareNewPositionsState(initiatorExchangeInternalId);
    // Check to prevent other tabs / exchanages leftover requests race condition
    // that override current tab data.
    const isOriginalInitiator = () => {
      return (
        !cancel &&
        (!typeRef.current || typeRef.current === type) &&
        (!exchangeRef.current || exchangeRef.current === initiatorExchangeInternalId)
      );
    };

    if (fetchMethod) {
      fetchMethod
        .then(async (fetchData) => {
          if (isOriginalInitiator()) {
            newPositions[type] = fetchData;
            if (type === "log" && filters.status === "" && isEmpty(fetchData)) {
              newPositions[type] = (await fallbackLogPositionsAllStatuses()) || [];
            }

            if (type === "open") {
              newPositions[type] = mutateUpdatingPositions(newPositions[type]);
            }

            setPositions(newPositions);
            if (isFunction(notifyPositionsUpdate)) {
              notifyPositionsUpdate(newPositions[type]);
            }
          }
        })
        .catch((e) => {
          if (isOriginalInitiator()) {
            if (e.code === 18 || e.code === 12) {
              newPositions[type] = [];
              setPositions(newPositions);
            } else {
              dispatch(showErrorAlert(e));
            }
          }
        })
        .finally(() => {
          if (isOriginalInitiator()) {
            setLoading(false);
          }
        });
    }

    return () => {
      cancel = true;
    };
  };

  const loadPositionsForExchange = partial(loadPositions, selectedExchange.internalId);
  useEffect(loadPositionsForExchange, [type, filters.status, selectedExchange.internalId]);

  /**
   * Load a specific position by ID.
   *
   * @param {string} initiatorExchangeInternalId Exchange that was selected at the moment when fetch was triggered.
   * @returns {boolean} false in case that required parameter was missing, true otherwise.
   */
  const loadPosition = (initiatorExchangeInternalId) => {
    const payload = {
      positionId: positionEntity.positionId,
      internalExchangeId: selectedExchange.internalId,
    };

    // Skip request if required parameters are empty.
    if (isEmpty(payload.internalExchangeId) || isEmpty(positionEntity.positionId)) {
      return false;
    }

    tradeApi
      .positionGet(payload)
      .then((data) => {
        const newPositions = {
          ...prepareNewPositionsState(initiatorExchangeInternalId),
          [type]: [data],
        };
        // If current position status type changes we need to update where its stored
        if (["open", "log", "closed"].includes(data.type) && data.type !== type) {
          // @ts-ignore
          newPositions[data.type] = [data];
        }
        setPositions(newPositions);

        // if (type === "open") {
        //   newPositions[type] = mutateUpdatingPositions(newPositions[type]);
        // }

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

  const loadPositionForExchange = partial(loadPosition, selectedExchange.internalId);
  const updateData = () => {
    // Only open positions needs continuos updates.
    if (type === "open" || type === "profileOpen") {
      // Single position update.
      if (positionEntity) {
        loadPositionForExchange();
      } else {
        // Multiples position update.
        loadPositionsForExchange();
      }
    }
  };
  useInterval(updateData, 10000, true);

  const handlePositionTypeChange = () => {
    typeRef.current = type;
  };
  useEffect(handlePositionTypeChange, [type]);

  /**
   * Mutate those that started an update action as with updating flag.
   *
   * @param {UserPositionsCollection} currentPositionsCollection Current positions collection.
   * @returns {UserPositionsCollection} Mutated updating flag positions collection.
   */
  const mutateUpdatingPositions = (currentPositionsCollection) => {
    return currentPositionsCollection.map((position) => {
      if (updatingIndex[position.positionId]) {
        return { ...position, updating: true };
      }

      return position;
    });
  };

  /**
   * Flag a given position as updating.
   *
   * @param {string} positionId Position ID to flag.
   * @returns {Void} None.
   */
  const flagPositionUpdating = (positionId) => {
    // Add to updating index so this state persists even when backend have not
    // started to process and avoid that duplicated actions are performed.
    if (!updatingIndex[positionId]) {
      const newUpdatingIndex = { [positionId]: true };
      // Combine with others IDs that exists in current index state.
      setUpdatingIndex(assign(updatingIndex, newUpdatingIndex));
    }

    if (positions[type]) {
      const newPositions = mutateUpdatingPositions(positions[type]);
      setPositions({ ...positions, [type]: newPositions });
    }
  };

  return {
    positionsAll,
    positionsFiltered: filterData(positions[type] || []),
    setFilters,
    filters,
    clearFilters,
    modifiedFilters,
    loading: loading,
    flagPositionUpdating,
    filtersVisibility,
    setFiltersVisibility,
    providerOptions,
    pairOptions,
    types,
    sides,
  };
};

export default usePositionsList;
