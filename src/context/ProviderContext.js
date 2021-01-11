import React from "react";

/**
 * @typedef {Object} ProviderContextObject
 * @property {boolean} hasAllocated
 * @property {React.SetStateAction<*>} setHasAllocated
 */

export default React.createContext(/** @type {Partial<ProviderContextObject>} **/ ({}));
