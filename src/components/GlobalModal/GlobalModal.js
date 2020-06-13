import React from "react";
import Modal from "../Modal";
import { navigate } from "@reach/router";

/**
 * @typedef {Object} DefaultProps
 * @property {String} hash Hash that opens the modal.
 * @property {function} content Component to display inside the modal.
 */

/**
 *
 * @param {DefaultProps} props
 */

const GlobalModal = (props) => {
  const { hash, content } = props;
  const currentHash = window.location.hash ? window.location.hash.substr(1) : "";
  const isOpen = currentHash === hash;
  const onClose = () => {
    navigate("#");
  };

  return (
    <Modal
      onClose={onClose}
      persist={true}
      size="fullscreen"
      state={isOpen}
      //   keepMounted={true}
    >
      {content({ onClose })}
    </Modal>
  );
};

export default GlobalModal;
