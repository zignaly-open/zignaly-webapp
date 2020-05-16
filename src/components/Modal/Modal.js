import React from "react";
import "./Modal.scss";
import { Dialog } from "@material-ui/core";

const GenericModal = props => {
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
