import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import { Switch, Typography } from "@material-ui/core";

const StrategyPanel = (props) => {
  const { child, disableExpand } = props;
  const defaultExpand = !!disableExpand;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";

  /**
   * Handle toggle switch action.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Click event.
   * @returns {Void} None.
   */
  const handleToggle = (event) => {
    const targetElement = event.currentTarget;
    setExpand(targetElement.checked);
  };

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box className="panelHeader">
        <Switch onChange={handleToggle} size="small" />
        <Typography variant="h5">Entry strategy</Typography>
      </Box>
      {expand && (
        <Box className="panelContent">
          <h3>Field Set</h3>
        </Box>
      )}
    </Box>
  );
};

export default StrategyPanel;
