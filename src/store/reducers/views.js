import { assign } from "lodash";
import initialState from "../initialState";
import { GET_PROVIDER, REMOVE_PROVIDER, SHOW_PROFILE_LOADER } from "../actions/views";

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {Object} payload
 */

/**
 * @param {*} state
 * @param {ActionObject} action
 */

const views = (state = initialState.views, action) => {
  const newState = assign({}, state);

  switch (action.type) {
    case GET_PROVIDER:
      newState.provider = action.payload;
      break;
    case REMOVE_PROVIDER:
      newState.provider = initialState.views.provider;
      break;
    case SHOW_PROFILE_LOADER:
      newState.provider.loading = action.payload;
      break;

    default:
      return state;
  }

  return newState;
};

export default views;
