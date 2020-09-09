import React, { useState } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "../../../Dialogs";
import { navigate as navigateReach } from "@reach/router";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import "./CreatePost.scss";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import Editor from "../../../Editor";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import { useDispatch } from "react-redux";

const CreatePost = ({ providerId }) => {
  const storeUserData = useStoreUserData();
  const storeSession = useStoreSessionSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
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
      };

      tradeApi
        .createPost(payload)
        .then(() => {
          dispatch(showSuccessAlert("", "wall.post.success"));
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
      <ProviderLogo size="30px" title="" url={storeUserData.imageUrl} defaultImage={ProfileIcon} />

      <Editor content={content} onChange={setContent} />

      <CustomButton className="submitButton" onClick={() => createPost()} loading={isLoading}>
        <FormattedMessage id="wall.post" />
      </CustomButton>
    </Paper>
  );
};
export default CreatePost;
