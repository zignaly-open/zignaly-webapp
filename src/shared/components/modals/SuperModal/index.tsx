// Dependencies
import React, { useEffect, useMemo } from "react";
import { useSpring, config } from "react-spring";
import { isFirefox } from "react-device-detect";

// Hooks
import {useSelector} from "react-redux";

// Types
import { modalTypesId } from "../../../types/ui";

// Modals
import ErrorModal from "../id/ErrorModal";

// Styled Components
import { Backdrop, Animation } from "./styles";

// Selectors
import { getCurrentModal } from "../../../../store/selectors/ui";

function SuperModal() {
  // Context
  const currentModal = useSelector(getCurrentModal);

  // Animation
  const [styles, api] = useSpring(() => ({
    opacity: 0,
    visibility: "hidden"
  }));

  const renderModal = useMemo(() => {
    switch (currentModal.id) {
      case modalTypesId.ERROR_MODAL:
        return (
          <ErrorModal
            action={currentModal.data.action}
            description={currentModal.data.description}
            title={currentModal.data.title}
          />
        );

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
        config: config.stiff
      });
    } else {
      // @ts-ignore
      api.start({
        opacity: 0,
        transform: "scale(0.9)",
        visibility: "hidden",
        config: config.stiff
      });
    }
  }, [currentModal.id]);

  return (
    <Backdrop isFirefox={isFirefox} visible={!!currentModal.id}>
      <Animation style={styles}>
        {renderModal}
      </Animation>
    </Backdrop>
  );
}

export default SuperModal;
