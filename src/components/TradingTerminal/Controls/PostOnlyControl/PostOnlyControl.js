import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";

/**
 * @param {Object} props Props
 * @param {string} [props.name] Control name
 * @returns {JSX.Element} JSX
 */
const PostOnlyControl = ({ name = "postOnly" }) => {
  const { control } = useFormContext();
  return (
    <FormControlLabel
      className="customCheckbox"
      control={
        <Controller
          control={control}
          defaultValue={false}
          name={name}
          render={({ onChange, value }) => (
            <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
          )}
        />
      }
      label={<HelperLabel descriptionId="terminal.postonly.help" labelId="terminal.postonly" />}
    />
  );
};

export default PostOnlyControl;
