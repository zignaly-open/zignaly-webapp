import React, { useState } from "react";
import { Box, Paper, Typography, MenuItem, Menu, IconButton } from "@mui/material";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import CustomButton from "../../../CustomButton";
import "./Post.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import { formatDate } from "../../../../utils/format";
import DOMPurify from "dompurify";
import tradeApi from "../../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import { MoreHoriz } from "@mui/icons-material";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import useStoreViewsSelector from "hooks/useStoreViewsSelector";
import Modal from "../../../Modal";
import EditPost from "../EditPost";
import AddReply from "../AddReply";
import Reply from "../Reply";
import LazyLoad from "react-lazyload";
import { ConfirmDialog } from "../../../Dialogs";

/**
 * Parse html to embed medias
 * @param {string} html original html
 * @returns {string} new html
 */
const embedMedias = (html) => {
  const oembed = html.split("</oembed>");
  let content = "";

  oembed.forEach((item, index) => {
    content += oembed[index] + "</oembed>";
    const oembed1 = item.split('url="')[1];
    if (oembed1) {
      const oembed2 = oembed1.split('">')[0];
      if (oembed2) {
        const youtube = oembed2.split("https://www.youtube.com/watch?v=")[1];
        if (youtube) {
          content +=
            '<div class="iframeContainer"><iframe src="https://youtube.com/embed/' +
            youtube +
            '" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
        }
      }
    }
  });
  return content;
};

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Post} post
 * @property {function} onPostDeleted
 */

/**
 * Render a post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Post = ({ post: _post, onPostDeleted }) => {
  const [post, setPost] = useState(_post);
  const originalContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["oembed"],
    ADD_ATTR: ["url"],
  });
  const content = embedMedias(originalContent);
  const [isApproving, setApproving] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false);
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const userData = useStoreUserData();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const initConfirmConfig = {
    titleTranslationId: "wall.delete.post",
    messageTranslationId: "wall.delete.post.subtitle",
    visible: false,
  };
  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);
  const [showAllComments, setShowAllComments] = useState(false);
  const canEdit = post.author.userId === userData.userId || userData.isAdmin;

  let sortedReplies = post.replies.sort((r1, r2) => r1.createdAt - r2.createdAt);
  if (!showAllComments) {
    // Display only 2 comments initially
    sortedReplies = sortedReplies.slice(sortedReplies.length - 2, sortedReplies.length);
  }

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

  const handleEdit = () => {
    handleMenuClose();
    setEditPostModal(true);
  };

  /**
   * Update Post callback
   * @param {Post} newPost New post
   * @returns {void}
   */
  const onUpdated = (newPost) => {
    setEditPostModal(false);
    setPost({ ...newPost, replies: post.replies });
  };

  /**
   * Delete reply callback
   * @param {string} replyId replyId
   * @returns {void}
   */
  const onReplyDeleted = (replyId) => {
    // Remove comment
    let replies = post.replies.filter((r) => r.id !== replyId);
    if (replies.length === post.replies.length) {
      // Comment not deleted, look for the nested reply
      for (const reply of replies) {
        let subReplies = reply.replies.filter((r) => r.id !== replyId);

        if (subReplies.length !== reply.replies.length) {
          reply.replies = subReplies;
          break;
        }
      }
    }
    const newPost = { ...post, replies };
    setPost(newPost);
  };

  /**
   * Reply added callback
   * @param {Post} reply reply
   * @param {string} [replyId] parent reply id
   * @returns {void}
   */
  const onReplyAdded = (reply, replyId) => {
    const newPost = { ...post };
    if (replyId) {
      // Add new nested reply
      newPost.replies = newPost.replies.map((r) =>
        r.id === replyId ? { ...r, replies: [...r.replies].concat(reply) } : r,
      );
    } else {
      // Add new comment
      newPost.replies = [...post.replies].concat(reply);
    }
    setPost(newPost);
  };

  /**
   * Toggle post approval
   * @param {boolean} approve Approve or not
   * @returns {void}
   */
  const toggleApprove = (approve) => {
    setApproving(true);

    const payload = {
      postId: post.id,
      providerId: storeViews.provider.id,
    };

    const method = approve ? tradeApi.approvePost(payload) : tradeApi.unapprovePost(payload);
    method
      .then((result) => {
        if (result) {
          dispatch(showSuccessAlert("", approve ? "wall.post.approved" : "wall.post.unapproved"));
          setPost({ ...post, unapproved: !approve });
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setApproving(false);
      });
  };

  const deletePost = () => {
    const payload = {
      postId: post.id,
      providerId: storeViews.provider.id,
    };

    tradeApi
      .deletePost(payload)
      .then((result) => {
        if (result) {
          onPostDeleted(post.id);
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return (
    <Box className="post">
      <LazyLoad>
        <Modal
          onClose={() => setEditPostModal(false)}
          persist={false}
          size="medium"
          state={editPostModal}
        >
          <EditPost onUpdated={onUpdated} post={post} />
        </Modal>
        <ConfirmDialog
          confirmConfig={confirmConfig}
          executeActionCallback={deletePost}
          setConfirmConfig={setConfirmConfig}
        />
        <Paper className="postContent">
          <Box className="adminActions" width={1}>
            {userData.isAdmin ? (
              post.unapproved ? (
                <CustomButton
                  className="textPurple"
                  loading={isApproving}
                  onClick={() => toggleApprove(true)}
                >
                  <Typography className="bold" variant="body1">
                    <FormattedMessage id="wall.approve" />
                  </Typography>
                </CustomButton>
              ) : (
                <CustomButton
                  className="deleteButton"
                  loading={isApproving}
                  onClick={() => toggleApprove(false)}
                >
                  <Typography className="bold" variant="body1">
                    <FormattedMessage id="wall.unapprove" />
                  </Typography>
                </CustomButton>
              )
            ) : (
              post.unapproved && (
                <Typography className="bold" variant="body1">
                  <FormattedMessage id="wall.unapproved" />
                </Typography>
              )
            )}
          </Box>
          <div className={post.unapproved ? "disabled" : ""}>
            <Box
              alignItems="center"
              className="postHeader"
              display="flex"
              justifyContent="space-between"
            >
              <Box alignItems="center" display="flex">
                <ProviderLogo
                  defaultImage={ProfileIcon}
                  size="48px"
                  title={post.author.userName}
                  url={post.author.imageUrl}
                />
                <Box className="metaBox">
                  <Typography className="username body1">{post.author.userName}</Typography>
                  <Typography className="date callout1">{formatDate(post.createdAt)}</Typography>
                </Box>
              </Box>
              {canEdit && (
                <>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    size="large">
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
                      <MenuItem onClick={handleEdit}>
                        <FormattedMessage id="srv.edit" />
                      </MenuItem>
                    )}
                    {canEdit && (
                      <MenuItem onClick={() => setConfirmConfig((c) => ({ ...c, visible: true }))}>
                        <FormattedMessage id="srv.edit.delete" />
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
            </Box>
            <Typography component="div" variant="body1">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Typography>
          </div>
          {post.allowReplies && (
            <div className="repliesBox">
              {!showAllComments && post.replies.length > 2 && (
                <Typography
                  className="showAllComments callout2"
                  onClick={() => setShowAllComments(true)}
                >
                  <FormattedMessage
                    id="wall.replies.more"
                    values={{ number: post.replies.length - 2 }}
                  />
                </Typography>
              )}

              {sortedReplies.map((reply) => (
                <Reply
                  key={reply.id}
                  onReplyAdded={onReplyAdded}
                  onReplyDeleted={onReplyDeleted}
                  postId={post.id}
                  reply={reply}
                />
              ))}
              <AddReply onReplyAdded={onReplyAdded} postId={post.id} />
            </div>
          )}
        </Paper>
      </LazyLoad>
    </Box>
  );
};

export default Post;
