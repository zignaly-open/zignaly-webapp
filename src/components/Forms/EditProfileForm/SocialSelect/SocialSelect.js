import React, { useState } from "react";
import "./SocialSelect.scss";
import { Box, FormControl, Select, MenuItem, TextField } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onChange
 */

/**
 *
 * @param {DefaultProps} props
 */

const SocialSelect = ({ onChange }) => {
  const socialObject = { id: Math.random(), type: "facebook", url: "", delete: false };

  const [values, setValues] = useState([socialObject]);
  const socialList = ["Facebook", "Twitter", "Discord", "Linkedin", "Telegram"];

  /**
   *
   * @param {React.ChangeEvent<*>} e
   * @param {Number|String} id
   */

  const handleChange = (e, id) => {
    let target = e.target;
    let list = [...values];
    let index = list.findIndex((item) => item.id === id);
    let field = list.find((item) => item.id === id);
    if (target.name === "select") {
      field.type = target.value;
    } else {
      field.url = target.value;
    }
    list[index] = field;
    setValues(list);
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
   *
   * @param {Number|String} id
   */
  const removeField = (id) => {
    let list = [...values];
    let index = list.findIndex((item) => item.id === id);
    if (index) {
      list.splice(index, 1);
    }
    setValues(list);
  };

  return (
    <Box className="socialSelect">
      {values.map((obj, index) => (
        <Box
          className="fieldBox"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          key={index}
        >
          <FormControl className="selectInput" variant="outlined">
            <Select
              className="select"
              name="select"
              value={obj.type}
              onChange={(e) => handleChange(e, obj.id)}
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
            variant="outlined"
            name="input"
            value={obj.url}
            placeholder="url"
            onChange={(e) => handleChange(e, obj.id)}
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
