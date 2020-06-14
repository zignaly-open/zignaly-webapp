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
        version: 2,
      };
      dispatch(setProvider(payload));
    };
    if (providerId.length === 24 && storeViews.provider.id !== providerId) {
      loadProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  return (
    <Router>
      <Profile path="/copyTraders/:providerId/profile" providerId={providerId} />
      <Edit path="/copyTraders/:providerId/edit" providerId={providerId} />
      <Management path="/copyTraders/:providerId/management" providerId={providerId} />
      <Analytics path="/copyTraders/:providerId/analytics" providerId={providerId} />
      <Users path="/copyTraders/:providerId/users" providerId={providerId} />
      <Positions path="/copyTraders/:providerId/positions" providerId={providerId} />
    </Router>
  );
};

export default CopyTraders;
