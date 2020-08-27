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

const CreatePost = () => {
  const storeUserData = useStoreUserData();

  const createPost = () => {
    if (!storeUserData.userName) {
      setConfirmConfig((c) => ({ ...c, visible: true }));
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

      <CustomButton className="submitButton" onClick={() => createPost()}>
        <FormattedMessage id="wall.post" />
      </CustomButton>
    </Paper>
  );
};
export default CreatePost;
