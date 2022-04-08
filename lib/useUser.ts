import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedExchange } from "src/store/actions/settings";
import { UserEntity } from "../src/services/tradeApiClient.types";
import { useAPIFetch } from "./useAPI";

const useUser = () => {
  const { data: user, mutate, error } = useAPIFetch<UserEntity>("/user");
  // const loading = !user && !error ? true : false;
  const dispatch = useDispatch();
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);
  const selectedExchange = user?.exchanges.find((e) => e.internalId === selectedExchangeId);

  // Init selected exchange
  useEffect(() => {
    let newSelectedExchangeId = null;
    if (user?.exchanges.length) {
      if (selectedExchange) {
        // Use last saved selected exchange
        newSelectedExchangeId = selectedExchangeId;
      } else {
        // If no exchange account saved, use the first one
        newSelectedExchangeId = user.exchanges[0].internalId;
      }
    }
    dispatch(setSelectedExchange(newSelectedExchangeId));
  }, [user]);

  return {
    // loading,
    selectedExchange,
    user,
    mutate,
  };
};

export default useUser;
