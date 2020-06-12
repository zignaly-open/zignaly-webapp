import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
import { useFormContext } from "react-hook-form";
import {
  OutlinedInput,
  FormControlLabel,
  FormHelperText,
  FormControl,
  RadioGroup,
  Radio,
  Switch,
  Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";

const StrategyPanel = (props) => {
  const { disableExpand, symbolData } = props;
  const defaultExpand = !!disableExpand;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { getValues, register, setValue } = useFormContext();

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

  const entryStrategyOptions = [
    { label: "Limit Order", val: "limit" },
    { label: "Market Order", val: "market" },
    { label: "Stop-Limit Order", val: "stop-limit" },
    { label: "Import from Exchange", val: "import" },
  ];

  const [entryStrategy, setEntryStrategy] = useState(entryStrategyOptions[0].val);

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const units = draftPosition.realInvestment / 2;
    setValue("units", units);
  };

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!disableExpand && <Switch onChange={handleToggle} size="small" />}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">Entry strategy</Typography>
          <CustomSelect
            label=""
            onChange={setEntryStrategy}
            options={entryStrategyOptions}
            value={entryStrategy}
          />
        </Box>
      </Box>
      {expand && (
        <Box className="panelContent">
          <FormControl>
            <RadioGroup aria-label="Entry Type" className="entryType" name="entryType">
              <FormControlLabel control={<Radio />} inputRef={register} label="LONG" value="LONG" />
              <FormControlLabel
                control={<Radio />}
                inputRef={register}
                label="SHORT"
                value="SHORT"
              />
            </RadioGroup>
          </FormControl>
          {entryStrategy === "stop-limit" && (
            <FormControl>
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>Stop Price</FormHelperText>
                <Help />
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="stopPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" && (
            <FormControl>
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>Price</FormHelperText>
                <Help />
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="price" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>Real Investment</FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="realInvestment"
                onChange={realInvestmentChange}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>Position Size</FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" inputRef={register} name="positionSize" />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>Units</FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" inputRef={register} name="units" />
              <div className="currencyBox">{symbolData.base}</div>
            </Box>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default StrategyPanel;
