import {
  DefaultProviderGetObject,
  ExchangeAssetsDict,
  ExchangeContractsObject,
  ExchangeDepositAddress,
  ExchangeOpenOrdersObject,
  ProviderEntity,
  UserEntity,
} from "services/tradeApiClient.types";
import useSWR, { SWRConfiguration, SWRResponse, useSWRConfig } from "swr";

/**
 * Check that all arguments are valid
 */
const valid = (...args): boolean => {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === null || args[i] === undefined) {
      return false;
    }
  }
  return true;
};

const baseUrl = process.env.NEXT_PUBLIC_TRADEAPI_URL;

/**
 *  Call useSWR hook with custom options. Automatically set baseUrl and don't query if empty params are passed.
 */
export const useAPIFetch = <Data = any, Error = any>(
  path: string,
  // name?: string,
  options?: SWRConfiguration,
): SWRResponse<Data, Error> => {
  const url = path ? baseUrl + path : null;
  return useSWR(url, options);
};

const useAPI = () => {
  const { fetcher }: { fetcher?: any } = useSWRConfig();

  const login = (payload: LoginReq): Promise<LoginRes> => {
    return fetcher(baseUrl + "/login", { body: payload, headers: { Authorization: null } });
  };

  const verify2FA = (payload: Verify2FAReq): Promise<{}> => {
    const { token, ...data } = payload;
    return fetcher(baseUrl + "/user/verify_2fa", {
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const getSession = (token?: string): Promise<GetSessionRes> => {
    return fetcher(baseUrl + "/user/session", {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
  };

  const getUserData = (token?: string): Promise<UserEntity> => {
    return fetcher(baseUrl + "/user", {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
  };

  return { fetcher, login, verify2FA, getSession, getUserData };
};
export default useAPI;

export const useSessionData = (options?: SWRConfiguration) => {
  return useAPIFetch<GetSessionRes>("/user/session", options);
};

export const useServicePositions = (providerId: string) => {
  const path = `/user/providers/${providerId}/positions`;
  const res = useAPIFetch(path);
  const positions = res.data ? Object.keys(res.data).map((k) => res.data[k][0]) : res.data;
  return {
    ...res,
    data: positions as Position[],
  };
};

export const useExchangeAssets = (exchangeInternalId: string, reduced: boolean) => {
  const path = exchangeInternalId
    ? `/user/exchanges/${exchangeInternalId}/assets?${reduced ? "view=reduced" : ""}`
    : null;
  return useAPIFetch<ExchangeAssetsDict>(path);
};

export const useInvestors = (providerId: string) => {
  const path = `/providers/${providerId}/investors`;
  return useAPIFetch<InvestorsRes[]>(path);
};

export const useContracts = (exchangeInternalId: string, providerId: string) => {
  const path = `/user/exchanges/${exchangeInternalId}/providers/${providerId}/contracts`;
  return useAPIFetch<ExchangeContractsObject[]>(path);
};

export const useServiceOrders = (exchangeInternalId: string, providerId: string) => {
  const path = `/user/exchanges/${exchangeInternalId}/providers/${providerId}/orders/open`;
  return useAPIFetch<ExchangeOpenOrdersObject[]>(path);
};

export const useUserServices = (timeFrame: number = 7) => {
  const path = `/providers/user_services/${timeFrame}`;
  return useAPIFetch<ProviderEntity[]>(path);
};

export const useUserService = (exchangeInternalId: string, providerId: string) => {
  const path = `/user/providers/${providerId}?${new URLSearchParams({ exchangeInternalId })}`;
  return useAPIFetch<DefaultProviderGetObject>(path);
};

export const useExchangeDepositAddress = (
  exchangeInternalId: string,
  coin: string,
  network: string,
) => {
  const path = valid(exchangeInternalId, coin, network)
    ? `/user/exchanges/${exchangeInternalId}/deposit_address/${coin}?${new URLSearchParams({
        network,
      })}`
    : null;
  return useAPIFetch<ExchangeDepositAddress>(path);
};
