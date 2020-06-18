import React from "react";
import "./SuccessAlert.scss";
import { Snackbar, Box, Typography, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";

const SuccessAlert = () => {
  const storeAlerts = useStoreUIAlertsSelector();
  const dispatch = useDispatch();

  return (
    <Snackbar
      TransitionComponent={Slide}
      id="successAlert"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={50000000}
      className="successAlert"
      onClose={() => dispatch(hideErrorAlert())}
      open={false}
    >
      <Box bgcolor="grid.main" className="alertMessage">
        <CloseIcon className="closeIcon" onClick={() => dispatch(hideErrorAlert())} />
        {storeAlerts.error.title && (
          <Typography className="title green" variant="h3">
            <FormattedMessage id={storeAlerts.error.title} />
          </Typography>
        )}
        {storeAlerts.error.body && (
          <Typography className="body green" variant="body1">
            <b>Error:</b>
            <FormattedMessage id={storeAlerts.error.body} />
          </Typography>
        )}
      </Box>
    </Snackbar>
  );
};

export default SuccessAlert;
