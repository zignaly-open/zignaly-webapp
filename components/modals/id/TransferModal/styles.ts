// Dependencies
import styled from "styled-components";
import { Typography } from "zignaly-ui";
import { PriceLabel } from "zignaly-ui";
import { Body as ModalBody, Desc as ModalDesc } from "../styles";

export const Body = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Desc = styled(ModalDesc)`
  margin-bottom: 24px;
  display: block;
`;

export const ToContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;

export const ToOutline = styled.div`
  background: ${({ theme }) => theme.neutral750};
  width: 510px;
  height: 132px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 16px;
  row-gap: 16px;
  margin-bottom: 12px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(312.12deg, #8671f7 14.16%, #7ec9f9 83.59%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
`;

export const ToValue = styled.div`
  font-weight: 500;
  font-size: 26px;
  line-height: 40px;
  color: ${({ theme }) => theme.neutral100};

  span {
    padding-left: 8px;
  }
`;

export const Actions = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

export const MainPriceLabel = styled(PriceLabel)`
  > span {
    font-weight: 500;
    font-size: 26px !important;
    line-height: 40px !important;
    color: #f3f4f6;
    justify-content: center;
    margin-top: 16px;

    > span:nth-of-type(1) {
      font-weight: 500 !important;
      font-size: 26px !important;
    }

    > span:nth-of-type(2) {
      font-size: 15px;
      color: ${({ theme }) => theme.highlighted};
    }
  }
`;

export const TypographyBalance = styled(Typography)`
  margin-left: 4px;
  font-weight: 600;
`;
