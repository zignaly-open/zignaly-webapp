import React from 'react';
import { Provider } from 'react-redux';

import store from './src/store/store.js';

export const wrapRootElement = ({ element }) => {
    return (
        <Provider store={store}>{element}</Provider>
    );
}
