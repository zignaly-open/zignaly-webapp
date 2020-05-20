import React from "react";
import "./Modal.scss";
import { Dialog } from "@material-ui/core";

/**
 *
 * @typedef {import('@material-ui/core/Dialog').DialogProps.onClose} CLoseFunction
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Boolean} state
 * @property {CLoseFunction} onClose
 * @property {Boolean} persist
 * @property {Object} children
 * @property {String} size
 */

/**
 *
 * @param {DefaultProps} props
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
      {children}
    </Dialog>
  );
};

export default GenericModal;
