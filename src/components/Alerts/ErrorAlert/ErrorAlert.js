import React from "react";
import "./ErrorAlert.scss";
import { Snackbar, Box, Typography, Slide } from "@material-ui/core";
import useStoreUIAlertsSelector from "../../../hooks/useStoreUIAlertsSelector";
import { useDispatch } from "react-redux";
import { hideErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";

const Popup = () => {
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
      className="errorAlert"
      onClose={() => dispatch(hideErrorAlert())}
      open={storeAlerts.error.open}
    >
      <Box bgcolor="grid.content" className="alertMessage">
        {storeAlerts.error.title && (
          <Typography variant="h3" className="title red">
            <FormattedMessage id={storeAlerts.error.title} />
          </Typography>
        )}
        {storeAlerts.error.body && (
          <Typography variant="body1" className="body red">
            <b>Error:</b>
            <FormattedMessage id={storeAlerts.error.body} />
          </Typography>
        )}
      </Box>
    </Snackbar>
  );
};

export default Popup;
