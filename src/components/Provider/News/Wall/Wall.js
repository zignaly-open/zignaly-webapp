import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import CreatePost from "../CreatePost";
import Posts from "../Posts";
import WallSubscribe from "../WallSubscribe";
import "./Wall.scss";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider
 */

/**
 * Render Wall.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Wall = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const [posts, setPosts] = useState(/** @type {Array<Post>} */ (null));
  const dispatch = useDispatch();

  const loadPosts = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: provider.id,
    };

    tradeApi
      .getPosts(payload)
      .then((_posts) => {
        setPosts(_posts);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setPosts([]);
      });
  };
  useEffect(loadPosts, []);

  /**
   * Post deleted callback
   * @param {string} postId postId
   * @returns {void}
   */
  const onPostDeleted = (postId) => {
    const newPosts = posts.filter((p) => p.id !== postId);
    setPosts(newPosts);
  };

  return (
    <Box className="wall">
      {(provider.notificationsPosts || !provider.disable) && (
        <WallSubscribe providerId={provider.id} subscribed={provider.notificationsPosts} />
      )}
      {provider.isAdmin && <CreatePost onCreated={loadPosts} providerId={provider.id} />}
      <Posts onPostDeleted={onPostDeleted} posts={posts} />
    </Box>
  );
};
export default Wall;
