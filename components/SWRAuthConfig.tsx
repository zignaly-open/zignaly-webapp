import { SWRConfig } from "swr";
import { endTradeApiSession } from "../src/store/actions/session";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { localStorageProvider } from "lib/cache";

const SWRAuthConfig = ({ children }) => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const router = useRouter();

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

          const res = await fetch(url, options);
          if (!res.ok) {
            if (res.status === 401) {
              dispatch(endTradeApiSession());
              console.log("401 caught, redir to login");
              router.push({
                pathname: "/login",
                query: { returnUrl: router.asPath },
              });
            } else {
              throw Error(res.statusText);
            }
          }
          return res.json();
          // res.ok ? res.json() : Promise.reject(res)
        },
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRAuthConfig;
