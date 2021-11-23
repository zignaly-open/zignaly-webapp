import { formatMessage } from "@formatjs/intl";
import { Box, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";
import { FormattedList, FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";

const Panel = styled.div`
  background: linear-gradient(91.23deg, rgba(34, 34, 73, 0.75) 0%, rgba(12, 13, 33, 0.75) 100%);
  border-radius: 12px;
  padding: 15px 15px 32px 15px;
  margin-bottom: 16px;
`;

const StyledInfo = styled(Info)`
  color: ${({ theme }) => theme.newTheme.green};
`;

const TypographyTitle = styled(Typography)`
  margin-left: 11px;
  font-weight: 600;
  font-size: 13px;
`;

const TypographyMessage = styled(Typography)`
  font-size: 14px;
  margin: 8px 0 0 35px;

  ul {
    display: inline-block;
    padding-left: 0;
  }
`;

export const BenefitsInfo = () => {
  const intl = useIntl();
  const parseTranslationList = (id: string) => {
    const translation = intl.formatMessage({ id });
    return translation.slice(2, translation.length - 1).split("• ");
  };

  return (
    <Panel>
      <Box display="flex" alignItems="center">
        <StyledInfo />
        <TypographyTitle>
          <FormattedMessage id="vault.benefits" />
        </TypographyTitle>
      </Box>
      <TypographyMessage>
        <ul>
          {parseTranslationList("vault.benefits.info").map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        <ul>
          {parseTranslationList("vault.benefits.info2").map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </TypographyMessage>
    </Panel>
  );
};

const InfoPanel = ({ title, message }: { title: string; message: string }) => {
  return (
    <Panel>
      <Box display="flex" alignItems="center">
        <StyledInfo />
        <TypographyTitle>
          <FormattedMessage id={title} />
        </TypographyTitle>
      </Box>
      <TypographyMessage>
        <FormattedMessage id={message} />
      </TypographyMessage>
    </Panel>
  );
};

export default InfoPanel;
