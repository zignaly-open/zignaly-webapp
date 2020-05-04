import { createStore } from 'redux';

import rootReducer from '../reducers/rootReducer';
import initialState from "./initialState";

export default createStore(rootReducer, initialState);
