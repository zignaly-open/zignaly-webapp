import React from "react";
import { SWRConfig } from "swr";
import { endTradeApiSession } from "../src/store/actions/session";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { localStorageProvider } from "lib/cacheAPI";
import useRedirection from "lib/hooks/useRedirection";

const SWRAuthConfig = ({ children }) => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const router = useRouter();
  const { redirectLogin } = useRedirection();

  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        revalidateOnFocus: false,
        fetcher: async (url, customOptions) => {
          const options = {
            method: customOptions?.body ? "POST" : "GET",
            ...customOptions,
            ...(customOptions?.body && { body: JSON.stringify(customOptions.body) }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-API-KEY": process.env.NEXT_PUBLIC_KEY || "",
              ...customOptions?.headers,
            },
          };

          // Remove authorization key when not needed
          if (customOptions?.headers?.Authorization === null) {
            delete options.headers.Authorization;
          }

          let error;
          let json;
          try {
            const res = await fetch(url, options);
            json = await res.json();
            if (!res.ok) {
              error = json;
            }
          } catch (e) {
            error = e.message;
          }

          if (error) {
            if (error.error?.code === 13) {
              console.log("api session expired, redirecting to login");
              dispatch(endTradeApiSession());
              redirectLogin(true);
            }

            throw error;
          }

          return json;
          // res.ok ? res.json() : Promise.reject(res)
        },
        // onError: (err) => {
        //   console.error(err);
        // },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRAuthConfig;
