import React, { useState, useEffect } from "react";
import "./ToggleDoubleInput.scss";
import { Box, Typography, TextField, Tooltip, Switch, InputAdornment } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Controller } from "react-hook-form";
import HelpIcon from "@material-ui/icons/Help";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} label
 * @property {String|Number} value1
 * @property {String} name1
 * @property {String|Number} value2
 * @property {String} name2
 * @property {String} tooltip
 * @property {import('react-hook-form').Controller} control
 * @property {String} unitLeft1
 * @property {String} unitLeft2
 * @property {String} unitRight1
 * @property {String} unitRight2
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({
  value1,
  value2,
  control,
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
  const [toggle, setToggle] = useState(value1 || value2 ? true : false);

  const initData = () => {
    setToggle(value1 || value2 ? true : false);
  };

  useEffect(initData, [value1, value2]);

  return (
    <Box className="toggleDoubleInput" display="flex" flexDirection="row" alignItems="center">
      <Box
        className="labelBox"
        display="flex"
        flexDirection="row"
        alignItems="center"
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
          <Controller
            as={
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{unitLeft1}</InputAdornment>,
                  endAdornment: <InputAdornment position="end">{unitRight1}</InputAdornment>,
                }}
                type="number"
              />
            }
            control={control}
            defaultValue={value1}
            name={name1}
            rules={{ required: true }}
          />
          <Controller
            as={
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? " dark " : " light ")}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{unitLeft2}</InputAdornment>,
                  endAdornment: <InputAdornment position="end">{unitRight2}</InputAdornment>,
                }}
                type="number"
              />
            }
            control={control}
            defaultValue={value2}
            name={name2}
            rules={{ required: true }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ToggleInput;
