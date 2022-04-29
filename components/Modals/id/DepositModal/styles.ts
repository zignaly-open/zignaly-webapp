// Dependencies
import styled from "styled-components";
import QRCodeLib from "qrcode.react";

import { Body as ModalBody } from "../styles";

export const SelectCoinContainer = styled.div`
  display: flex;
`;

export const Balances = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  margin-left: 48px;

  > span > span {
    color: ${(props) => props.theme.neutral000};
  }
`;

export const Body = styled(ModalBody)`
  > div {
    margin-top: 24px;
  }
`;

export const QRCodeContainer = styled.div`
  margin: 98px auto 0 !important;
  display: flex;
  background: ${({ theme }) => theme.neutral000};
  justify-content: center;
  width: 200px;
  height: 200px;
  align-items: center;
`;

export const NotSure = styled.a`
  margin-left: 17px;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
`;
