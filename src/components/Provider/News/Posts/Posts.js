import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import Post from "../Post";
import "./Posts.scss";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Array<Post>} posts
 */

/**
 * Render Posts list.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Posts = ({ posts }) => {
  return (
    <Box className="posts" display="flex" flexDirection="column" alignItems="center">
      {posts ? (
        posts
          .sort((p1, p2) =>
            p1.approved === p2.approved ? p2.createdAt - p1.createdAt : p1.approved ? 1 : -1,
          )
          .map((post) => <Post key={post.id} post={post} />)
      ) : (
        <CircularProgress className="loader" />
      )}
    </Box>
  );
};
export default Posts;
