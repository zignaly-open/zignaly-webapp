import React from "react";
import "./CustomButton.scss";
import { Button, CircularProgress } from "@material-ui/core";

/**
 * Default properties.
 *
 * @typedef {Object} DefaultProps
 * @property {Boolean} [loading] change button to loading state.
 * @property {String} [className] classname to apply styles.
 * @property {Object} children could be string or some node.
 * @property {Function} [onClick] handle onClick event.
 * @property {Boolean} [disabled] disable button and all events.
 * @property {String} [type] type can be "submit" in terms of form.
 */

/**
 * Default component's props.
 *
 * @param {DefaultProps} props
 */

const CustomButton = (props) => {
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
