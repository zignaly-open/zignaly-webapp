import {
  ExchangeAssetsDict,
  ExchangeContractsObject,
  ExchangeOpenOrdersObject,
  ProviderEntity,
  UserEntity,
} from "services/tradeApiClient.types";
import useSWR, { SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
// import { User } from "pages/api/user";

// export default function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
//   const { data: user, mutate: mutateUser } = useSWR<User>("/api/user");

//   useEffect(() => {
//     // if no redirect needed, just return (example: already on /dashboard)
//     // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
//     if (!redirectTo || !user) return;

//     if (
//       // If redirectTo is set, redirect if the user was not found.
//       (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
//       // If redirectIfFound is also set, redirect if the user was found
//       (redirectIfFound && user?.isLoggedIn)
//     ) {
//       Router.push(redirectTo);
//     }
//   }, [user, redirectIfFound, redirectTo]);

//   return { user, mutateUser };
// }

const baseUrl = process.env.NEXT_PUBLIC_TRADEAPI_URL;

export const useAPIFetch = <Data = any, Error = any>(
  path: string,
  // name?: string,
  options?: SWRConfiguration,
): SWRResponse<Data, Error> => {
  // const url = name ? baseUrl + path + "/" + name : baseUrl + path;
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

export const useExchangeAssets = (exchangeInternalId: string) => {
  const path = exchangeInternalId
    ? `/user/exchanges/${exchangeInternalId}/assets?view=reduced`
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
