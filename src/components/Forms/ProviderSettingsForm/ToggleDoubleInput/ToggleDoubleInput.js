import React, { useState, useEffect } from "react";
import "./ToggleDoubleInput.scss";
import { Box, Typography, TextField, Tooltip, Switch, InputAdornment } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {import('react-hook-form').UseFormMethods<Record<string, any>>} FormMethods
 * @typedef {Object} DefaultProps
 * @property {FormMethods} formMethods
 * @property {String} label
 * @property {String|Number} value1
 * @property {String} name1
 * @property {String|Number} value2
 * @property {String} name2
 * @property {String} tooltip
 * @property {String} unitLeft1
 * @property {String} unitLeft2
 * @property {String} unitRight1
 * @property {String} unitRight2
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({
  value1,
  value2,
  formMethods,
  label,
  name1,
  name2,
  tooltip,
  unitLeft1,
  unitLeft2,
  unitRight1,
  unitRight2,
}) => {
  const storeSettings = useStoreSettingsSelector();
  const [toggle, setToggle] = useState(!!(value1 || value2));
  const [data1, setData1] = useState(value1);
  const [data2, setData2] = useState(value2);
  const { register } = formMethods;

  const initData = () => {
    setToggle(!!(value1 || value2));
  };

  useEffect(initData, [value1, value2]);

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {void} None.
   */
  const handleData1Change = (e) => {
    setData1(Math.sign(e.target.value) === -1 ? e.target.value * -1 : e.target.value);
  };

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {void} None.
   */
  const handleData2Change = (e) => {
    setData2(Math.sign(e.target.value) === 1 ? e.target.value * -1 : e.target.value);
  };

  return (
    <Box
      alignItems="flex-start"
      className="toggleDoubleInput"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="center"
        className="labelBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <label className="customLabel">
          <FormattedMessage id={label} />
        </label>
        <Tooltip
          placement="top"
          title={<Typography variant="h5">{<FormattedMessage id={tooltip} />}</Typography>}
        >
          <HelpIcon className="icon" />
        </Tooltip>
        <Switch checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
      </Box>

      {toggle && (
        <Box className="multiInputBox" display="flex" flexDirection="column">
          <TextField
            InputProps={{
              startAdornment: <InputAdornment position="start">{unitLeft1}</InputAdornment>,
              endAdornment: <InputAdornment position="end">{unitRight1}</InputAdornment>,
            }}
            className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
            fullWidth
            inputRef={register({ max: 100 })}
            name={name1}
            onChange={handleData1Change}
            type="number"
            value={data1}
            variant="outlined"
          />
          <TextField
            InputProps={{
              startAdornment: <InputAdornment position="start">{unitLeft2}</InputAdornment>,
              endAdornment: <InputAdornment position="end">{unitRight2}</InputAdornment>,
            }}
            className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
            fullWidth
            inputRef={register({ max: 100 })}
            name={name2}
            onChange={handleData2Change}
            type="number"
            value={data2}
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default ToggleInput;
