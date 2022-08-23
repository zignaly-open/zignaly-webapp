import React from "react";

/**
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} ModalPathParams
 * @property {string} [currentPath]
 * @property {string} [previousPath]
 * @property {string} [title]
 * @property {string|React.ReactElement} [tempMessage]
 * @property {ExchangeConnectionEntity} [selectedAccount]
 * @property {boolean} [isLoading]
 */

/**
 * @typedef {Object} ModalPath
 * @property {ModalPathParams} pathParams
 * @property {React.MutableRefObject<any>} formRef
 * @property {function} navigateToPath
 * @property {React.Dispatch<React.SetStateAction<ModalPathParams>>} setPathParams
 * @property {function} resetToPath
 * @property {function} setTitle
 * @property {function} setTempMessage
 */

export default React.createContext(/** @type {Partial<ModalPath>} **/ ({}));
