import React, { useState } from "react";
import "./SyncBalanceButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import SyncIcon from "@material-ui/icons/Sync";
import { getDailyUserBalance } from "store/actions/user";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} selectedExchange
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const SyncBalanceButton = ({ selectedExchange }) => {
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const syncBalance = () => {
    if (selectedExchange.internalId) {
      setLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        exchangeInternalId: selectedExchange.internalId,
        force: true,
      };

      tradeApi
        .userBalanceGet(payload)
        .then(() => {
          const historicalPayload = {
            token: storeSession.tradeApi.accessToken,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getDailyUserBalance(historicalPayload));
          dispatch(showSuccessAlert("", "dashboard.balance.sync.alert"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box
      alignItems="center"
      className="syncBalanceButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <CustomButton className="textPurple" loading={loading} onClick={syncBalance}>
        <SyncIcon className="icon" />
        <FormattedMessage id="dashboard.balance.sync" />
      </CustomButton>
    </Box>
  );
};

export default SyncBalanceButton;
