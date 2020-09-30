import React, { useState } from "react";
import { Box, OutlinedInput } from "@material-ui/core";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import "./CreateReply.scss";
import { useIntl } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {import('react').MouseEvent} MouseEvent
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} postId
 * @property {string} [replyId]
 */

/**
 * Render a component to create reply.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const CreateReply = ({ postId, replyId }) => {
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
      .then(() => {
        setReply("");
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box className="createReply" display="flex" alignItems="center">
      <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={storeUserData.imageUrl} />
      <OutlinedInput
        fullWidth={true}
        placeholder={intl.formatMessage({ id: "wall.write.comment" })}
        onKeyDown={keyPress}
        onChange={(e) => setReply(e.target.value)}
        value={reply}
        disabled={loading}
        multiline={true}
      />
    </Box>
  );
};
export default CreateReply;
