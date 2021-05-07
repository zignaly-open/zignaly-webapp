import React, { useState } from "react";
import { Paper, Typography, Switch, Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "../../../Dialogs";
import { navigate as navigateReach } from "@reach/router";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import "./CreatePost.scss";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import Editor from "../../../Editor";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {Object} DefaultProps
 * @property {string} providerId
 * @property {function} onCreated
 */

/**
 * Render Create Post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const CreatePost = ({ providerId, onCreated }) => {
  const storeUserData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [allowReplies, setAllowReplies] = useState(true);
  const dispatch = useDispatch();

  const createPost = () => {
    if (!storeUserData.userName) {
      setConfirmConfig((c) => ({ ...c, visible: true }));
    } else {
      setIsLoading(true);

      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId,
        content,
        allowReplies,
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

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig}
   */
  const initConfirmConfig = {
    titleTranslationId: "wall.completeprofile.title",
    messageTranslationId: "wall.completeprofile.desc",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  const navigateProfileSettings = () => {
    navigateReach("#settings-profile");
  };

  return (
    <Paper className="createPost">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={navigateProfileSettings}
        setConfirmConfig={setConfirmConfig}
      />
      <Typography variant="h3">
        <FormattedMessage id="wall.write" />
      </Typography>
      {/* <ProviderLogo size="30px" title="" url={storeUserData.imageUrl} defaultImage={ProfileIcon} /> */}
      {/* <Typography variant="">{storeUserData.userName}</Typography> */}

      <Editor content={content} onChange={setContent} />

      <Box display="flex" justifyContent="space-between">
        <CustomButton
          className="submitButton"
          disabled={content.length < 10}
          loading={isLoading}
          onClick={() => createPost()}
        >
          <FormattedMessage id="wall.post" />
        </CustomButton>
        <Box alignItems="center" display="flex">
          <Typography variant="h5">
            <FormattedMessage id="wall.replies.allow" />
          </Typography>
          <Switch
            checked={allowReplies}
            className="switch"
            onChange={(e, value) => {
              setAllowReplies(value);
            }}
            size="medium"
          />
        </Box>
      </Box>
    </Paper>
  );
};
export default CreatePost;
