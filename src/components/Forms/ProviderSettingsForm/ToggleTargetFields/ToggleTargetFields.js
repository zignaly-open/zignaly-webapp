import React, { useState, useEffect } from "react";
import "./ToggleTargetFields.scss";
import { Box, Switch } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import TargetFields from "../TargetFields";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {String} label
 * @property {Array<*>} value
 * @property {Function} onChange
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({ value, label, onChange }) => {
  const [toggle, setToggle] = useState(value && value.length ? true : false);

  const initData = () => {
    setToggle(value && value.length ? true : false);
  };

  useEffect(initData, [value]);

  return (
    <Box className="toggleTargetFields" display="flex" flexDirection="row" alignItems="flex-start">
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
        <Switch checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
      </Box>

      {toggle && <TargetFields onChange={onChange} defaultValue={value} />}
    </Box>
  );
};

export default ToggleInput;
