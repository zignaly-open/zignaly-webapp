import { useSelector } from "react-redux";
import useSWR from "swr";
import { UserEntity } from "../../src/services/tradeApiClient.types";
import { keys, cache, setItemCache } from "lib/cacheAPI";

const useUser = () => {
  const initialData = cache.get(keys.user);
  const {
    data: user,
    mutate,
    error,
  } = useSWR<UserEntity>(keys.user, {
    // Don't fetch updated data right away if the data has just been loaded in login (_validated)
    revalidateOnMount: initialData?._validated !== true,
    // revalidateIfStale: false,
    onSuccess(newUser) {
      setItemCache(keys.user, newUser);
    },
  });
  // const loading = !user && !error ? true : false;
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);
  const selectedExchange = user?.exchanges.find((e) => e.internalId === selectedExchangeId);

  return {
    selectedExchange,
    user,
    mutate,
  };
};

export default useUser;
