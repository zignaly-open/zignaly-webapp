import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import "./EditPost.scss";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreViewsSelector from "hooks/useStoreViewsSelector";
import Editor from "../../../Editor";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Post} post
 * @property {function} onUpdated
 */

/**
 * Render Edit Post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const EditPost = ({ post, onUpdated }) => {
  const storeViews = useStoreViewsSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(post.content);
  const dispatch = useDispatch();

  const editPost = () => {
    setIsLoading(true);

    const payload = {
      postId: post.id,
      providerId: storeViews.provider.id,
      content,
    };

    tradeApi
      .editPost(payload)
      .then((p) => {
        dispatch(showSuccessAlert("", "wall.post.updated"));
        onUpdated(p);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Paper className="editPost">
      <Typography variant="h3">
        <FormattedMessage id="wall.edit" />
      </Typography>
      <Editor content={content} onChange={setContent} />

      <CustomButton
        className="submitButton"
        disabled={content.length < 10}
        loading={isLoading}
        onClick={() => editPost()}
      >
        <FormattedMessage id="wall.update" />
      </CustomButton>
    </Paper>
  );
};
export default EditPost;
