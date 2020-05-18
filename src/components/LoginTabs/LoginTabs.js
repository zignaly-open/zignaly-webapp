import React, { useState } from "react";
import "./LoginTabs.scss";
import { Box, Tab, Tabs } from "@material-ui/core";
import LoginForm from "../Forms/LoginForm";
import SignupForm from "../Forms/SignupForm";

const LoginTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="loginTabs">
      <Tabs
        classes={{ indicator: "indicator", flexContainer: "container" }}
        className="tabsMenu"
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
