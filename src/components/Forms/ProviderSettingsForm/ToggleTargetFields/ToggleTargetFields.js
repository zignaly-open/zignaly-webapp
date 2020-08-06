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
 * @property {String} type
 */

/**
 * Input toggle component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ToggleInput = ({ value, label, onChange, type }) => {
  const [toggle, setToggle] = useState(!!(value && value.length));
  const [data, setData] = useState(value);

  const initData = () => {
    setToggle(!!(value && value.length));
    setData(value);
  };

  useEffect(initData, [value]);

  const clearValues = () => {
    if (!toggle) {
      onChange([]);
      setData([]);
    }
  };

  useEffect(clearValues, [toggle]);

  return (
    <Box
      alignItems="flex-start"
      className="toggleTargetFields"
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
        <Switch checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
      </Box>

      {toggle && <TargetFields defaultValue={data} onChange={onChange} type={type} />}
    </Box>
  );
};

export default ToggleInput;
