import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import "./Post.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import { formatDate } from "../../../../utils/format";
import DOMPurify from "dompurify";

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
  return (
    <Box className="post">
      <Paper className="postContent">
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
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        {post.content}
      </Paper>
    </Box>
  );
};
export default Post;
