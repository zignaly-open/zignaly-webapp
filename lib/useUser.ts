import { useSelector } from "react-redux";
import { mutate } from "swr";
import { UserEntity } from "../src/services/tradeApiClient.types";
import { useAPIFetch } from "./useAPI";
import { keys } from "lib/cache";

if (typeof window !== "undefined") {
  // Load user data from cache for faster page load
  const data = localStorage.getItem(keys.user);
  if (data) {
    mutate(`${process.env.NEXT_PUBLIC_TRADEAPI_URL}/user`, JSON.parse(data), false);
  }
}

const useUser = () => {
  // check if token
  const {
    data: user,
    mutate,
    error,
  } = useAPIFetch<UserEntity>("/user", {
    // onFailure() {
    //   localStorage.removeItem(key)
    // }
    onSuccess(user) {
      localStorage.setItem(keys.user, JSON.stringify(user));
    },
  });
  // const loading = !user && !error ? true : false;
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);
  const selectedExchange = user?.exchanges.find((e) => e.internalId === selectedExchangeId);

  return {
    // loading,
    selectedExchange,
    user,
    mutate,
  };
};

export default useUser;
