import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import Post from "../Post";
import "./Posts.scss";
import Astronaut from "../../../Astronaut";
import { FormattedMessage } from "react-intl";

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
    <Box alignItems="center" className="posts" display="flex" flexDirection="column">
      {posts ? (
        posts.length ? (
          posts
            .sort((p1, p2) => p2.createdAt - p1.createdAt)
            .map((post) => <Post key={post.id} post={post} />)
        ) : (
          <NoPosts />
        )
      ) : (
        <CircularProgress className="loader" />
      )}
    </Box>
  );
};

const NoPosts = () => (
  <Box className="noPosts" display="flex" alignItems="center" flexDirection="column">
    <Astronaut />
    <Typography variant="h1">
      <FormattedMessage id="wall.nopost" />
    </Typography>
    <Typography className="desc" variant="body1">
      <FormattedMessage id="wall.nopost.desc" />
    </Typography>
  </Box>
);
export default Posts;
