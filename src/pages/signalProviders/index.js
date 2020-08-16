import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import Edit from "./edit";
import Settings from "./settings";
import Analytics from "./providerAnalytics";
import Users from "./users";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider, unsetProvider } from "../../store/actions/views";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";
import { withPrefix } from "gatsby";
import ProviderLayout from "../../layouts/ProviderLayout";
import { ProviderRoute as SignalProviderRoute } from "../../components/RouteComponent/RouteComponent";
import BrowsePage from "./browse";

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

const SignalProviders = (props) => {
  const { location } = props;
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  // On production the application is served through an /app directory, ID position is +1 level.
  const idIndex = process.env.GATSBY_BASE_PATH === "" ? 2 : 3;
  const providerId = location.pathname.split("/")[idIndex];
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProvider = async () => {
      dispatch(unsetProvider());
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: providerId,
        version: 2,
      };
      dispatch(setProvider(payload));
    };
    if (providerId && providerId.length === 24 && storeViews.provider.id !== providerId) {
      loadProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  if (!providerId) {
    // Render Browse page
    return <BrowsePage {...props} />;
  }

  return (
    <ProviderLayout>
      <Router>
        <SignalProviderRoute
          component={Profile}
          path={withPrefix("/signalProviders/:providerId")}
          providerId={providerId}
        />
        <SignalProviderRoute
          component={Edit}
          path={withPrefix("/signalProviders/:providerId/edit")}
          providerId={providerId}
        />
        <SignalProviderRoute
          component={Settings}
          path={withPrefix("/signalProviders/:providerId/settings")}
          providerId={providerId}
        />
        <SignalProviderRoute
          component={Analytics}
          path={withPrefix("/signalProviders/:providerId/analytics")}
          providerId={providerId}
        />
        <SignalProviderRoute
          component={Users}
          path={withPrefix("/signalProviders/:providerId/users")}
          providerId={providerId}
        />
      </Router>
    </ProviderLayout>
  );
};

export default SignalProviders;
