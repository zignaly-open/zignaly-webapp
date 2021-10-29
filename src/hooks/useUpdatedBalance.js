import { useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useInterval from "./useInterval";
import useSelectedExchange from "hooks/useSelectedExchange";
// import { createEmptyUserBalanceEntity } from "../services/tradeApiClient.types";

/**
 * @typedef {import("../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 */

/**
 * Load periodically balance in context
 *
 * @param {import("context/PrivateAreaContext").PrivateAreaContextObject} context
 * @returns {void}
 */
const useUpdatedBalance = (context) => {
  // const [balance, setBalance] = useState(createEmptyUserBalanceEntity());
  const { setBalance, setWalletBalance } = context;
  const selectedExchange = useSelectedExchange();

  const loadData = () => {
    if (selectedExchange.internalId) {
      tradeApi
        .userBalanceGet({
          exchangeInternalId: selectedExchange.internalId,
        })
        .then((data) => {
          setBalance(data);
        });

      // tradeApi.getWalletBalance().then((response) => {
      //   setWalletBalance(response);
      // });
    }
  };

  useEffect(loadData, [selectedExchange.internalId]);
  useInterval(loadData, 60000, true);
};

export default useUpdatedBalance;
