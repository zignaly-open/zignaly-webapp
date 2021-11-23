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

  div {
    display: inline-flex;
    flex-direction: column;
    margin-right: 55px;
  }
`;

export const BenefitsInfo = () => {
  const intl = useIntl();
  const parseTranslationList = (id: string) => {
    const translation = intl.formatMessage({ id });
    return translation.split("\n");
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
        <div>
          {parseTranslationList("vault.benefits.info").map((t, i) => (
            <div>{t}</div>
          ))}
        </div>
        <div>
          {parseTranslationList("vault.benefits.info2").map((t, i) => (
            <div>{t}</div>
          ))}
        </div>
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
