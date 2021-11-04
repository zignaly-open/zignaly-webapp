import styled from "styled-components";
import { isMobile } from "styles/styles";

export const TitleIcon = styled.img`
  margin-right: 12px;
`;

export const StyledCustomSelect = styled.div`
  margin-top: 64px;

  ${isMobile(`
    margin-top: 32px;
  `)}

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
