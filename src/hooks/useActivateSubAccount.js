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
 * @returns {void}
 */
const useActivateSubAccount = (account) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!account.activated) {
      tradeApi
        .activateSubaccount({ internalExchangeId: account.internalId })
        .then(() => {
          dispatch(activateSubAccount(account.internalId));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  }, []);
};

export default useActivateSubAccount;
