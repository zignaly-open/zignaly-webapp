import { navigate } from "@reach/router";
import { useState, useRef } from "react";

export const getURLPath = () => {
  const currentHash = typeof window !== "undefined" ? window.location.hash?.slice(1) : "";
  return currentHash.split("/")[1] || "/";
};

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
  const modalPath = "#exchangeAccounts";
  // const rootPath = "#exchangeAccounts";
  /**
   * @type {ModalPathParams}
   */
  const initialState = {
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
    console.log(getURLPath());
    setPathParams({
      previousPath: getURLPath(),
      selectedAccount,
    });
    navigate(`${modalPath}${path ? "/" + path : ""}`);
  };

  /**
   * Navigate to path and reset all other params.
   * @param {string} path Path to navigate to.
   * @returns {void}
   */
  const resetToPath = (path) => {
    setPathParams({});
    navigate(`${modalPath}${path ? "/" + path : ""}`);
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
