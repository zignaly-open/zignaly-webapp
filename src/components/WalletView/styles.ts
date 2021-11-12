import styled from "styled-components";
import { isMobile } from "styles/styles";

export const TitleIcon = styled.img`
  margin-right: 12px;
`;

export const StyledCustomSelect = styled.div`
  /* margin-bottom: 24px; */

  .selectLabel {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .customSelect {
    align-items: flex-start;
  }

  .customSelectControl {
    width: 100%;
  }
`;

export const Rate = styled.span`
  color: #65647e;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.66px;
  line-height: 14px;
  margin: 0 8px;
  text-transform: uppercase;
`;
