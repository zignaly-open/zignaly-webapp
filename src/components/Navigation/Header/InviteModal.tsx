import { Box, FormControlLabel, Grid, OutlinedInput, Switch, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import useClipboard from "hooks/useClipboard";
import styled, { css } from "styled-components";
import CopyIcon from "images/exchangeAccount/copy.svg";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import Modal from "components/Modal";
import { useDispatch } from "react-redux";
import { getUserData } from "store/actions/user";
import tradeApi from "services/tradeApiClient";

const CopyButton = styled.img`
  cursor: pointer;
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
        <Box mt={5} display="flex" flexDirection="column" alignItems="center">
          <label className="customLabel">
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
            <Typography align="center">
              <FormattedMessage id="accounts.invite.type.perpetual.desc" />
            </Typography>
            <br />
            <Typography align="center">
              <FormattedMessage id="accounts.invite.description2" />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default InviteModal;
