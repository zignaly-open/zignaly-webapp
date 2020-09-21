import React, { useState } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
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
        {!post.approved && (
          <Box width={1} className="adminActions">
            <CustomButton className="bgPurple" onClick={approvePost} loading={isApproving}>
              <Typography className="bold" variant="body1">
                Approve
              </Typography>
            </CustomButton>
          </Box>
        )}
        <div className={post.approved ? "" : "disabled"}>
          <Box alignItems="center" className="postHeader" display="flex">
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
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </Paper>
    </Box>
  );
};
export default Post;
