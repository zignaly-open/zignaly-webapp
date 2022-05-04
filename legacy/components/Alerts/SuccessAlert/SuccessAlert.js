import React from "react";
import { Snackbar, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideSuccessAlert } from "../../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import { Alert, AlertTitle } from "@mui/material";

const SuccessAlert = () => {
  const storeAlerts = useSelector((state) => state.ui.alerts);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideSuccessAlert());
  };

  return (
    <Snackbar
      TransitionComponent={Slide}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={5000}
      className="successAlert"
      onClose={handleClose}
      open={storeAlerts.success.open}
    >
      <Alert onClose={handleClose} severity="success">
        {storeAlerts.success.title && <AlertTitle>Success</AlertTitle>}
        {storeAlerts.success.body && <FormattedMessage id={storeAlerts.success.body} />}
      </Alert>
    </Snackbar>
  );
};

export default SuccessAlert;
