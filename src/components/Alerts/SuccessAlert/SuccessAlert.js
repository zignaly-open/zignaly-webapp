import React from "react";
import "./SuccessAlert.scss";
import { Snackbar, Box, Typography, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

const SuccessAlert = () => {
  const storeAlerts = useStoreUIAlertsSelector();
  const dispatch = useDispatch();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      TransitionComponent={Slide}
      autoHideDuration={50000000}
      className="successAlert"
      onClose={() => dispatch(hideErrorAlert())}
      open={storeAlerts.error.open}
    >
      <Box bgcolor="grid.main" className="alertMessage">
        {storeAlerts.error.title && (
          <Typography variant="h3" className="title green">
            <FormattedMessage id={storeAlerts.error.title} />
          </Typography>
        )}
        {storeAlerts.error.body && (
          <Typography variant="body1" className="body green">
            <b>Error:</b>
            <FormattedMessage id={storeAlerts.error.body} />
          </Typography>
        )}
      </Box>
    </Snackbar>
  );
};

export default SuccessAlert;
