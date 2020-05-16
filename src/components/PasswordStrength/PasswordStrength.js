import React, { useState, useEffect } from "react";
import "./PasswordStrength.scss";
import { Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const PasswordStrength = (props) => {
  const { strength, onClose } = props;
  const [bars, setBars] = useState([]);

  useEffect(() => {
    const checkStrength = () => {
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
      for (let a = 1; a <= 4; a++) {
        if (a <= strength) {
          data.push(color);
        } else {
          data.push("");
        }
      }
      setBars(data);
    };
    checkStrength();
  }, [strength]);

  return (
    <Box
      alignItems="start"
      className="password-strength"
      display="flex"
      flexDirection="column"
      justifyContent="start"
    >
      <CloseIcon className="close-icon" onClick={onClose} />
      <span className="title">Password Requirements</span>
      <span className="text"> - Atleast 8 characters</span>
      <span className="text"> - Container letters and numbers</span>
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
