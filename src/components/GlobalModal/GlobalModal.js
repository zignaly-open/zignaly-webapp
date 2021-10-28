import React, { useEffect } from "react";
import Modal from "../Modal";
import { navigate } from "@reach/router";
import { showGlobalModal } from "../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {Object} DefaultProps
 * @property {String} hash Hash that opens the modal.
 * @property {function} content Component to display inside the modal.
 * @property {boolean} [newTheme]
 * @property {boolean} [showCloseIcon]
 */

/**
 * Provides a modal that opens when the current url has the passed hash.
 * @param {DefaultProps} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GlobalModal = (props) => {
  const { hash, content, newTheme, showCloseIcon = false } = props;
  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";
  const isOpen = currentHash.startsWith(hash);
  const dispatch = useDispatch();

  const onClose = () => {
    navigate("#");
    dispatch(showGlobalModal(false));
  };

  useEffect(() => {
    if (isOpen) {
      // Store open state in redux so we can pause interval requests
      dispatch(showGlobalModal(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      onClose={onClose}
      persist={false}
      showCloseIcon={showCloseIcon}
      size="fullscreen"
      state={isOpen}
      newTheme={newTheme}
    >
      {content({ onClose })}
    </Modal>
  );
};

export default GlobalModal;
