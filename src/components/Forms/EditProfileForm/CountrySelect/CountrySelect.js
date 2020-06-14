import React, { useState, useEffect } from "react";
import "./CountrySelect.scss";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { countries } from "countries-list";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { useIntl } from "react-intl";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onChange
 * @property {Array<*>} defaultValue
 */

/**
 * Default component props.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} Component JSX.
 */
const CountrySelect = ({ onChange, defaultValue }) => {
  const storeSettings = useStoreSettingsSelector();
  const [selected, setSelected] = useState([]);
  const intl = useIntl();

  const createList = () => {
    let obj = {
      name: "",
      native: "",
      phone: "",
      continent: "",
      capital: "",
      currency: "",
      languages: [""],
      emoji: "",
      emojiU: "",
      countryCode: "",
    };
    return Object.entries(countries).map((item) => {
      let val = { ...obj, ...item[1] };
      val.countryCode = item[0];
      return val;
    });
  };

  const list = createList();

  const initializeCounties = () => {
    if (defaultValue && defaultValue.length) {
      let data = [];
      for (let a = 0; a < defaultValue.length; a++) {
        let found = list.find(
          (item) => item.countryCode.toLowerCase() === defaultValue[a].countryCode.toLowerCase(),
        );
        if (found) {
          data.push(found);
        }
      }
      // console.log(data);
      setSelected(data);
    }
  };

  useEffect(initializeCounties, [defaultValue]);

  /**
   * Function to handle countries selection.
   *
   * @param {React.ChangeEvent} event Change event.
   * @param {*} newVal countries array received on value change.
   * @returns {void} None.
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
      freeSolo
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
