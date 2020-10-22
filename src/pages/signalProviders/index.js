import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import Edit from "./edit";
import Settings from "./settings";
import Analytics from "./providerAnalytics";
import Users from "./users";
import News from "./news";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";
import { useDispatch } from "react-redux";
import { setProvider, unsetProvider, showProviderProfileLoader } from "../../store/actions/views";
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
  const { selectedExchange } = useStoreSettingsSelector();
  const { provider } = useStoreViewsSelector();
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
    if (providerId && providerId.length === 24) {
      loadProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  if (!providerId) {
    // Render Browse page
    return <BrowsePage {...props} />;
  }

  const allowAdminRoutes = provider.isAdmin && !provider.isClone;

  return (
    <ProviderLayout>
      <Router>
        <SignalProviderRoute
          component={Profile}
          default
          path={withPrefix("/signalProviders/:providerId")}
          providerId={providerId}
        />
        {allowAdminRoutes && (
          <SignalProviderRoute
            component={Edit}
            path={withPrefix("/signalProviders/:providerId/edit")}
            providerId={providerId}
          />
        )}
        {!provider.disable && provider.exchangeInternalId === selectedExchange.internalId && (
          <SignalProviderRoute
            component={Settings}
            path={withPrefix("/signalProviders/:providerId/settings")}
            providerId={providerId}
          />
        )}
        <SignalProviderRoute
          component={Analytics}
          path={withPrefix("/signalProviders/:providerId/analytics")}
          providerId={providerId}
        />
        {allowAdminRoutes && (
          <SignalProviderRoute
            component={Users}
            path={withPrefix("/signalProviders/:providerId/users")}
            providerId={providerId}
          />
        )}
        <SignalProviderRoute
          component={News}
          path={withPrefix("/signalProviders/:providerId/feed")}
          providerId={providerId}
        />
      </Router>
    </ProviderLayout>
  );
};

export default SignalProviders;
