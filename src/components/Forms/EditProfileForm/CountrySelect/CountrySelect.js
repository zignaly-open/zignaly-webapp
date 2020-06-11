import React, { useState } from "react";
import "./CountrySelect.scss";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { countries } from "countries-list";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { FormattedMessage, useIntl } from "react-intl";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onChange
 */

/**
 *
 * @param {DefaultProps} props
 */

const CountrySelect = ({ onChange }) => {
  const storeSettings = useStoreSettingsSelector();
  const list = Object.values(countries);
  const [selected, setSelected] = useState([]);
  const intl = useIntl();

  /**
   *
   * @param {React.ChangeEvent} event
   * @param {*} newVal
   */

  const hanldeChange = (event, newVal) => {
    setSelected(newVal);
    onChange(newVal);
  };

  return (
    <Autocomplete
      autoHighlight
      className={"countrySelect " + (storeSettings.darkStyle ? "dark" : "light")}
      classes={{ tag: "chip", endAdornment: "clearIcon", popupIndicator: "downBtn" }}
      getOptionLabel={(option) => option.name}
      multiple
      onChange={hanldeChange}
      options={list}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={intl.formatMessage({ id: "srv.edit.countries" })}
          variant="outlined"
        />
      )}
      renderOption={(option) => (
        <>
          <span className="mr">{option.emoji}</span>
          <span className="mr">+{option.phone}</span>
          <span className="mr">{option.name}</span>
        </>
      )}
      value={selected}
    />
  );
};

export default CountrySelect;
