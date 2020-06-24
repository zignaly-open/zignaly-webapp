import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import Edit from "./edit";
import Settings from "./settings";
import Analytics from "./providerAnalytics";
import Users from "./users";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../store/actions/views";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";
import { withPrefix } from "gatsby";

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

const SignalProviders = ({ location }) => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  // On production the application is served through an /app directory, ID position is +1 level.
  const idIndex = process.env.GATSBY_BASE_PATH === "" ? 2 : 3;
  const providerId = location.pathname.split("/")[idIndex];
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
      <Profile path={withPrefix("/signalProviders/:providerId/profile")} providerId={providerId} />
      <Edit path={withPrefix("/signalProviders/:providerId/edit")} providerId={providerId} />
      <Settings
        path={withPrefix("/signalProviders/:providerId/settings")}
        providerId={providerId}
      />
      <Analytics
        path={withPrefix("/signalProviders/:providerId/analytics")}
        providerId={providerId}
      />
      <Users path={withPrefix("/signalProviders/:providerId/users")} providerId={providerId} />
    </Router>
  );
};

export default SignalProviders;
