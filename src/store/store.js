import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
import DefaultState from "./initialState";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

/**
 * @typedef {ThunkAction<void, DefaultState, unknown, Action<Object>>} AppThunk
 */

const persistConfig = {
  key: "zignaly-webapp2",
  storage,
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, DefaultState, applyMiddleware(thunk));
export const persistor = persistStore(store);
