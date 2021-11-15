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

  // const [updatedAt, setUpdatedAt] = useState(null);
  // const refreshBalance = () => {
  //   setUpdatedAt(new Date());
  // };

  const loadExchangeBalance = () => {
    if (selectedExchange.internalId) {
      tradeApi
        .userBalanceGet({
          exchangeInternalId: selectedExchange.internalId,
        })
        .then((data) => {
          setBalance(data);
        });
    }
  };
  useEffect(loadExchangeBalance, [selectedExchange.internalId]);

  const loadWalletBalance = () => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  };
  useEffect(loadWalletBalance, []);

  // Update both balances every 60s
  useInterval(
    () => {
      loadExchangeBalance();
      loadWalletBalance();
    },
    60000,
    false,
  );
};

export default useUpdatedBalance;
