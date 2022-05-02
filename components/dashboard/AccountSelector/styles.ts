import { props } from "cypress/types/bluebird";
import styled, { css } from "styled-components";
import { Typography, IconButton, TextButton } from "zignaly-ui";

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
`;

export const Selector = styled(IconButton)`
  margin-left: 18px;
`;

export const AccountsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 20px;

  button {
  }
`;

export const AccountSelectButton = styled(TextButton)<{ selected: boolean }>`
  > div {
    justify-content: flex-start;
    width: 100%;
    padding: 10px 35px !important;
    color: ${(props) =>
      props.selected ? props.theme.highlighted : props.theme.neutral200} !important;
  }
`;
