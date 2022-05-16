// Dependencies
import React, { useCallback, useEffect, useMemo } from "react";
import { useSpring, config } from "react-spring";

// Hooks
import { useDispatch, useSelector } from "react-redux";

// Modals
import ErrorModal from "../id/ErrorModal";
import DepositModal from "../id/DepositModal";

// Selectors
import { getCurrentModal } from "lib/store/selectors/ui";
import WithdrawModal from "../id/WithdrawModal";
import { closeModal } from "lib/store/actions/ui";
import TransferModal from "../id/TransferModal";

function SuperModal() {
  // Context
  const currentModal = useSelector(getCurrentModal);

  const dispatch = useDispatch();
  const open = Boolean(currentModal.id);

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, []);

  // Animation
  const [styles, api] = useSpring(() => ({
    opacity: 0,
    visibility: "hidden",
  }));

  const renderModal = useMemo(() => {
    switch (currentModal.id) {
      case "ERROR_MODAL":
        return (
          <ErrorModal
            action={currentModal.data.action}
            description={currentModal.data.description}
            title={currentModal.data.title}
          />
        );
      case "DEPOSIT_MODAL":
        return (
          <DepositModal
            initialCoin={currentModal.data.initialCoin}
            onClose={handleClose}
            open={open}
          />
        );
      case "WITHDRAW_MODAL":
        return (
          <WithdrawModal
            initialCoin={currentModal.data.initialCoin}
            onClose={handleClose}
            open={open}
          />
        );
      case "TRANSFER_MODAL":
        return <TransferModal onClose={handleClose} open={open} />;

      default:
        return null;
    }
  }, [currentModal]);

  useEffect(() => {
    if (currentModal.id) {
      // @ts-ignore
      api.start({
        opacity: 1,
        visibility: "visible",
        transform: "scale(1)",
        config: config.stiff,
      });
    } else {
      // @ts-ignore
      api.start({
        opacity: 0,
        transform: "scale(0.9)",
        visibility: "hidden",
        config: config.stiff,
      });
    }
  }, [currentModal.id]);

  return renderModal;
}

export default SuperModal;
