import React from "react";
import { FormattedMessage } from "react-intl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { noop } from "lodash";

/**
 * @typedef {Object} ConfirmDialogConfig
 * @property {string} titleTranslationId
 * @property {string} messageTranslationId
 * @property {boolean} visible
 * @property {Object<string, React.ReactNode>} [values]
 */

/**
 * @typedef {Object} ConfirmDialogProps
 * @property {Function} setConfirmConfig Set state callback to control dialog configuration.
 * @property {ConfirmDialogConfig} confirmConfig Current dialog configuration.
 * @property {Function} executeActionCallback Callback to execute when the action is confirmed.
 * @property {Function} [executeCancelCallback] Callback to execute when the action is cancelled.
 * @property {Boolean} [showCancel]
 */

/**
 * Ask for confirmation prior to perform an action callback.
 *
 * @param {ConfirmDialogProps} props Component properties.
 * @returns {JSX.Element} Confirm dialog element.
 */
const ConfirmDialog = (props) => {
  const {
    setConfirmConfig,
    confirmConfig,
    executeActionCallback = noop,
    executeCancelCallback = noop,
    showCancel = true,
  } = props;

  const handleClose = () => {
    setConfirmConfig({
      ...confirmConfig,
      visible: false,
    });
  };

  const triggerCancelCallback = () => {
    handleClose();
    executeCancelCallback();
  };

  const triggerActionCallback = () => {
    handleClose();
    executeActionCallback();
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={confirmConfig.visible}>
        {confirmConfig.messageTranslationId && (
          <DialogTitle>
            <FormattedMessage id={confirmConfig.titleTranslationId} />
          </DialogTitle>
        )}
        <DialogContent>
          <DialogContentText color="textPrimary">
            <FormattedMessage
              id={confirmConfig.messageTranslationId}
              values={confirmConfig.values}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {showCancel && (
            <Button autoFocus color="secondary" onClick={triggerCancelCallback}>
              <FormattedMessage id="confirm.cancel" />
            </Button>
          )}
          <Button color="secondary" onClick={triggerActionCallback}>
            <FormattedMessage id="confirm.accept" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { ConfirmDialog };
