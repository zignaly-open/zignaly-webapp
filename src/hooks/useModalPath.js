import { useState, useEffect, useRef } from "react";
import ModalPathContext from "../components/ConnectExchangeView/ModalPathContext";

/**
 * @typedef {import("../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict
 */

/**
 * Provides quotes assets.
 *
 * @returns {QuoteAssetsDict} Quote Assets.
 */
const useModalPath = () => {
  const [pathParams, setPathParams] = useState({
    currentPath: "realAccounts",
  });
  const formRef = useRef(null);

  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };

  const resetToPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };

  const setTitle = (title) => {
    setPathParams({
      ...pathParams,
      title,
    });
  };
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
