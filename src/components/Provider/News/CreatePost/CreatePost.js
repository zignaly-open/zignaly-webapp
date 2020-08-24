import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "../../../Dialogs";
import { navigate as navigateReach } from "@reach/router";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";

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
    <Box className="post">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={navigateProfileSettings}
        setConfirmConfig={setConfirmConfig}
      />
      <CustomButton className="submitButton" onClick={() => createPost()}>
        <FormattedMessage id="wall.post" />
      </CustomButton>
    </Box>
  );
};
export default CreatePost;
