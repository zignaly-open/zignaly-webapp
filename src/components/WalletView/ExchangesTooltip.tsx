import React from "react";
import styled from "styled-components";
import { ascendexUrl, gateioUrl, mexcUrl } from "utils/affiliateURLs";
import { colors } from "services/theme";
import { FormattedMessage } from "react-intl";

const TooltipContainer = styled.div`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 16px;

  a {
    text-decoration: none;
    color: ${colors.purpleLight};
  }
`;

const TypographyTooltip = styled.span`
  /* color: #0c0d21; */
  margin-bottom: 3px;
`;

const ExchangesTooltip = () => (
  <TooltipContainer>
    <TypographyTooltip>
      <FormattedMessage id="wallet.buy.tooltip" />
    </TypographyTooltip>
    <a href={ascendexUrl} rel="noreferrer" target="_blank">
      AscendEX &gt;
    </a>
    <a href={mexcUrl} rel="noreferrer" target="_blank">
      MEXC &gt;
    </a>
    <a href={gateioUrl} rel="noreferrer" target="_blank">
      Gate.io &gt;
    </a>
  </TooltipContainer>
);

export default ExchangesTooltip;
