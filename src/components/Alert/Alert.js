import React, { useState } from "react";
import "./Alert.scss";
import { Snackbar } from "@material-ui/core";
import Message from "./Message";

const Popup = () => {
  const [alert, showAlert] = useState(false);
  const data = {
    title: "",
    message: "",
  };

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
      <Message message={data} />
    </Snackbar>
  );
};

export default Popup;
