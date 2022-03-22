import React from "react";
import "./CustomButton.scss";
import { Button, CircularProgress } from "@mui/material";

/**
 * @typedef {import('react').MouseEventHandler} MouseEventHandler
 * @typedef {import('react').ButtonHTMLAttributes<HTMLButtonElement>} ButtonHTMLAttributes
 * @typedef {import('@mui/material').ButtonProps} ButtonProps
 */

/**
 * Default properties.
 *
 * @typedef {Object} DefaultProps
 * @property {Boolean} [loading] change button to loading state.
 * @property {String} [className] classname to apply styles.
 * @property {Object} children could be string or some node.
 * @property {MouseEventHandler} [onClick] handle onClick event.
 * @property {Boolean} [disabled] disable button and all events.
 * @property {ButtonHTMLAttributes["type"]} [type] type can be "submit" in terms of form.
 * @property {String} [target] open a link in a new tab.
 * @property {*} [component] the component used for the root node.
 * @property {string} [to] Gatsby link
 */

/**
 * Default component's props.
 *
 * @param {DefaultProps & ButtonProps} props
 */

const CustomButton = (props) => {
  const { loading, className, children, onClick, disabled, type, ...others } = props;

  return (
    <Button
      className={"customButton " + className}
      component="button"
      disabled={loading || disabled}
      onClick={onClick}
      type={type ? type : "button"}
      {...others}
    >
      {loading ? <CircularProgress className="loader" size={35} thickness={5} /> : children}
    </Button>
  );
};

export default CustomButton;
