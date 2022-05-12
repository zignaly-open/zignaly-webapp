import styled from "styled-components";
import { PriceLabel } from "zignaly-ui";

export const Layout = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Box = styled.div`
  min-width: 446px;
  border-radius: 5px;
  background: ${({ theme }) => theme.neutral750};
  border: 1px solid ${({ theme }) => theme.neutral600};
  box-shadow: inset 0px 0px 0px 1px ${({ theme }) => theme.neutral600};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const Funds = styled.div`
  h3 {
    font-weight: 500;
    font-size: 26px !important;
    line-height: 40px !important;
    color: #f3f4f6;
    justify-content: center;
    margin-top: 16px;

    > span:nth-of-type(2) {
      font-size: 15px;
      color: ${({ theme }) => theme.highlighted};
    }
  }
`;

export const HorizontalConnection = styled.div`
  display: flex;
  align-self: center;
  border: 1px dashed ${({ theme }) => theme.neutral600};
  position: absolute;
  width: 100%;
`;

export const MiddleContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;
