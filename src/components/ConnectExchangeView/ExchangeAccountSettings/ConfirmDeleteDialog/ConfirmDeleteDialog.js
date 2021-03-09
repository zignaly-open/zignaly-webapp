import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ModalPathContext from "../../ModalPathContext";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import { showErrorAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { getUserData, removeUserExchange } from "../../../../store/actions/user";
import { setSelectedExchange } from "../../../../store/actions/settings";
import { CircularProgress, Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import initialState from "../../../../store/initialState";
import useConnectedProvidersLite from "hooks/useConnectedProvidersLite";
import useAvailableBalance from "hooks/useAvailableBalance";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 *
 * @typedef {Object} ConfirmDialogProps
 * @property {Function} onClose
 * @property {boolean} open
 */

/**
 * Ask for confirmation prior to deleting account.
 *
 * @param {ConfirmDialogProps} props Component properties.
 * @returns {JSX.Element} Confirm dialog element.
 */
const ConfirmDeleteDialog = ({ onClose, open }) => {
  const {
    pathParams: { selectedAccount, previousPath },
    setPathParams,
  } = useContext(ModalPathContext);
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const storeExchanegeConnections = useStoreUserExchangeConnections();
  const [positions, setPositions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { balance } = useAvailableBalance(selectedAccount);
  const { providers } = useConnectedProvidersLite(
    selectedAccount.internalId,
    ["profitSharing"],
    true,
  );
  const dispatch = useDispatch();

  const loadOpenPositions = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: selectedAccount.internalId,
    };

    tradeApi
      .openPositionsGet(payload)
      .then((response) => {
        setPositions(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  useEffect(loadOpenPositions, []);

  const deleteExchange = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalId: selectedAccount.internalId,
    };

    setPathParams((state) => ({ ...state, isLoading: true }));

    tradeApi
      .exchangeDelete(payload)
      .then(() => {
        dispatch(removeUserExchange(selectedAccount.internalId));
        if (storeSettings.selectedExchange.internalId === selectedAccount.internalId) {
          // Current selected exchange has been deleted so reset to first one
          const newSelectedExchange = storeExchanegeConnections.find(
            (e) => e.internalId !== selectedAccount.internalId,
          );
          dispatch(
            setSelectedExchange(
              newSelectedExchange ? newSelectedExchange : initialState.settings.selectedExchange,
            ),
          );
        }
        setPathParams({
          tempMessage: <FormattedMessage id={"accounts.deleted"} />,
          currentPath: previousPath,
        });
        onClose();
        dispatch(getUserData(storeSession.tradeApi.accessToken));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const brokerAccountWithFunds =
    selectedAccount.isBrokerAccount && balance && Object.values(balance).some((item) => item > 0);

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>
        <FormattedMessage id="confirm.deleteexchange.title" />
      </DialogTitle>
      {!balance || !positions ? (
        <Box display="flex" flexDirection="row" justifyContent="center" width={1}>
          <CircularProgress className="loader" />
        </Box>
      ) : (
        <DialogContent>
          <DialogContentText color="textPrimary">
            {brokerAccountWithFunds ? (
              <FormattedMessage id="confirm.deleteexchange.balance" />
            ) : positions.length ? (
              <FormattedMessage id="confirm.deleteexchange.openpos" />
            ) : providers.length ? (
              <FormattedMessage id="confirm.deleteexchange.profit" />
            ) : (
              <FormattedMessage id="confirm.deleteexchange.message" />
            )}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button autoFocus onClick={() => onClose()}>
          <FormattedMessage id="confirm.cancel" />
        </Button>
        <CustomButton
          className="textPurple"
          disabled={Boolean(
            !balance ||
              !positions ||
              brokerAccountWithFunds ||
              positions.length ||
              providers.length,
          )}
          loading={loading}
          onClick={deleteExchange}
        >
          <FormattedMessage id="confirm.delete" />
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
