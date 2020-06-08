import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import Edit from "./edit";
import Management from "./management";
import Analytics from "./providerAnalytics";
import Users from "./users";
import Positions from "./positions";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../store/actions/views";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";

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
  const storeViews = useStoreViewsSelector();

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
    if (storeViews.provider.id !== providerId) {
      loadProvider();
    }
  }, [providerId]);

  return (
    <Router>
      <Profile providerId={providerId} path="/copyTraders/:providerId/profile" />
      <Edit providerId={providerId} path="/copyTraders/:providerId/edit" />
      <Management providerId={providerId} path="/copyTraders/:providerId/management" />
      <Analytics providerId={providerId} path="/copyTraders/:providerId/analytics" />
      <Users providerId={providerId} path="/copyTraders/:providerId/users" />
      <Positions providerId={providerId} path="/copyTraders/:providerId/positions" />
    </Router>
  );
};

export default CopyTraders;
