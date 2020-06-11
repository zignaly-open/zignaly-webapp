import React, { useState } from "react";
import Modal from "../Modal";
import useLocationHash from "../../hooks/useLocationHash";
import { navigate } from "@reach/router";

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
 *
 * @param {DefaultProps} props
 */

const GlobalModal = (props) => {
  const { hash, content } = props;
  const currentHash = useLocationHash();
  const isOpen = currentHash === hash;
  const onClose = () => {
    navigate("#");
  };

  return (
    <Modal onClose={onClose} persist={false} size="fullscreen" state={isOpen}>
      {content({ onClose })}
    </Modal>
  );
};

export default GlobalModal;
