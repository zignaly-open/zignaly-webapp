import React from 'react';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import { store } from './src/store/store.js';
import { persistor } from './src/store/store.js';

export const wrapRootElement = ({ element }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                {element}
            </PersistGate>
        </Provider>
    );
}
