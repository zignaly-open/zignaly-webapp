import { Box, Button, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { ignoreNotice } from "store/actions/settings";
import styled, { css } from "styled-components";
import { isMobile } from "styles/styles";

const StyledButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  font-size: 13px;
`;

const Panel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(91.23deg, rgba(34, 34, 73, 0.75) 0%, rgba(12, 13, 33, 0.75) 100%);
  border-radius: 12px;
  padding: 15px 15px 32px 15px;
  margin-bottom: 16px;

  ${({ theme }) =>
    theme.palette.type === "light" &&
    css`
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
    `}

  ${isMobile(css`
    flex-direction: column;
  `)}
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
    &:not(:last-child) {
      margin-right: 55px;
      ${isMobile(css`
        margin: 0;
      `)}
    }
  }
`;

const ButtonsContainer = styled.div`
  margin: 0 20px 0 100px;

  ${isMobile(css`
    margin: 12px 0 0;
  `)}
`;

const InfoPanelGeneric = ({
  id,
  title,
  message,
}: {
  id: string;
  title: string;
  message: string | React.ReactElement;
}) => {
  const { ignoreNotice: ignoreNoticeSettings } = useStoreSettingsSelector();
  const dispatch = useDispatch();
  if (ignoreNoticeSettings[id]) {
    // return null;
  }

  const handleDismiss = () => {
    dispatch(ignoreNotice(id));
  };

  return (
    <Panel>
      <div>
        <Box display="flex" alignItems="center">
          <StyledInfo />
          <TypographyTitle>
            <FormattedMessage id={title} />
          </TypographyTitle>
        </Box>
        <TypographyMessage>
          {typeof message === "string" ? <FormattedMessage id={message} /> : message}
        </TypographyMessage>
      </div>
      <ButtonsContainer>
        <StyledButton onClick={handleDismiss}>
          <FormattedMessage id="action.dismiss" />
        </StyledButton>
      </ButtonsContainer>
    </Panel>
  );
};

const InfoPanel = (props: { id: string; title: string; message: string }) => {
  return <InfoPanelGeneric {...props} />;
};

export const BenefitsInfo = () => {
  const intl = useIntl();

  const parseTranslationList = (id: string) => {
    const translation = intl.formatMessage({ id });
    return translation.split("\n");
  };

  const Message = () => (
    <>
      <div>
        {parseTranslationList("vault.benefits.info").map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
      <div>
        {parseTranslationList("vault.benefits.info2").map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </>
  );

  return <InfoPanelGeneric id="vaultBenefits" title="vault.benefits" message={<Message />} />;
};

export default InfoPanel;
