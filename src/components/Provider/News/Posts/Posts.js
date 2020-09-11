import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";
import Post from "../Post";
import "./Posts.scss";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {string} providerId
 */

/**
 * Render Posts list.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Posts = ({ providerId }) => {
  const storeSession = useStoreSessionSelector();
  const [posts, setPosts] = useState(/** @type {Array<Post>} */ (null));
  const dispatch = useDispatch();

  const loadPosts = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId,
    };

    tradeApi
      .getPosts(payload)
      .then((_posts) => {
        setPosts(_posts);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  useEffect(loadPosts, []);

  return (
    <Box className="posts" display="flex" justifyContent="center" flexDirection="column">
      {posts ? (
        posts
          .sort((p1, p2) => p2.createdAt - p1.createdAt)
          .map((post) => <Post key={post.id} post={post} />)
      ) : (
        <CircularProgress className="loader" />
      )}
    </Box>
  );
};
export default Posts;
