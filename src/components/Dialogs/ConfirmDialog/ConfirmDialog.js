import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

/**
 * @typedef {Object} ConfirmDialogProps
 * @property {Function} setConfirmVisible Set state callback to control dialog visibility.
 * @property {boolean} confirmVisible Current visibility flag state.
 */

/**
 * Ask for confirmation prior to perform an action callback.
 *
 * @param {ConfirmDialogProps} props Component properties.
 * @returns {JSX.Element} Confirm dialog element.
 */
const ConfirmDialog = (props) => {
  const { setConfirmVisible, confirmVisible } = props;

  const handleClose = () => {
    setConfirmVisible(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={confirmVisible}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText color="textPrimary">
            Are you sure you want to cancel the position? Canceling the position means you will
            remove the position from Zignaly, keeping your current bought coins.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="secondary" onClick={handleClose}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { ConfirmDialog };
