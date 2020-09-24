import React, { useState } from "react";
import { Box, Paper, Typography, MenuItem, Menu, IconButton } from "@material-ui/core";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import CustomButton from "../../../CustomButton";
import "./Post.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import { formatDate } from "../../../../utils/format";
import DOMPurify from "dompurify";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import { MoreHoriz } from "@material-ui/icons";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import Modal from "../../../Modal";
import EditPost from "../EditPost";

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
 */

/**
 * Render a post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Post = ({ post: _post }) => {
  const [post, setPost] = useState(_post);
  const originalContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["oembed"],
    ADD_ATTR: ["url"],
  });
  const content = embedMedias(originalContent);
  const [isApproving, setApproving] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const userData = useStoreUserData();
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    setPost(newPost);
  };

  const approvePost = () => {
    setApproving(true);

    const payload = {
      token: storeSession.tradeApi.accessToken,
      postId: post.id,
    };

    tradeApi
      .approvePost(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "wall.post.approved"));
        post.approved = true;
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setApproving(false);
      });
  };

  return (
    <Box className="post">
      <Modal
        onClose={() => setEditPostModal(false)}
        persist={false}
        size="medium"
        state={editPostModal}
      >
        <EditPost post={post} onUpdated={onUpdated} />
      </Modal>
      <Paper className="postContent">
        <Box className="adminActions" width={1}>
          {!post.approved &&
            (userData.isAdmin ? (
              <CustomButton className="bgPurple" loading={isApproving} onClick={approvePost}>
                <Typography className="bold" variant="body1">
                  <FormattedMessage id="wall.approve" />
                </Typography>
              </CustomButton>
            ) : (
              <Typography className="bold" variant="body1">
                <FormattedMessage id="wall.approve.pending" />
              </Typography>
            ))}
        </Box>
        <div className={post.approved ? "" : "disabled"}>
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
            {post.author.userId === userData.userId && (
              <>
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreHoriz />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="simple-menu"
                  keepMounted
                  onClose={handleMenuClose}
                  open={Boolean(anchorEl)}
                >
                  {post.author.userId === userData.userId && (
                    <MenuItem onClick={handleEdit}>
                      <FormattedMessage id="srv.edit" />
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
          <Typography variant="body1">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Typography>
        </div>
      </Paper>
    </Box>
  );
};

export default Post;
