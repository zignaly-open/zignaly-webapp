import React, { useState } from "react";
import "./ChangeEmailButton.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage } from "react-intl";

const ChangeEmailButton = () => {
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const startChangeEmailProcess = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
    };
    tradeApi
      .changeEmailRequest(payload)
      .then(() => {
        dispatch(showSuccessAlert("", "user.changeemail.alert"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      alignItems="center"
      className="changeEmailButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {loading ? (
        <CircularProgress color="primary" size={29} />
      ) : (
        <Tooltip placement="top" title={<FormattedMessage id="profile.changeemailtext" />}>
          <span>
            <EditIcon className="emailEditIcon" color="primary" onClick={startChangeEmailProcess} />
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChangeEmailButton;
