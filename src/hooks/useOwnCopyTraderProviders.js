import { useState, useEffect } from "react";
import useStoreSessionSelector from "./useStoreSessionSelector";
import tradeApi from "../services/tradeApiClient";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";

/**
 * @typedef {import("services/tradeApiClient.types").CopyTradersProvidersOption} CopyTradersProvidersOption
 */

/**
 * @typedef {Object} HookData
 * @property {Array<CopyTradersProvidersOption>} ownCopyTraderProviders
 * @property {Boolean} loading
 */

/**
 * Provides list of copy trader providers.
 *
 * @param {string} [exchangeInternalId] exchangeInternalId
 * @returns {HookData} Balance.
 */
const useOwnCopyTraderProviders = (exchangeInternalId) => {
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const [ownCopyTraderProviders, setOwnCopyTradersProviders] = useState([]);
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const loadOwnCopyTradersProviders = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: exchangeInternalId || storeSettings.selectedExchange.internalId,
    };

    setLoading(true);
    tradeApi
      .ownedCopyTradersProvidersOptions(payload)
      .then((data) => {
        if (Array.isArray(data)) {
          // Digest providers data to handle translation.
          const digestedProviders = data.map((provider) => {
            if (provider.providerId === 1) {
              return {
                ...provider,
                providerName: formatMessage({ id: "terminal.provider.manual" }),
              };
            }

            return provider;
          });

          setOwnCopyTradersProviders(digestedProviders);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(loadOwnCopyTradersProviders, [
    storeSettings.selectedExchange.internalId,
    storeSession.tradeApi.accessToken,
  ]);

  return { ownCopyTraderProviders, loading };
};

export default useOwnCopyTraderProviders;
