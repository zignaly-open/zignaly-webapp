// Dependencies
import styled from "styled-components";
import {animated} from "react-spring";
import { isConditional } from "../../../utils/styled-components";

type BackDropTypeProps = {
  visible: boolean;
  isFirefox: boolean;
}
export const Backdrop = styled.div<BackDropTypeProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  backdrop-filter: blur(12px);
  display: flex;
  padding: 22px;
  justify-content: center;
  align-items: center;
  transition: all 150ms linear;
  white-space: initial;
  background: rgba(0, 0, 0, 0.3);

  ${({ visible, isFirefox }) => `
    visibility: ${visible ? "visible" : "hidden"};
    opacity: ${visible ? "1" : "0"};

    ${isConditional(isFirefox, `
      background: rgba(0, 0, 0, 0.7);
    `)}
  `}
`;

type AnimationTypeProps = {
  style?: any;
}
export const Animation = styled(animated.div)<AnimationTypeProps>``;
