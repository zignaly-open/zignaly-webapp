import React from "react";

/**
 * @typedef {Object} AppContextObject
 * @property {boolean} emptySettingsAlert
 * @property {React.SetStateAction<*>} setEmptySettingsAlert
 */

export default React.createContext(/** @type {Partial<AppContextObject>} **/ ({}));
