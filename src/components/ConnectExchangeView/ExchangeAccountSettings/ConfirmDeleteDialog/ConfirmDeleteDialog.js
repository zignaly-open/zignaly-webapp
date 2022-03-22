import React, { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ModalPathContext from "../../ModalPathContext";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import { showErrorAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { getUserData, removeUserExchange } from "../../../../store/actions/user";
import { setSelectedExchange } from "../../../../store/actions/settings";
import CustomButton from "../../../CustomButton";

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
  const storeSettings = useStoreSettingsSelector();
  const storeExchanegeConnections = useStoreUserExchangeConnections();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteExchange = () => {
    setLoading(true);
    setPathParams((state) => ({ ...state, isLoading: true }));

    tradeApi
      .exchangeDelete(selectedAccount.internalId)
      .then(() => {
        dispatch(removeUserExchange(selectedAccount.internalId));
        if (storeSettings.selectedExchangeId === selectedAccount.internalId) {
          // Current selected exchange has been deleted so reset to first one
          const newSelectedExchange = storeExchanegeConnections.find(
            (e) => e.internalId !== selectedAccount.internalId,
          );
          dispatch(
            setSelectedExchange(newSelectedExchange ? newSelectedExchange.internalId : null),
          );
        }
        setPathParams({
          tempMessage: <FormattedMessage id={"accounts.deleted"} />,
          currentPath: previousPath,
        });
        onClose();
        dispatch(getUserData());
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>
        <FormattedMessage id="confirm.deleteexchange.title" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="textPrimary">
          <FormattedMessage id="confirm.deleteexchange.message" />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose()}>
          <FormattedMessage id="confirm.cancel" />
        </Button>
        <CustomButton className="textPurple" disabled={loading} onClick={deleteExchange}>
          <FormattedMessage id="confirm.delete" />
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
