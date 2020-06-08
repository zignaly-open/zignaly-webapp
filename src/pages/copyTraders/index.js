import React from "react";
import { Router } from "@reach/router";
import Profile from "./profile";

const CopyTraders = () => {
  return (
    <Router>
      <Profile path="/copyTraders/:traderId/profile" />
    </Router>
  );
};

export default CopyTraders;
