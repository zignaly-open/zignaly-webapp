import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";
import HelperLabel from "../HelperLabel/HelperLabel";
import { OutlinedInput } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Button, Box, Switch, Typography } from "@material-ui/core";
import { range } from "lodash";

const TakeProfitPanel = (props) => {
  const { symbolData } = props;
  const defaultExpand = false;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { errors, getValues, register, clearError, setError, setValue } = useFormContext();
  const [cardinality, setCardinality] = useState(1);
  const cardinalityRange = range(1, cardinality + 1, 1);

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

  const handleTargetAdd = () => {
    setCardinality(cardinality + 1);
  };

  const handleTargetRemove = () => {
    if (cardinality > 0) {
      setCardinality(cardinality - 1);
    }
  };

  console.log("Range: ", cardinalityRange);

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Switch onChange={handleToggle} size="small" />
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.takeprofit" />
          </Typography>
        </Box>
      </Box>
      {expand && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {cardinalityRange.map((index) => (
            <FormControl key={`target${index}`}>
              <HelperLabel descriptionId="terminal.takeprofit.help" labelId="terminal.target" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  inputRef={register}
                  name="targetPercentage"
                />
                <div className="currencyBox">%</div>
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="targetPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          ))}
          <Button onClick={handleTargetAdd}>
            <FormattedMessage id="terminal.target.add" />
          </Button>
          <Button onClick={handleTargetRemove}>
            <FormattedMessage id="terminal.target.remove" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TakeProfitPanel;
