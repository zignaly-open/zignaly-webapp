import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { composeWithDevTools } from "redux-devtools-extension";

const migrations = {};

const persistConfig = {
  key: "zignaly-webapp",
  storage,
  stateReconciler: autoMergeLevel2,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ["ui", "views"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
