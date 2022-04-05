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

import useSWR, { useSWRConfig } from "swr";

const baseUrl = process.env.NEXT_PUBLIC_TRADEAPI_URL;

// export const login = (payload) => {
//   const path = "/login";
//   return fetcher(baseUrl + path, payload).then((res) => {
//     setToken(res.token);
//     return res;
//   });
// };

export const verify2FA = (payload) => {
  const path = "/user/verify_2fa";
  return fetcher(baseUrl + path, payload);
};

// const fetcher = (url, payload) => {
//   return fetch(url, {
//     method: payload ? "POST" : "GET",
//     ...(payload && { body: JSON.stringify(payload) }),
//     headers: {
//       "Content-Type": "application/json",
//       "X-API-KEY": process.env.NEXT_PUBLIC_KEY || "",
//       ...(getToken() && { Authorization: "Bearer " + getToken() }),
//     },
//   }).then((res) => res.json());
// };

export const fetcher = async (url: string, options: any) => {
  const res = await fetch(url, {
    method: options?.payload ? "POST" : "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-KEY": process.env.NEXT_PUBLIC_KEY || "",
      ...(options?.payload && { body: JSON.stringify(options.payload) }),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      console.log("401 caught");
      throw new Error(res.statusText);
    } else {
      throw Error(res.statusText);
    }
  }
  return res.json();
  // res.ok ? res.json() : Promise.reject(res)
};

export const useAPIFetch = (path: string, name?: string) => {
  if (!path) {
    throw new Error("Path is required");
  }

  const url = name ? baseUrl + path + "/" + name : baseUrl + path;
  const { data, error } = useSWR(url);

  return { data, error };
};

// export const useGetServicePositions = (providerId: string) => {
//   const path = `/user/providers/${providerId}/positions`;
//   const res = useAPIFetch(path);
//   return { ...res, data: res.data ? Object.keys(res.data).map((k) => res.data[k][0]) : res.data };
// };

const useFetchWrapper = () => {};
