import React, { useState } from "react";
import "./FollowProviderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../../store/actions/views";
import ExchangeIcon from "../../../ExchangeIcon";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { userPilotProviderEnabled } from "../../../../utils/userPilotApi";
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
  const storeSession = useStoreSessionSelector();
  const { selectedExchange } = useStoreSettingsSelector();
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
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        connected: false,
        exchangeInternalId: selectedExchange.internalId,
      };
      tradeApi
        .providerConnect(payload)
        .then(() => {
          const payload2 = {
            token: storeSession.tradeApi.accessToken,
            providerId: provider.id,
            version: 2,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(setProvider(payload2, true));
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
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        type: "connected",
      };
      tradeApi
        .providerDisable(payload)
        .then(() => {
          const payload2 = {
            token: storeSession.tradeApi.accessToken,
            providerId: provider.id,
            version: 2,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(setProvider(payload2));
          userPilotProviderEnabled();
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
