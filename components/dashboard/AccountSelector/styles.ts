import styled from "styled-components";
import { Typography, Select } from "zignaly-ui";

export const Layout = styled.div`
  height: 56px;
  margin-bottom: 88px;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    width: 230px;
    text-decoration: none;
  }
`;

export const InfoBox = styled.div`
  margin-left: 22px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const TypographyType = styled(Typography).attrs({ variant: "h4" })`
  display: flex;

  /* &:first-child {
    color: #9ca3af;
  } */
`;

export const Selector = styled(Select)`
  margin-left: 18px;
  position: absolute;
`;

export const SelectorContainer = styled.div``;
