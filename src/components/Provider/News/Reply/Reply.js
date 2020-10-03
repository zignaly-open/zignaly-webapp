import React, { useState } from "react";
import { Box, Typography, MenuItem, Menu, IconButton } from "@material-ui/core";
import "./Reply.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import { formatDate } from "../../../../utils/format";
import { FormattedMessage } from "react-intl";
import AddReply from "../AddReply";
import { MoreHoriz } from "@material-ui/icons";
import { ConfirmDialog } from "../../../Dialogs";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../../services/tradeApiClient";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import { CornerDownRight } from "react-feather";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} ReplyProps
 * @property {Post} reply
 * @property {string} postId
 * @property {function} [showAddReply]
 * @property {function} onReplyDeleted
 */

/**
 * Render a reply.
 *
 * @param {ReplyProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Reply = ({ postId, reply, showAddReply, onReplyDeleted }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const initConfirmConfig = {
    titleTranslationId: "wall.delete.reply",
    messageTranslationId: "wall.delete.reply.subtitle",
    visible: false,
  };
  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const userData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const canEdit = reply.author.userId === userData.userId || userData.isAdmin;
  const dispatch = useDispatch();

  /**
   * Handle action element click event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Action element click.
   * @returns {Void} None.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteReply = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      postId: postId,
      replyId: reply.id,
    };

    tradeApi
      .deleteReply(payload)
      .then((result) => {
        if (result) {
          onReplyDeleted(reply.id);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return (
    <Box className="reply">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={deleteReply}
        setConfirmConfig={setConfirmConfig}
      />
      <Box className="replyHeader" display="flex" alignItems="center">
        <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={reply.author.imageUrl} />
        <Box className="replyMetaBox" display="flex" alignItems="center">
          <Typography className="username body1">{reply.author.userName}</Typography>
          <span className="sep">·</span>
          <Typography className="date callout1">{formatDate(reply.createdAt)}</Typography>
        </Box>
        <div className="replyMenu">
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="simple-menu"
            keepMounted
            onClose={handleMenuClose}
            open={Boolean(anchorEl)}
          >
            {canEdit && (
              <MenuItem onClick={() => {}}>
                <FormattedMessage id="srv.edit" />
              </MenuItem>
            )}
            {canEdit && (
              <MenuItem onClick={() => setConfirmConfig((c) => ({ ...c, visible: true }))}>
                <FormattedMessage id="srv.edit.delete" />
              </MenuItem>
            )}
          </Menu>
        </div>
      </Box>
      <div className="replyBox">
        {addLineBreaks(reply.content)}
        <Box display="flex" className="replyActions" alignItems="center">
          <Typography className="action callout2">
            <FormattedMessage id="wall.like" />
          </Typography>
          {showAddReply && (
            <>
              <span className="sep">·</span>
              <Typography
                className="action callout2"
                onClick={() => {
                  showAddReply(true);
                }}
              >
                <FormattedMessage id="wall.reply" />
              </Typography>
            </>
          )}
        </Box>
      </div>
    </Box>
  );
};

/**
 * Print string with line breaks
 * @param {string} string string
 * @returns {Array<JSX.Element>} JSX
 */
const addLineBreaks = (string) =>
  string.split("\n").map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));

/**
 * @typedef {Object} DefaultProps
 * @property {Post} reply
 * @property {string} postId
 * @property {function} onReplyAdded
 * @property {function} onReplyDeleted
 */

/**
 * Render a reply, nested replies and reply input.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ReplyContainer = ({ postId, reply, onReplyAdded, onReplyDeleted }) => {
  const [addReply, showAddReply] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);

  let sortedReplies = reply.replies.sort((r1, r2) => r1.createdAt - r2.createdAt);

  return (
    <div className="replyContainer">
      <Reply
        reply={reply}
        showAddReply={showAddReply}
        onReplyDeleted={onReplyDeleted}
        postId={postId}
      />
      <div className="subRepliesContainer">
        {!showAllReplies && reply.replies.length > 0 ? (
          <Typography className="showAllReplies callout2" onClick={() => setShowAllReplies(true)}>
            <CornerDownRight />
            <FormattedMessage id="wall.replies.count" values={{ number: reply.replies.length }} />
          </Typography>
        ) : (
          <div className="childReplies">
            {sortedReplies.map((r) => (
              <Reply reply={r} key={r.id} onReplyDeleted={onReplyDeleted} postId={postId} />
            ))}
          </div>
        )}
        {addReply && <AddReply postId={postId} replyId={reply.id} onReplyAdded={onReplyAdded} />}
      </div>
    </div>
  );
};

export default ReplyContainer;
