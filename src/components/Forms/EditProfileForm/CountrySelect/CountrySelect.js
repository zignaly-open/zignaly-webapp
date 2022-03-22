import React, { useState, useEffect } from "react";
import "./CountrySelect.scss";
import { Box, TextField, FormControl, Select, MenuItem } from "@mui/material";
import { countries } from "countries-list";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useIntl } from "react-intl";
import FlagIcon from "components/FlagIcon";

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
  const teamObject = { id: Math.random(), name: "", countryCode: "", delete: false };
  const [values, setValues] = useState([teamObject]);
  const intl = useIntl();

  const initializeTeam = () => {
    if (defaultValue && defaultValue.length) {
      for (let a = 0; a < defaultValue.length; a++) {
        defaultValue[a].id = Math.random();
        defaultValue[a].delete = true;
      }
      setValues(defaultValue);
    }
  };

  useEffect(initializeTeam, [defaultValue]);
  /**
   * Function to handle input changes for select and text input.
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @param {Number|String} id ID of the dynamic field object.
   * @returns {void} None.
   */
  const handleChange = (e, id) => {
    let target = e.target;
    let list = [...values];
    let index = list.findIndex((item) => item.id === id);
    let field = list.find((item) => item.id === id);
    if (target.name === "select") {
      field.countryCode = target.value;
    } else {
      field.name = target.value;
    }
    list[index] = field;
    setValues(list);
    onChange(list);
  };

  const addField = () => {
    let field = { ...teamObject };
    let list = [...values];
    field.delete = true;
    field.id = Math.random();
    list.unshift(field);
    setValues(list);
  };

  /**
   * Function to add new field.
   *
   * @param {Number|String} id id of the field object.
   * @returns {void} None.
   */
  const removeField = (id) => {
    let list = [...values];
    let index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    setValues(list);
    onChange(list);
  };

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

  return (
    <Box className="countrySelect">
      {values.map((obj, index) => (
        <Box
          alignItems="center"
          className="fieldBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          key={index}
        >
          <FormControl className="selectInput" variant="outlined">
            <Select
              className="select"
              classes={{ select: "selected" }}
              name="select"
              onChange={(e) => handleChange(e, obj.id)}
              value={obj.countryCode}
            >
              {list.map((item) => (
                <MenuItem
                  className="selectItem"
                  key={item.countryCode}
                  value={item.countryCode.toLowerCase()}
                >
                  <FlagIcon className="flag" code={item.countryCode.toUpperCase()} />
                  <span className="mr">{item.name}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="customInput"
            name="input"
            onChange={(e) => handleChange(e, obj.id)}
            placeholder={intl.formatMessage({ id: "srv.edit.nameplaceholder" })}
            value={obj.name}
            variant="outlined"
          />
          <Box className="iconBox">
            {obj.delete && (
              <HighlightOffIcon className="icon delete" onClick={() => removeField(obj.id)} />
            )}
          </Box>
        </Box>
      ))}
      <Box className="addActionBox" display="flex" flexDirection="row" justifyContent="flex-end">
        <Box className="iconBox">
          <AddCircleOutlineIcon className="icon add" onClick={addField} />
        </Box>
      </Box>
    </Box>
  );
};

export default CountrySelect;
