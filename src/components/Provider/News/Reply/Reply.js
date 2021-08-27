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
  const [banned, setBanned] = useState(reply.author.banned);
  const initConfirmDeleteConfig = {
    titleTranslationId: "wall.delete.reply",
    messageTranslationId: "wall.delete.reply.subtitle",
    visible: false,
  };
  const [confirmDeleteConfig, setConfirmDeleteConfig] = useState(initConfirmDeleteConfig);
  const initConfirmReportConfig = {
    titleTranslationId: "wall.report",
    messageTranslationId: "wall.report.confirm",
    visible: false,
  };
  const [confirmReportConfig, setConfirmReportConfig] = useState(initConfirmReportConfig);
  const initConfirmBanUserConfig = {
    titleTranslationId: "wall.ban",
    messageTranslationId: "wall.ban.confirm",
    visible: false,
  };
  const [confirmBanUserConfig, setConfirmBanUserConfig] = useState(initConfirmBanUserConfig);
  const initConfirmUnbanUserConfig = {
    titleTranslationId: "wall.unban",
    messageTranslationId: "wall.unban.confirm",
    visible: false,
  };
  const [confirmUnbanUserConfig, setConfirmUnbanUserConfig] = useState(initConfirmUnbanUserConfig);
  const userData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const canEdit = reply.author.userId === userData.userId || userData.isAdmin;
  const dispatch = useDispatch();
  const isNested = !showAddReply;

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
      nested: isNested,
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

  const reportReply = () => {
    const payload = {
      postId: postId,
      replyId: reply.id,
      nested: isNested,
      userId: reply.author.userId,
    };

    tradeApi
      .wallReportUser(payload)
      .then((result) => {
        if (result) {
          dispatch(showSuccessAlert("", "wall.report.done"));
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  const banUser = () => {
    tradeApi
      .wallBanUser(reply.author.userId)
      .then((result) => {
        if (result) {
          dispatch(showSuccessAlert("", "wall.ban.done"));
          setBanned(true);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  const unbanUser = () => {
    tradeApi
      .wallUnbanUser(reply.author.userId)
      .then((result) => {
        if (result) {
          dispatch(showSuccessAlert("", "wall.unban.done"));
          setBanned(false);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  const handleBanClick = () => {
    const method = !banned ? setConfirmBanUserConfig : setConfirmUnbanUserConfig;
    method((c) => ({ ...c, visible: true }));
  };

  return (
    <Box className="reply">
      <ConfirmDialog
        confirmConfig={confirmDeleteConfig}
        executeActionCallback={deleteReply}
        setConfirmConfig={setConfirmDeleteConfig}
      />
      <ConfirmDialog
        confirmConfig={confirmReportConfig}
        executeActionCallback={reportReply}
        setConfirmConfig={setConfirmReportConfig}
      />
      <ConfirmDialog
        confirmConfig={confirmBanUserConfig}
        executeActionCallback={banUser}
        setConfirmConfig={setConfirmBanUserConfig}
      />
      <ConfirmDialog
        confirmConfig={confirmUnbanUserConfig}
        executeActionCallback={unbanUser}
        setConfirmConfig={setConfirmUnbanUserConfig}
      />
      <Box alignItems="center" className="replyHeader" display="flex">
        <div className={reply.author.isFollowing ? "following" : ""}>
          <ProviderLogo
            defaultImage={ProfileIcon}
            size="32px"
            title=""
            url={reply.author.imageUrl}
          />
        </div>

        <Box alignItems="center" className="replyMetaBox" display="flex">
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
            {/* {canEdit && (
              <MenuItem onClick={() => {}}>
                <FormattedMessage id="srv.edit" />
              </MenuItem>
            )} */}
            {canEdit && (
              <MenuItem onClick={() => setConfirmDeleteConfig((c) => ({ ...c, visible: true }))}>
                <FormattedMessage id="srv.edit.delete" />
              </MenuItem>
            )}
            <MenuItem onClick={() => setConfirmReportConfig((c) => ({ ...c, visible: true }))}>
              <FormattedMessage id="wall.report" />
            </MenuItem>
          </Menu>
        </div>
      </Box>
      <div className="replyBox">
        {addLineBreaks(reply.content)}
        <Box alignItems="center" className="replyActions" display="flex">
          {/* <Typography className="action callout2">
            <FormattedMessage id="wall.like" />
          </Typography> */}
          {userData.isAdmin && (
            <Typography className="action callout2" onClick={handleBanClick}>
              <FormattedMessage id={banned ? "wall.unban" : "wall.ban"} />
            </Typography>
          )}
          {showAddReply && (
            <>
              {userData.isAdmin && <span className="sep">·</span>}
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

  const handleShowAddReply = () => {
    setShowAllReplies(true);
    showAddReply(true);
  };

  return (
    <div className="replyContainer">
      <Reply
        onReplyDeleted={onReplyDeleted}
        postId={postId}
        reply={reply}
        showAddReply={handleShowAddReply}
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
              <Reply key={r.id} onReplyDeleted={onReplyDeleted} postId={postId} reply={r} />
            ))}
          </div>
        )}
        {addReply && <AddReply onReplyAdded={onReplyAdded} postId={postId} replyId={reply.id} />}
      </div>
    </div>
  );
};

export default ReplyContainer;
