import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import { activateSubAccount } from "../store/actions/user";
import tradeApi from "services/tradeApiClient";

/**
 * @typedef {import("services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * Hook to activate subaccount if needed
 * @param {ExchangeConnectionEntity} account Zignaly account
 * @param {function} [callback] Callback
 * @returns {void}
 */
const useActivateSubAccount = (account, callback) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (account && !account.activated) {
      tradeApi
        .activateSubaccount({ internalExchangeId: account.internalId })
        .then(() => {
          dispatch(activateSubAccount(account.internalId));
          if (callback) {
            callback();
          }
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  }, []);
};

export default useActivateSubAccount;
