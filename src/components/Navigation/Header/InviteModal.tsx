import { Box, FormControlLabel, Grid, OutlinedInput, Switch, Typography } from "@material-ui/core";
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

const TypographyNote = styled(Typography)`
  /* font-style: italic; */
`;

const SwitchLabel = styled(Typography)`
  cursor: pointer;

  ${(props) =>
    props.enabled &&
    css`
      font-weight: 700;
    `}
`;

interface InviteModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const InviteModal = ({ onClose, isOpen }: InviteModalProps) => {
  const copyToClipboard = useClipboard();
  const userData = useStoreUserData();
  const dispatch = useDispatch();
  const [refRewardType, setRefRewardType] = useState(userData.refRewardType);
  const refRewardTypeBool = refRewardType !== "oneTime";
  const link = "https://zignaly.com/app/signup/?invite=" + userData.refCode;

  const onRewardTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    const valString = val ? "perpetual" : "oneTime";
    setRefRewardType(valString);
    tradeApi
      .updateUser({ refRewardType: valString })
      .then(() => {
        dispatch(getUserData());
      })
      .catch(() => {
        setRefRewardType(userData.refRewardType);
      });
  };

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
            <Grid
              component="label"
              container
              alignItems="center"
              justifyContent="center"
              spacing={1}
              style={{ margin: "28px 0 0" }}
            >
              <Grid item>
                <SwitchLabel enabled={!refRewardTypeBool}>
                  <FormattedMessage id="accounts.invite.type.single" />
                </SwitchLabel>
              </Grid>
              <Grid item>
                <Switch checked={refRewardTypeBool} onChange={onRewardTypeChange} />
              </Grid>
              <Grid item>
                <SwitchLabel enabled={refRewardTypeBool}>
                  <FormattedMessage id="accounts.invite.type.perpetual" />
                </SwitchLabel>
              </Grid>
            </Grid>
            <Typography align="center">
              <FormattedMessage
                id={
                  refRewardTypeBool
                    ? "accounts.invite.type.perpetual.desc"
                    : "accounts.invite.type.single.desc"
                }
              />
            </Typography>
            <Box mt={5} mb={2}>
              <TypographyNote align="center">
                <FormattedMessage id="accounts.invite.description2" />
              </TypographyNote>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default InviteModal;
