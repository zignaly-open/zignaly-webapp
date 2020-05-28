import initialState from "../store/initialState";
import { assign } from "lodash";

const SELECT_LANGUAGE = "SELECT_LANGUAGE_ACTION";
const SELECT_THEME = "SELECT_THEME_ACTION";
const SET_DISPLAY_COLUMN = "SET_DISPLAY_COLUMN";

/**
 * @typedef {import("../store/initialState").DefaultStateSettings} StateSettingsType
 */

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {*} payload
 */

/**
 * @param {StateSettingsType} state Current settings state.
 * @param {ActionObject} action Action to reduce.
 * @returns {StateSettingsType} New settings state.
 */
const settings = (state, action) => {
  const newState = assign({}, initialState.settings, state);

  switch (action.type) {
    case SELECT_LANGUAGE:
      newState.languageCode = action.payload;
      break;

    case SELECT_THEME:
      newState.darkStyle = action.payload;
      break;

    case SET_DISPLAY_COLUMN:
      const { table, changedColumn, action: userAction } = action.payload;
      if (userAction === "add") {
        //   Add column to displayed list
        newState.displayColumns[table] = [...newState.displayColumns[table], changedColumn];
      } else {
        //   Remove column to displayed list
        newState.displayColumns[table] = newState.displayColumns[table].filter(
          (c) => c !== changedColumn,
        );
      }
      break;

    default:
      break;
  }

  return newState;
};

export default settings;
