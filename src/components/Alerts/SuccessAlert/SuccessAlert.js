import React from "react";
import "./SuccessAlert.scss";
import { Snackbar, Box, Typography, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideSuccessAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";

const SuccessAlert = () => {
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
      className="successAlert"
      id="successAlert"
      onClose={() => dispatch(hideSuccessAlert())}
      open={storeAlerts.success.open}
    >
      <Box bgcolor="grid.main" className="alertMessage">
        <CloseIcon className="closeIcon" onClick={() => dispatch(hideSuccessAlert())} />
        {storeAlerts.success.title && (
          <Typography className="title green" variant="h3">
            {/* <FormattedMessage id={storeAlerts.success.title} /> */}
            Success
          </Typography>
        )}
        {storeAlerts.success.body && (
          <Typography className="body green" variant="body1">
            <FormattedMessage id={storeAlerts.success.body} />
          </Typography>
        )}
      </Box>
    </Snackbar>
  );
};

export default SuccessAlert;
