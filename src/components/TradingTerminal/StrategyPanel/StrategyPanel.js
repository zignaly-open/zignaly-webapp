import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
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

  const entryOptions = ["Limit Order", "Market Order", "Stop-Limit Order", "Import from Exchange"];
  const [entryOption, setEntryOption] = useState(entryOptions[0]);

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!disableExpand && <Switch onChange={handleToggle} size="small" />}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">Entry strategy</Typography>
          <CustomSelect
            label=""
            onChange={setEntryOption}
            options={entryOptions}
            value={entryOption}
          />
        </Box>
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
