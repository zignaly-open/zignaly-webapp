import React, { useState, useEffect } from "react";
import "./PasswordStrength.scss";
import { Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Number} strength
 * @property {React.MouseEventHandler} onClose
 */

/**
 *
 * @param {DefaultProps} props
 */

const PasswordStrength = (props) => {
  const { strength, onClose } = props;
  const [bars, setBars] = useState([]);

  useEffect(() => {
    let data = [];
    let color = "";
    if (strength === 1) {
      color = "red";
    }
    if (strength > 1 && strength <= 3) {
      color = "yellow";
    }
    if (strength >= 4) {
      color = "green";
    }
    for (let i = 1; i <= 4; i++) {
      if (i <= strength) {
        data.push(color);
      } else {
        data.push("");
      }
    }
    setBars(data);
  }, [strength]);

  return (
    <Box
      alignItems="start"
      className="passwordStrength"
      display="flex"
      flexDirection="column"
      justifyContent="start"
    >
      <CloseIcon className="closeIcon" onClick={onClose} />
      <span className="title">Password Requirements</span>
      <span className="text"> - At least 8 characters</span>
      <span className="text"> - Contains letters, numbers, and at least 1 symbol</span>
      <span className="title last">Password Strength</span>
      <Box
        alignItems="center"
        className="strength"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {bars.map((item, index) => (
          <span className={"bar " + item} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default PasswordStrength;
