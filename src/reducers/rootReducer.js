import {combineReducers} from 'redux';

import settings from './settings';
import session from './session';

export default combineReducers({
    session,
    settings,
});
