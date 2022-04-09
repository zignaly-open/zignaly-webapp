import styled from "styled-components";
import { Typography } from "zignaly-ui";

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

  h1 {
    font-weight: 500;
    font-size: 22px;
    line-height: 36px;
  }
`;

export const TypographyType = styled(Typography).attrs({ variant: "h4" })`
  &:first-child {
    color: #9ca3af;
  }
`;
