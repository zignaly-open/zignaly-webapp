import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const migrations = {};

const persistConfig = {
  key: "zignaly-webapp",
  storage,
  stateReconciler: autoMergeLevel2,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
  blacklist: ["ui"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
