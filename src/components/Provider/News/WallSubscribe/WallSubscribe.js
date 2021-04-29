import React, { useState } from "react";
import { NotificationsNone, NotificationsActive } from "@material-ui/icons";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import "./WallSubscribe.scss";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert } from "../../../../store/actions/ui";
import { getProvider } from "../../../../store/actions/views";
import { useDispatch } from "react-redux";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {boolean} subscribed
 * @property {string} providerId
 */

/**
 * Render a bell to subscribe to posts notifications
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const WallSubscribe = ({ subscribed, providerId }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const [isSubscribed, setSubscribed] = useState(subscribed);
  const dispatch = useDispatch();

  const subscribe = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId,
      subscribed: !isSubscribed,
    };

    tradeApi
      .updatePostsNotifications(payload)
      .then((res) => {
        if (res) {
          setSubscribed(!isSubscribed);
          const payload2 = {
            token: storeSession.tradeApi.accessToken,
            providerId,
            version: 2,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getProvider(payload2, true));
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return (
    <Tooltip
      placement="top"
      title={
        <FormattedMessage
          id={`${isSubscribed ? "wall.notifications.enabled" : "wall.notifications"}`}
        />
      }
    >
      <Box alignItems="center" className="wallSubscribe" display="flex" onClick={subscribe}>
        {isSubscribed ? <NotificationsActive /> : <NotificationsNone />}
        <Typography>
          <FormattedMessage id="settings.notifications" />
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default WallSubscribe;
