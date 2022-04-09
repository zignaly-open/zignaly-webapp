import { SWRConfig } from "swr";
import { endTradeApiSession } from "../src/store/actions/session";
import useStoreSessionSelector from "../src/hooks/useStoreSessionSelector";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

const SWRAuthConfig = ({ children }) => {
  const storeSession = useStoreSessionSelector();
  const token = storeSession.tradeApi.accessToken;
  const dispatch = useDispatch();
  const router = useRouter();

  console.log("SWRAuthConfig1", token, new Date());

  return (
    <SWRConfig
      value={{
        fetcher: async (url, options) => {
          console.log("SWRAuthConfig2", token, new Date(), url);

          const o = {
            method: options?.body ? "POST" : "GET",
            ...options,
            ...(options?.body && { body: JSON.stringify(options.body) }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-API-KEY": process.env.NEXT_PUBLIC_KEY || "",
              ...options?.headers,
            },
          };

          // Remove authorization key when not needed
          if (options?.headers?.Authorization === null) {
            delete o.headers.Authorization;
          }

          const res = await fetch(url, o);
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
