import { UserLoginPayload, LoginResponse } from "services/tradeApiClient";
import { TwoFAPayload } from "services/tradeApiClient.types";
import useSWR, { SWRHook, SWRResponse, useSWRConfig } from "swr";
// import { useEffect } from "react";
// import Router from "next/router";
// import useSWR from "swr";
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
  name?: string,
): SWRResponse<Data, Error> => {
  if (!path) {
    throw new Error("Path is required");
  }

  const url = name ? baseUrl + path + "/" + name : baseUrl + path;
  return useSWR(url);
};

const useAPI = () => {
  const { fetcher }: { fetcher?: any } = useSWRConfig();

  const login = (payload: UserLoginPayload): Promise<LoginResponse> => {
    return fetcher(baseUrl + "/login", { body: payload, headers: { Authorization: null } });
  };

  const verify2FA = (payload: TwoFAPayload): Promise<Boolean> => {
    return fetcher(baseUrl + "/user/verify_2fa", {
      body: payload,
      headers: { Authorization: `Bearer ${payload.token}` },
    });
  };

  return { fetcher, login, verify2FA };
};
export default useAPI;

export const useGetServicePositions = (providerId: string) => {
  const path = `/user/providers/${providerId}/positions`;
  const res = useAPIFetch(path);
  return {
    ...res,
    data: res.data ? Object.keys(res.data).map((k) => res.data[k][0]) : (res.data as Position[]),
  };
};

export const test = (providerId: string) => {
  // const path = `/user/providers/${providerId}/positions`;
  // return useAPIFetch<Position[]>(path);
};
