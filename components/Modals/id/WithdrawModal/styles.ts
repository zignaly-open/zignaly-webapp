// Dependencies
import styled from "styled-components";
import { Typography } from "zignaly-ui";
import { Body as _Body } from "../styles";

export const Desc = styled(Typography)`
  padding: 12px 0 16px;
`;

export const Body = styled(_Body)`
  > div {
    margin-top: 24px;
  }
`;
