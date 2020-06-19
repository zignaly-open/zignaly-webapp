import { useState, useRef } from "react";

/**
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPath} ModalPath
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPathParams} ModalPathParams
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Handle the state management for the modal path data that is shared via context.
 *
 * @returns {ModalPath} Modal path state object.
 */
const useModalPath = () => {
  /**
   * @type {ModalPathParams}
   */
  const initialState = {
    currentPath: "realAccounts",
    previousPath: "",
    title: "",
    tempMessage: "",
    selectedAccount: null,
  };
  const [pathParams, setPathParams] = useState(initialState);
  const formRef = useRef(null);

  /**
   * @param {string} path
   * @param {ExchangeConnectionEntity} selectedAccount
   */
  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };

  /**
   * @param {string} path
   */
  const resetToPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };

  /**
   * @param {string} title
   */
  const setTitle = (title) => {
    setPathParams({
      ...pathParams,
      title,
    });
  };

  /**
   * @param {string} tempMessage
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
