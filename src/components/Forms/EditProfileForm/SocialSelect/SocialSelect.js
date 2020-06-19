import React, { useState, useEffect } from "react";
import "./SocialSelect.scss";
import { Box, FormControl, Select, MenuItem, TextField } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

/**
 * Social select component to add social networks.
 *
 * @typedef {Object} DefaultProps Default props.
 * @property {Function} onChange Change event.
 * @property {Array<*>} defaultValue
 */

/**
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} Component JSX.
 */
const SocialSelect = ({ onChange, defaultValue }) => {
  const socialObject = { id: Math.random(), network: "facebook", link: "", delete: false };

  const [values, setValues] = useState([socialObject]);
  const socialList = ["Facebook", "Twitter", "Discord", "Linkedin", "Telegram", "Email"];

  const initializeSocials = () => {
    if (defaultValue && defaultValue.length) {
      for (let a = 0; a < defaultValue.length; a++) {
        defaultValue[a].id = Math.random();
        defaultValue[a].delete = true;
      }
      defaultValue[0].delete = false;
      setValues(defaultValue);
    }
  };

  useEffect(initializeSocials, [defaultValue]);

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
      field.network = target.value;
    } else {
      field.link = target.value;
    }
    list[index] = field;
    setValues(list);
    onChange(list);
  };

  const addField = () => {
    let field = { ...socialObject };
    let list = [...values];
    field.delete = true;
    field.id = Math.random();
    list.push(field);
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
    if (index) {
      list.splice(index, 1);
    }
    setValues(list);
    onChange(list);
  };

  return (
    <Box className="socialSelect">
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
              name="select"
              onChange={(e) => handleChange(e, obj.id)}
              value={obj.network}
            >
              {socialList.map((item) => (
                <MenuItem key={item} value={item.toLowerCase()}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="customInput"
            name="input"
            onChange={(e) => handleChange(e, obj.id)}
            placeholder="url"
            value={obj.link}
            variant="outlined"
          />
          {!obj.delete && <AddCircleOutlineIcon className="icon add" onClick={addField} />}
          {obj.delete && (
            <HighlightOffIcon className="icon delete" onClick={() => removeField(obj.id)} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SocialSelect;
