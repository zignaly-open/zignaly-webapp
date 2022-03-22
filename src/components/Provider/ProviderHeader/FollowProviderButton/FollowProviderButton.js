import React, { useState } from "react";
import "./FollowProviderButton.scss";
import { Box, Typography, Tooltip } from "@mui/material";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { getProvider } from "../../../../store/actions/views";
import ExchangeIcon from "../../../ExchangeIcon";
import useSelectedExchange from "hooks/useSelectedExchange";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
// import { userPilotProviderEnabled } from "../../../../utils/userPilotApi";
import Modal from "../../../Modal";
import ConnectExchange from "../../../Modal/ConnectExchange";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const FollowProviderButton = ({ provider }) => {
  const selectedExchange = useSelectedExchange();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [connectModal, showConnectModal] = useState(false);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const handleConnectModalClose = () => {
    showConnectModal(false);
  };

  const followProvider = () => {
    if (exchangeConnections.length) {
      setLoader(true);
      const payload = {
        providerId: provider.id,
        connected: false,
        exchangeInternalId: selectedExchange.internalId,
      };
      tradeApi
        .providerConnect(payload)
        .then(() => {
          const payload2 = {
            providerId: provider.id,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getProvider(payload2, true));
          dispatch(showSuccessAlert("srv.follow.alert.title", "srv.follow.alert.body"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      showConnectModal(true);
    }
  };

  const stopFollowing = async () => {
    if (exchangeConnections.length) {
      setLoader(true);
      const payload = {
        disable: true,
        providerId: provider.id,
        type: "connected",
      };
      tradeApi
        .providerDisable(payload)
        .then(() => {
          const payload2 = {
            providerId: provider.id,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getProvider(payload2, true));
          // userPilotProviderEnabled();
          dispatch(showSuccessAlert("srv.unfollow.alert.title", "srv.unfollow.alert.body"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      showConnectModal(true);
    }
  };

  const followingFrom = exchangeConnections.find(
    (e) => e.internalId === provider.exchangeInternalId,
  );

  return (
    <Box
      alignItems="center"
      className="followProviderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Modal onClose={handleConnectModalClose} size="small" state={connectModal}>
        <ConnectExchange onClose={handleConnectModalClose} />
      </Modal>
      {provider.disable ? (
        <CustomButton className="submitButton" loading={loader} onClick={followProvider}>
          <FormattedMessage id="srv.followprovider" />
        </CustomButton>
      ) : !followingFrom || provider.exchangeInternalId === selectedExchange.internalId ? (
        <CustomButton className="loadMoreButton" loading={loader} onClick={stopFollowing}>
          <FormattedMessage id="srv.stopfollowing" />
        </CustomButton>
      ) : (
        <Box
          alignItems="center"
          className="actionHelpBox"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Typography variant="h4">
            <FormattedMessage id="copyt.followingfrom" />
          </Typography>
          <Tooltip placement="top" title={followingFrom.internalName}>
            <Box>
              <ExchangeIcon exchange={followingFrom.name.toLowerCase()} size="mediumLarge" />
            </Box>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default FollowProviderButton;
