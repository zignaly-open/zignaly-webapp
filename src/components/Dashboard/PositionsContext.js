import React from "react";

/**
 * @typedef {Object} PositionsContextObject
 * @property {number} openCount
 * @property {number} closeCount
 * @property {number} logCount
 * @property {React.SetStateAction<*>} setOpenCount
 * @property {React.SetStateAction<*>} setCloseCount
 * @property {React.SetStateAction<*>} setLogCount
 */

export default React.createContext(/** @type {Partial<PositionsContextObject>} **/ ({}));
