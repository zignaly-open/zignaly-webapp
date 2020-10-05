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
      sendReply();
    }
  };

  const sendReply = () => {
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
  };

  return (
    <Box alignItems="center" className="addReply" display="flex">
      <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={storeUserData.imageUrl} />
      <OutlinedInput
        disabled={loading}
        fullWidth={true}
        multiline={true}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={keyPress}
        placeholder={intl.formatMessage({ id: "wall.write.comment" })}
        value={reply}
      />
    </Box>
  );
};
export default AddReply;
