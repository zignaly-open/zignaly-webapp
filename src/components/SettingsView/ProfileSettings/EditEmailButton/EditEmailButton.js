import React, { useState } from "react";
import "./EditEmailButton.scss";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";
// import tradeApi from "../../../../services/tradeApiClient";
// import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
// import { useDispatch } from "react-redux";
// import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage } from "react-intl";

const EditEmailButton = () => {
  // const storeSession = useStoreSessionSelector();
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // const startChangeEmailProcess = () => {
  //     setLoader(true);
  //     const payload = {
  //       token: storeSession.tradeApi.accessToken,
  //     };
  //     tradeApi
  //       .requestEmailChange(payload)
  //       .then(() => {
  //         dispatch(showSuccessAlert("srv.follow.alert.title", "srv.follow.alert.body"));
  //       })
  //       .catch((e) => {
  //         dispatch(showErrorAlert(e));
  //       })
  //       .finally(() => {
  //         setLoader(false);
  //       });
  // };

  return (
    <Box
      alignItems="center"
      className="editEmailButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {loading ? (
        <CircularProgress color="primary" size={35} />
      ) : (
        <Tooltip placement="top" title={<FormattedMessage id="profile.changeemailtext" />}>
          <span>
            <EditIcon className="emailEditIcon" color="primary" onClick={() => setLoading(true)} />
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default EditEmailButton;
