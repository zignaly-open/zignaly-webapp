import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { composeWithDevTools } from "redux-devtools-extension";

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
  13: (/** @type {PersistedDefaultState} */ state) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        sort: { ...state.settings.sort, signalp: "" },
      },
    };
  },
};

const persistConfig = {
  key: "zignaly-webapp2",
  storage,
  stateReconciler: autoMergeLevel2,
  version: 14,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ["ui"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
