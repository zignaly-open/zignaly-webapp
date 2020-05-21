import React, { useState } from "react";
import "./LoginTabs.scss";
import { Box, Tab, Tabs } from "@material-ui/core";
import LoginForm from "../Forms/LoginForm";
import SignupForm from "../Forms/SignupForm";

const LoginTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  /**
   *
   * @param {Object} event
   * @param {Number} newValue
   */

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="loginTabs">
      <Tabs
        className="tabsMenu"
        classes={{ indicator: "indicator", flexContainer: "container" }}
        onChange={changeTab}
        value={tabValue}
      >
        <Tab classes={{ selected: "selected" }} label="Sign in" />
        <Tab classes={{ selected: "selected" }} label="Register" />
      </Tabs>
      {tabValue === 0 && (
        <Box className="section">
          <LoginForm />
        </Box>
      )}
      {tabValue === 1 && (
        <Box className="section">
          <SignupForm />
        </Box>
      )}
    </Box>
  );
};

export default LoginTabs;
