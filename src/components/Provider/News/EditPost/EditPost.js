import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "../../../Dialogs";
import { navigate as navigateReach } from "@reach/router";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
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
const EditPost = ({ post }) => {
  const storeUserData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(post.content);
  const dispatch = useDispatch();

  const editPost = () => {
    if (!storeUserData.userName) {
      setConfirmConfig((c) => ({ ...c, visible: true }));
    } else {
      setIsLoading(true);

      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId,
        content,
      };

      tradeApi
        .createPost(payload)
        .then(() => {
          dispatch(showSuccessAlert("", "wall.post.success"));
          setContent("");
          onCreated();
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
