import React, { useState, useEffect } from "react";
import "./SocialSelect.scss";
import { Box, FormControl, Select, MenuItem, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useIntl } from "react-intl";

/**
 * Social select component to add social networks.
 *
 * @typedef {Object} DefaultProps Default props.
 * @property {Function} onChange Change event.
 * @property {Function} onError Error event.
 * @property {Array<*>} defaultValue
 */

/**
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} Component JSX.
 */
const SocialSelect = ({ onChange, defaultValue, onError }) => {
  const [values, setValues] = useState([socialObject]);
  const socialList = ["Discord", "Twitter", "Facebook", "Linkedin", "Telegram", "Email"];
  const intl = useIntl();

  const initializeSocials = () => {
    if (defaultValue && defaultValue.length) {
      for (let a = 0; a < defaultValue.length; a++) {
        defaultValue[a].id = Math.random();
        defaultValue[a].delete = true;
      }
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

  /**
   * Function to validate field.
   *
   * @param {Number|String} id id of the field object.
   * @returns {void} None.
   */
  const validateFields = (id) => {
    let list = [...values];
    let index = list.findIndex((item) => item.id === id);
    let field = list.find((item) => item.id === id);
    let regex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (field.network.toLowerCase() !== "email") {
      if (!regex.test(field.link)) {
        field.errorId = field.id;
        onError(true);
      } else {
        field.errorId = 0;
        onError(false);
      }
    }
    list[index] = field;
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
          <Box className="customInputBox">
            <TextField
              className={"customInput " + (obj.errorId === obj.id ? "error" : "")}
              fullWidth
              name="input"
              onBlur={() => validateFields(obj.id)}
              onChange={(e) => handleChange(e, obj.id)}
              placeholder={intl.formatMessage({ id: "srv.edit.urlplaceholder" })}
              value={obj.link}
              variant="outlined"
            />
            {obj.errorId === obj.id && (
              <span className="errorText">url should be valid. (eg: https://zignaly.com)</span>
            )}
          </Box>
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

export default SocialSelect;

export const socialObject = {
  id: Math.random(),
  network: "discord",
  link: "",
  delete: false,
  errorId: 0,
};
