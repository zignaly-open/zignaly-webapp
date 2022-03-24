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

const migrations = {};

const persistConfig = {
  key: "zignaly-app",
  storage,
  stateReconciler: autoMergeLevel2,
  version: 30,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ["ui", "views"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);

// expose store when run in Cypress
// @ts-ignore
if (typeof window !== "undefined" && window.Cypress) {
  // @ts-ignore
  window.store = store;
}
