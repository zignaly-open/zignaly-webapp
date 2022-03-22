import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import HelperLabel from "../../HelperLabel/HelperLabel";
import useSelectedExchange from "hooks/useSelectedExchange";

/**
 * @param {Object} props Props
 * @param {string} [props.name] Control name
 * @param {boolean} [props.disabled] Disabled
 * @param {string} [props.exchange] Exchange for support check, default to selected exchange.
 * @returns {JSX.Element} JSX
 */
const PostOnlyControl = ({ name = "postOnly", disabled = false, exchange }) => {
  const { control } = useFormContext();
  const selectedExchange = useSelectedExchange();

  // Check that exchange works with Post Only.
  if (["vcce", "kucoin"].includes((exchange || selectedExchange.exchangeName).toLowerCase())) {
    return null;
  }

  return (
    <FormControlLabel
      className="customCheckbox"
      control={
        <Controller
          control={control}
          defaultValue={false}
          name={name}
          render={({ onChange, value }) => (
            <Checkbox
              checked={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.checked)}
            />
          )}
        />
      }
      label={<HelperLabel descriptionId="terminal.postonly.help" labelId="terminal.postonly" />}
    />
  );
};

export default PostOnlyControl;
