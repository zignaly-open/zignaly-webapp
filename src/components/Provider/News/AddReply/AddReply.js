import React, { useState } from "react";
import { Box, OutlinedInput } from "@material-ui/core";
import ProviderLogo from "../../ProviderHeader/ProviderLogo";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import "./AddReply.scss";
import { useIntl } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { navigate as navigateReach } from "@reach/router";
import { ConfirmDialog } from "../../../Dialogs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * @typedef {import('react').MouseEvent} MouseEvent
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} postId
 * @property {string} [replyId]
 * @property {function} onReplyAdded
 */

/**
 * Render a component to add reply.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const AddReply = ({ postId, replyId, onReplyAdded }) => {
  const storeUserData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const intl = useIntl();

  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e event
   * @returns {void}
   */
  const keyPress = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const sendReply = () => {
    if (!storeUserData.userName) {
      setConfirmConfig((c) => ({ ...c, visible: true }));
    } else {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        postId,
        ...(replyId ? { replyId } : {}),
        content: reply,
      };
      setLoading(true);

      tradeApi
        .addReply(payload)
        .then((newReply) => {
          setReply("");
          onReplyAdded(newReply, replyId);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig}
   */
  const initConfirmConfig = {
    titleTranslationId: "wall.completeprofile.title",
    messageTranslationId: "wall.completeprofile.desc",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const navigateProfileSettings = () => {
    navigateReach("#settings-profile");
  };

  let canPost = !storeUserData.wall.banned;
  const timeUntilCanPost = dayjs(storeUserData.wall.cantPostUntil).diff();
  if (timeUntilCanPost > 0) {
    canPost = false;
  }

  return (
    <Box alignItems="center" className="addReply" display="flex">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={navigateProfileSettings}
        setConfirmConfig={setConfirmConfig}
      />
      <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={storeUserData.imageUrl} />
      <OutlinedInput
        disabled={loading || !canPost}
        fullWidth={true}
        multiline={true}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={keyPress}
        placeholder={
          storeUserData.wall.banned
            ? intl.formatMessage({ id: "wall.write.banned" })
            : timeUntilCanPost > 0
            ? intl.formatMessage(
                { id: "wall.write.wait" },
                {
                  daysLeft: dayjs.duration({ milliseconds: timeUntilCanPost }).humanize(true),
                },
              )
            : intl.formatMessage({ id: "wall.write.comment" })
        }
        value={reply}
      />
    </Box>
  );
};
export default AddReply;
