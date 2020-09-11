import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import Editor from "../../../Editor";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import "./Post.scss";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import ProfileIcon from "../../../../images/header/profileIcon.svg";

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
  const { provider } = useStoreViewsSelector();

  return (
    <Box className="post">
      {/* <Editor content={post.content} /> */}
      <Paper className="postContent">
        <Box className="postHeader" display="flex" alignItems="center">
          <ProviderLogo
            size="40px"
            title={post.author.userName}
            url={post.author.imageUrl}
            defaultImage={ProfileIcon}
          />
          {/* <div className="name">{post.author.userName}</div> */}
          <Typography variant="h4" className="userName">
            {post.author.userName}
          </Typography>
        </Box>
        <ReactMarkdown
          //   linkTarget="_blank"
          plugins={[breaks]}
          source={post.content}
          renderers={{
            link: (props) => (
              <a href={props.href} target="_blank nofollow">
                {props.children}
              </a>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};
export default Post;
