import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useSelectedExchange from "hooks/useSelectedExchange";
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
  const selectedExchange = useSelectedExchange();
  const [ownCopyTraderProviders, setOwnCopyTradersProviders] = useState([]);
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const loadOwnCopyTradersProviders = () => {
    const payload = {
      internalExchangeId: exchangeInternalId || selectedExchange.internalId,
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

  useEffect(loadOwnCopyTradersProviders, [selectedExchange.internalId]);

  return { ownCopyTraderProviders, loading };
};

export default useOwnCopyTraderProviders;
