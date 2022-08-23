import { useState, useRef } from "react";

/**
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPath} ModalPath
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPathParams} ModalPathParams
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Handle the state management for the modal path data that is shared via context.
 *
 * @param {string} [initialPath]
 * @param {ExchangeConnectionEntity} [initialSelectedAccount]
 *
 * @returns {ModalPath} Modal path state object.
 */
const useModalPath = (initialPath, initialSelectedAccount) => {
  /**
   * @type {ModalPathParams}
   */
  const initialState = {
    currentPath: initialPath || "realAccounts",
    previousPath: initialPath ? "realAccounts" : "",
    title: "",
    tempMessage: "",
    selectedAccount: initialSelectedAccount,
  };
  const [pathParams, setPathParams] = useState(initialState);
  const formRef = useRef(null);

  /**
   * @param {string} path Path to navigate to.
   * @param {ExchangeConnectionEntity} selectedAccount Selected account used in sub paths
   * @returns {void}
   */
  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };

  /**
   * Navigate to path and reset all other params.
   * @param {string} path Path to navigate to.
   * @returns {void}
   */
  const resetToPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };

  /**
   * @param {string} title Modal title.
   * @returns {void}
   */
  const setTitle = (title) => {
    setPathParams({
      ...pathParams,
      title,
    });
  };

  /**
   * Show a temporary message for 10 secs.
   * @param {string} tempMessage Message
   * @returns {void}
   */
  const setTempMessage = (tempMessage) => {
    setPathParams({
      ...pathParams,
      tempMessage,
    });
  };

  return {
    pathParams,
    setPathParams,
    navigateToPath,
    resetToPath,
    setTitle,
    setTempMessage,
    formRef,
  };
};

export default useModalPath;
