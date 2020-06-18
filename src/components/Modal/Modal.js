import React from "react";
import "./Modal.scss";
import { Dialog } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

/**
 * @typedef {import('@material-ui/core/Dialog').DialogProps} DialogProps
 * @typedef {Object} DefaultProps
 * @property {Boolean} state
 * @property {DialogProps["onClose"]} onClose
 * @property {Boolean} persist
 * @property {Object} children
 * @property {String} size
 */

/**
 * Provides display of children elements in a modal.
 *
 * @param {DefaultProps} props Modal props.
 * @returns {JSX.Element} Modal element.
 */
const GenericModal = (props) => {
  const { state, onClose, persist, children, size } = props;

  return (
    <Dialog
      classes={{ paper: "modal " + (size ? size : " ") }}
      disableBackdropClick={persist}
      maxWidth="lg"
      onClose={onClose}
      open={state}
    >
      <CloseIcon className="closeIcon" onClick={onClose} />
      {children}
    </Dialog>
  );
};

export default GenericModal;
