import styled from "styled-components";
import { PriceLabel, Typography } from "zignaly-ui";

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
  padding: 24px 44px;
  text-align: center;

  h2 {
    margin-bottom: 8px;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
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

export const TopConnector = styled.div`
  border: 1px dashed ${({ theme }) => theme.neutral600};
  height: 32px;
`;

export const TopHorizontalConnection = styled.div`
  border: 2px dashed ${({ theme }) => theme.neutral600};
  border-bottom: none;
  height: 32px;
  width: 740px;
  border-radius: 5px;
`;

export const HorizontalConnection = styled.div`
  display: flex;
  align-self: center;
  border: 1px dashed ${({ theme }) => theme.neutral600};
  flex: 1;
`;

export const MiddleContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const TransferButtonContainer = styled.div`
  background: #000000;
`;

export const InlinePriceLabel = styled(PriceLabel)`
  display: inline-block;
`;

export const LabelHardDisc = styled(Typography)`
  margin: 34px 0 16px;
`;

export const TradingFunds = styled.div`
  margin-top: 42px;
  display: flex;
  flex-direction: column;

  > span:not(:first-of-type) {
    margin-top: 12px;
  }

  span > span:nth-of-type(1) {
    color: ${({ theme }) => theme.neutral100};
    margin-left: 16px;
  }
`;
