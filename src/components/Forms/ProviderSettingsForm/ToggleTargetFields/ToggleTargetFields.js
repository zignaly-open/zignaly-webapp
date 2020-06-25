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
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({ value, label, onChange }) => {
  const [toggle, setToggle] = useState(!!(value && value.length));

  const initData = () => {
    setToggle(!!(value && value.length));
  };

  useEffect(initData, [value]);

  return (
    <Box alignItems="flex-start" className="toggleTargetFields" display="flex" flexDirection="row">
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
        <Switch checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
      </Box>

      {toggle && <TargetFields defaultValue={value} onChange={onChange} />}
    </Box>
  );
};

export default ToggleInput;
