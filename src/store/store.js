import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import initialState from "./initialState";

const persistConfig = {
    key: 'zignaly-webapp2',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = createStore(persistedReducer, initialState, applyMiddleware(thunk))
export const persistor = persistStore(store)
