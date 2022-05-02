// Dependencies
import React, { useEffect, useMemo } from "react";
import { useSpring, config } from "react-spring";
import { isFirefox } from "react-device-detect";
import { CloseIcon, IconButton } from "zignaly-ui";

// Styled Components
import { Backdrop, Animation } from "./styles";
import { Body, CloseButton, ModalContainer, Title } from "../id/styles";
import useEventListener from "lib/hooks/useEventListener";

function Modal({ title, onClose, open, width, children }) {
  // Animation
  const [styles, api] = useSpring(() => ({
    opacity: 0,
    visibility: "hidden",
  }));

  // const handleKeyDown = (event) => {
  //   // Escape
  //   if (event.keyCode === 27) {
  //     onClose();
  //   }
  // };
  // useEventListener("keydown", handleKeyDown);

  useEffect(() => {
    if (open) {
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
  }, [open]);

  return (
    <Backdrop isFirefox={isFirefox} visible={open}>
      <Animation style={styles}>
        <ModalContainer width={width}>
          <Title>
            {title && title}
            <CloseButton icon={CloseIcon} onClick={onClose} />
          </Title>
          <Body>{children}</Body>
        </ModalContainer>
      </Animation>
    </Backdrop>
  );
}

export default Modal;
