import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import "./EditPost.scss";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import Editor from "../../../Editor";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {Object} DefaultProps
 * @property {string} content
 * @property {function} onCreated
 */

/**
 * Render Edit Post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const EditPost = ({ post, onUpdated }) => {
  const storeSession = useStoreSessionSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(post.content);
  const dispatch = useDispatch();

  const editPost = () => {
    setIsLoading(true);

    const payload = {
      token: storeSession.tradeApi.accessToken,
      postId: post.id,
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

      <CustomButton className="submitButton" loading={isLoading} onClick={() => editPost()}>
        <FormattedMessage id="wall.update" />
      </CustomButton>
    </Paper>
  );
};
export default EditPost;
