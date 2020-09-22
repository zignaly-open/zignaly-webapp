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
const Post = ({ post }) => {
  const originalContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["oembed"],
    ADD_ATTR: ["url"],
  });
  const content = embedMedias(originalContent);
  const [isApproving, setApproving] = useState(false);
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const userData = useStoreUserData();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      <Paper className="postContent">
        <Box width={1} className="adminActions">
          {!post.approved &&
            (userData.isAdmin ? (
              <CustomButton className="bgPurple" onClick={approvePost} loading={isApproving}>
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
            className="postHeader"
            display="flex"
            justifyContent="space-between"
            display="flex"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <ProviderLogo
                defaultImage={ProfileIcon}
                size="40px"
                title={post.author.userName}
                url={post.author.imageUrl}
              />
              <Box className="metaBox">
                <Typography className="username callout2">{post.author.userName}</Typography>
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
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <FormattedMessage id="srv.edit" />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </Paper>
    </Box>
  );
};
export default Post;
