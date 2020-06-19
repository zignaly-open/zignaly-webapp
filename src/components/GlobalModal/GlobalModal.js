import React from "react";
import Modal from "../Modal";
import { navigate } from "@reach/router";

/**
 * @typedef {Object} DefaultProps
 * @property {String} hash Hash that opens the modal.
 * @property {function} content Component to display inside the modal.
 */

/**
 * Provides a modal that opens when the current url has the passed hash.
 * @param {DefaultProps} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GlobalModal = (props) => {
  const { hash, content } = props;
  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";
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
