import React from "react";
import "./CustomButton.scss";
import { Button, CircularProgress } from "@material-ui/core";

const CustomButton = props => {
  const { loading, className, children, onClick, disabled, type } = props;

  return (
    <Button
      className={"customButton " + className}
      disabled={disabled}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {loading ? <CircularProgress className="loader" thickness={5} /> : children}
    </Button>
  );
};

export default CustomButton;
