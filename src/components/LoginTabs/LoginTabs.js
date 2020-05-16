import React, { useState } from "react";
import "./LoginTabs.scss";
import { Box, Tab, Tabs } from "@material-ui/core";
import LoginForm from "../Forms/LoginForm";
import SignupForm from "../Forms/SignupForm";

const LoginTabs = props => {
  const [tabValue, setTabValue] = useState(0);

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="loginTabs">
      <Tabs
        value={tabValue}
        onChange={changeTab}
        classes={{ indicator: "indicator", flexContainer: "container" }}
        className="tabs-menu"
      >
        <Tab label="Sign in" classes={{ selected: "selected" }} />
        <Tab label="Register" classes={{ selected: "selected" }} />
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
