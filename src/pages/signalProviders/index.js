import React, { useEffect, useState } from "react";
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
import { setProvider, unsetProvider } from "../../store/actions/views";
import { withPrefix } from "gatsby";
import ProviderLayout from "../../layouts/ProviderLayout";
import { ProviderRoute as SignalProviderRoute } from "../../components/RouteComponent/RouteComponent";
import BrowsePage from "./browse";
import tradeApi from "../../services/tradeApiClient";
import { showErrorAlert } from "store/actions/ui";
import useSelectedExchangeQuotes from "hooks/useSelectedExchangeQuotes";
import useProviderContext from "hooks/useProviderContext";
import ProviderContext from "components/Provider/ProviderContext";
import { checkAllocated } from "../../utils/helpers";

/**
 * @typedef {import("../../services/tradeApiClient.types").ProviderExchangeSettingsObject} ProviderExchangeSettingsObject
 * @typedef {import("../../services/tradeApiClient.types").QuoteAssetsDict} QuoteAssetsDict

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
  const providerContext = useProviderContext();
  const { setHasAllocated } = providerContext;
  const [settings, setSettings] = useState(null);
  const quoteAssets = useSelectedExchangeQuotes(selectedExchange.internalId);
  const quotes =
    selectedExchange.name.toLowerCase() === "bitmex"
      ? { BTC: { quote: "BTC", minNotional: 0 } }
      : quoteAssets;
  const quotesAvailable = Object.keys(quotes).length > 0;

  useEffect(() => {
    const loadProvider = async () => {
      dispatch(unsetProvider());
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: providerId,
        version: 2,
        exchangeInternalId: selectedExchange.internalId,
      };
      dispatch(setProvider(payload));
    };
    if (providerId && providerId.length === 24) {
      loadProvider();
    }

    return () => {
      setHasAllocated(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  /**
   * Load exchange settings from backend.
   *
   * @returns {void}
   */
  const loadSettings = () => {
    if (
      provider.id &&
      !provider.disable &&
      provider.exchangeInternalId === selectedExchange.internalId &&
      quotesAvailable
    ) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        internalExchangeId: selectedExchange.internalId,
        version: 2,
      };
      tradeApi
        .providerExchangeSettingsGet(payload)
        .then((response) => {
          setSettings(response);
          checkAllocated(quotes, response, setHasAllocated);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadSettings, [selectedExchange.internalId, provider.id, quotesAvailable]);

  if (!providerId) {
    // Render Browse page
    return <BrowsePage {...props} />;
  }

  const allowAdminRoutes = provider.isAdmin && !provider.isClone;

  return (
    <ProviderContext.Provider value={providerContext}>
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
              loadData={loadSettings}
              path={withPrefix("/signalProviders/:providerId/settings")}
              providerId={providerId}
              quotes={quotes}
              settings={settings}
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
    </ProviderContext.Provider>
  );
};

export default SignalProviders;
