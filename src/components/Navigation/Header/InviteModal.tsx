import { Box, OutlinedInput, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import useClipboard from "hooks/useClipboard";
import styled from "styled-components";
import CopyIcon from "images/exchangeAccount/copy.svg";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import Modal from "components/Modal";

const CopyButton = styled.img`
  cursor: pointer;
`;

const TypographyNote = styled(Typography)`
  font-style: italic;
`;

interface InviteModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const InviteModal = ({ onClose, isOpen }: InviteModalProps) => {
  const copyToClipboard = useClipboard();
  const userData = useStoreUserData();
  const link = "https://zignaly.com/app/signup/?invite=" + userData.refCode;

  return (
    <Modal onClose={onClose} persist={false} size="medium" state={isOpen}>
      <Box alignItems="center" display="flex" flex={1} padding={4} flexDirection="column">
        <Typography variant="h3">
          <FormattedMessage id="accounts.invite" />
        </Typography>
        {!userData.refCode ? (
          <Box mt={5}>
            <Typography>Please re-login to load your referral link.</Typography>
          </Box>
        ) : (
          <>
            <Box mt={5} mb={2}>
              <Typography>
                <FormattedMessage id="accounts.invite.description" />
              </Typography>
            </Box>
            <label className={"customLabel"}>
              <FormattedMessage id="accounts.invite.link" />
            </label>
            <OutlinedInput
              className="customInput"
              readOnly
              value={link}
              style={{ maxWidth: "520px" }}
              endAdornment={
                <CopyButton
                  alt="copy"
                  className="copy"
                  onClick={() => copyToClipboard(link, "accounts.invite.link.copied")}
                  src={CopyIcon}
                  width={24}
                  height={24}
                />
              }
            />
            <Box mt={5} mb={2}>
              <TypographyNote>
                <FormattedMessage id="accounts.invite.description2" />
              </TypographyNote>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default InviteModal;
