import React, { useState } from "react";
import "./Alert.scss";
import { Snackbar } from "@material-ui/core";
import Message from "./Message";

const Popup = () => {
  const [alert, showAlert] = useState(false);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={5000}
      className={"alert success"}
      onClose={() => showAlert(true)}
      open={alert}
    >
      <Message data={{}} />
    </Snackbar>
  );
};

export default Popup;
