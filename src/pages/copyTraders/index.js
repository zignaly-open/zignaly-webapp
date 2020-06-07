import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../store/actions/views";

/**
 *
 * @typedef {Object} LocationObject
 * @property {String} pathname
 */

/**
 * @typedef {Object} ProviderProps
 * @property {LocationObject} location position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {ProviderProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTraders = ({ location }) => {
  const storeSession = useStoreSessionSelector();
  const providerId = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProvider = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: providerId,
      };
      dispatch(setProvider(payload));
    };

    loadProvider();
  }, [providerId]);

  return (
    <Router>
      <Profile providerId={providerId} path="/copyTraders/:providerId/profile" />
    </Router>
  );
};

export default CopyTraders;
