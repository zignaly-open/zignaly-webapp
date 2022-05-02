// Dependencies
import styled from "styled-components";
import { IconButton, Typography } from "zignaly-ui";
import { ModalProps } from "../Modal";

const getWidth = (width: ModalProps["width"]): number => {
  switch (width) {
    case "large":
    default:
      return 824;
  }
};

type ModalContainerProps = {
  width: ModalProps["width"];
  padding?: string;
};
export const ModalContainer = styled.div<ModalContainerProps>`
  /* box-shadow: 0 12px 11px #0000000f; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: #101225;
  border: 1px solid #35334a;
  border-radius: 16px;

  ${({ width, padding }) => `
    width: ${getWidth(width)}px;
    padding: ${padding ?? "3rem"};
  `};
`;

export const Title = styled(Typography).attrs({ variant: "h1" })`
  color: #c1c1c8;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 32px;
`;

export const Desc = styled(Typography)`
  margin-bottom: 24px;
`;

type BodyTypeProps = {
  textAlign?: string;
};
export const Body = styled.div<BodyTypeProps>`
  text-align: ${(props) => props.textAlign ?? "start"};
  color: #a9a9ba;
  width: 100%;
`;

export const Actions = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: flex-end;

  button:not(:first-child) {
    margin-left: 7px;
  }
`;

export const CloseButton = styled(IconButton)`
  button > div > div,
  svg {
    color: #65647e;
    width: 32px !important;
    height: 32px !important;
  }
`;
