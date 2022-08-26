import { navigate } from "@reach/router";
import { useState, useRef } from "react";
import { composeHash } from "services/tz";

/**
 * Get url path, supporting ctaId query string inside hash, and handling sub path such as exchangeAccounts/deposit
 */
export const getURLPath = () => {
  const hash =
    typeof window !== "undefined"
      ? window.location.href.split("#")[1]?.split("?")[0]?.split("/")[1]
      : "";
  return hash || "/";
};

/**
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPath} ModalPath
 * @typedef {import("../components/ConnectExchangeView/ModalPathContext").ModalPathParams} ModalPathParams
 * @typedef {import('../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Handle the state management for the modal path data that is shared via context.
 *
 * @param {Boolean} [initialBack]
 * @param {ExchangeConnectionEntity} [initialSelectedAccount]
 *
 * @returns {ModalPath} Modal path state object.
 */
const useModalPath = (initialSelectedAccount) => {
  const modalPath = "#exchangeAccounts";

  /**
   * @type {ModalPathParams}
   */
  const initialState = {
    // If we start with a sub path, allow navigating back to root page
    previousPath: getURLPath() ? "/" : "",
    title: "",
    tempMessage: "",
    selectedAccount: initialSelectedAccount,
  };
  const [pathParams, setPathParams] = useState(initialState);
  const formRef = useRef(null);

  const doNavigate = (path, accountInternalId) => {
    const newPath = path && path !== "/" ? "/" + path : "";
    const hash = `${modalPath}${newPath}`;
    const ctaId = path && path !== "/" ? path : "";
    navigate(composeHash(hash, ctaId, accountInternalId));
  };

  /**
   * @param {string} path Path to navigate to.
   * @param {ExchangeConnectionEntity} selectedAccount Selected account used in sub paths
   * @returns {void}
   */
  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      previousPath: getURLPath(),
      selectedAccount,
    });
    doNavigate(path, selectedAccount?.internalId);
  };

  /**
   * Navigate to path and reset all other params.
   * @param {string} path Path to navigate to.
   * @returns {void}
   */
  const resetToPath = (path) => {
    setPathParams({});
    doNavigate(path);
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
