import { createStore, applyMiddleware } from "redux";
import { cloneDeep } from "lodash";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { composeWithDevTools } from "redux-devtools-extension";
import initialState from "./initialState";

/**
 * @typedef {import("redux").Action} Action
 * @typedef {import("redux-thunk").ThunkAction<void, Function, unknown, Action>} AppThunk
 * @typedef {import("redux-persist").PersistedState} PersistedState
 * @typedef {import("./initialState").DefaultState} DefaultState
 */

/**
 * @typedef {PersistedState & DefaultState} PersistedDefaultState
 */

const migrations = {
  2: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      ...cloneDeep(initialState),
    };
  },
  11: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...cloneDeep(initialState.settings),
      },
    };
  },
  13: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        sort: { ...state.settings.sort, signalp: "" },
      },
    };
  },
  18: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        displayColumns: {
          ...state.settings.displayColumns,
          futuresDailyBalance: initialState.settings.displayColumns.futuresDailyBalance,
          providerContracts: initialState.settings.displayColumns.providerContracts,
          providerOrders: initialState.settings.displayColumns.providerOrders,
        },
      },
    };
  },
  19: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        displayColumns: {
          ...state.settings.displayColumns,
          copytProfileUsers: initialState.settings.displayColumns.copytProfileUsers,
        },
      },
    };
  },
  20: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      user: {
        ...state.user,
        userData: {
          ...state.user.userData,
          exchanges: initialState.user.userData.exchanges,
        },
      },
    };
  },
  21: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        balanceBox: initialState.settings.balanceBox,
      },
    };
  },
  23: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      user: {
        ...state.user,
        userData: {
          ...state.user.userData,
          isTrader: initialState.user.userData.isTrader,
        },
      },
    };
  },
  24: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        disableCacheModal: initialState.settings.disableCacheModal,
      },
    };
  },
  25: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        locale: initialState.settings.locale,
      },
    };
  },
  27: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        selectedExchangeId: state.user.userData.exchanges.find(
          // @ts-ignore
          (e) => e.internalId === state.settings.selectedExchange.internalId,
        ).internalId,
      },
    };
  },
  29: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      user: {
        ...state.user,
        userData: {
          ...state.user.userData,
          wall: initialState.user.userData.wall,
        },
      },
    };
  },
};

const persistConfig = {
  key: "zignaly-webapp2",
  storage,
  stateReconciler: autoMergeLevel2,
  version: 29,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ["ui", "views"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);

// expose store when run in Cypress
if (typeof window !== "undefined" && window.Cypress) {
  window.store = store;
}
