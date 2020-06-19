import React from "react";
import "./ErrorAlert.scss";
import { Snackbar, Box, Typography, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";

const ErrorAlert = () => {
  const storeAlerts = useStoreUIAlertsSelector();
  const dispatch = useDispatch();

  return (
    <Snackbar
      TransitionComponent={Slide}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={5000}
      className="errorAlert"
      id="errorAlert"
      onClose={() => dispatch(hideErrorAlert())}
      open={storeAlerts.error.open}
    >
      <Box bgcolor="grid.main" className="alertMessage">
        <CloseIcon className="closeIcon" onClick={() => dispatch(hideErrorAlert())} />
        {storeAlerts.error.title && (
          <Typography className="title red" variant="h3">
            <FormattedMessage id={storeAlerts.error.title} />
          </Typography>
        )}
        {storeAlerts.error.body && (
          <Typography className="body red" variant="body1">
            <b>Error:</b>
            <FormattedMessage id={storeAlerts.error.body} />
          </Typography>
        )}
      </Box>
    </Snackbar>
  );
};

export default ErrorAlert;
