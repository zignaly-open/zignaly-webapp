import React, { useState, useEffect } from "react";
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
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [followingFrom, setFollowingFrom] = useState({ internalName: "", name: "" });

  const followProvider = async () => {
    try {
      setLoader(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        connected: false,
        exchangeInternalId: storeSettings.selectedExchange.internalId,
      };
      const response = await tradeApi.providerConnect(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        dispatch(showSuccessAlert("srv.follow.alert.title", "srv.follow.alert.body"));
        setLoader(false);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  const stopFollowing = async () => {
    try {
      setLoader(true);
      const payload = {
        disable: true,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        type: "connected",
      };
      const response = await tradeApi.providerDisable(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        dispatch(showSuccessAlert("srv.unfollow.alert.title", "srv.unfollow.alert.body"));
        setLoader(false);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  const initFollowingFrom = () => {
    let found = [...exchangeConnections].find(
      (item) => item.internalId === provider.exchangeInternalId,
    );
    if (found) {
      setFollowingFrom(found);
    }
  };

  useEffect(initFollowingFrom, [exchangeConnections]);

  return (
    <Box
      alignItems="center"
      className="followProviderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {provider.disable ? (
        <CustomButton className="submitButton" loading={loader} onClick={followProvider}>
          <FormattedMessage id="srv.followprovider" />
        </CustomButton>
      ) : provider.exchangeInternalId ? (
        provider.exchangeInternalId === storeSettings.selectedExchange.internalId ? (
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
        )
      ) : (
        <CustomButton className="loadMoreButton" loading={loader} onClick={stopFollowing}>
          <FormattedMessage id="srv.stopfollowing" />
        </CustomButton>
      )}
    </Box>
  );
};

export default FollowProviderButton;
