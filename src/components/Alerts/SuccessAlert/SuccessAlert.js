import React from "react";
import "./SuccessAlert.scss";
import { Snackbar, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import { Alert, AlertTitle } from "@material-ui/lab";

const SuccessAlert = () => {
  const storeAlerts = useStoreUIAlertsSelector();
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
