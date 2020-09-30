import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import "./Reply.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import { formatDate } from "../../../../utils/format";
import { FormattedMessage } from "react-intl";
import CreateReply from "../CreateReply";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} ReplyProps
 * @property {Post} reply
 * @property {function} [showAddReply]
 */

/**
 * Render a reply.
 *
 * @param {ReplyProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Reply = ({ reply, showAddReply }) => {
  return (
    <Box className="reply">
      <Box className="replyHeader" display="flex" alignItems="center">
        <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={reply.author.imageUrl} />
        <Box className="replyMetaBox" display="flex" alignItems="center">
          <Typography className="username body1">{reply.author.userName}</Typography>
          <span className="sep">·</span>
          <Typography className="date callout1">{formatDate(reply.createdAt)}</Typography>
        </Box>
      </Box>
      <div className="replyBox">
        {addLineBreaks(reply.content)}
        <Box display="flex" className="replyActions" alignItems="center">
          <Typography className="action callout1">
            <FormattedMessage id="wall.like" />
          </Typography>
          {showAddReply && (
            <>
              <span className="sep">·</span>
              <Typography
                className="action callout1"
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
 */

/**
 * Render a reply, nested replies and reply input.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const ReplyContainer = ({ postId, reply, onReplyAdded }) => {
  const [addReply, showAddReply] = useState(false);

  return (
    <div className="replyContainer">
      <Reply reply={reply} showAddReply={showAddReply} />
      <div className="childReplies">
        {reply.replies
          .sort((r1, r2) => r2.createdAt - r1.createdAt)
          .map((r) => (
            <Reply reply={r} key={reply.id} />
          ))}
      </div>
      {addReply && <CreateReply postId={postId} replyId={reply.id} onReplyAdded={onReplyAdded} />}
    </div>
  );
};

export default ReplyContainer;
