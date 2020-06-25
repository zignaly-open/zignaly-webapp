import React, { useState, useEffect } from "react";
import "./TargetFields.scss";
import { Box, TextField, InputAdornment } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

/**
 * Target Fields component to add dynamic fields.
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
const TargetFields = ({ onChange, defaultValue }) => {
  const targetFieldObject = {
    targetId: Math.random(),
    amountPercentage: "",
    priceTargetPercentage: "",
    delete: false,
  };

  const [values, setValues] = useState([targetFieldObject]);

  const initData = () => {
    if (defaultValue && defaultValue.length) {
      for (let a = 0; a < defaultValue.length; a++) {
        defaultValue[a].targetId = Math.random();
        defaultValue[a].delete = true;
      }
      defaultValue[0].delete = false;
      setValues(defaultValue);
    }
  };

  useEffect(initData, [defaultValue]);

  const updateParent = () => {
    onChange(values);
  };

  /**
   * Function to handle input changes for fields.
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @param {Number|String} id ID of the dynamic field object.
   * @returns {void} None.
   */
  const handleChange = (e, id) => {
    let target = e.target;
    let list = [...values];
    let index = list.findIndex((item) => item.targetId === id);
    let field = list.find((item) => item.targetId === id);
    if (target.name === "amount") {
      field.amountPercentage = target.value;
    } else {
      field.priceTargetPercentage = target.value;
    }
    list[index] = field;
    setValues(list);
  };

  const addField = () => {
    let field = { ...targetFieldObject };
    let list = [...values];
    field.delete = true;
    field.targetId = Math.random();
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
    let index = list.findIndex((item) => item.targetId === id);
    if (index) {
      list.splice(index, 1);
    }
    setValues(list);
    onChange(list);
  };

  return (
    <Box className="targetFields">
      {values.map((obj, index) => (
        <Box
          alignItems="flex-start"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          key={index}
          width="100%"
        >
          <Box
            alignItems="center"
            className="fieldBox"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            key={index}
          >
            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Price Target</InputAdornment>,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              className="customInput"
              name="price"
              onBlur={updateParent}
              onChange={(e) => handleChange(e, obj.targetId)}
              type="number"
              value={obj.priceTargetPercentage}
              variant="outlined"
            />

            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Qty</InputAdornment>,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              className="customInput"
              name="amount"
              onChange={(e) => handleChange(e, obj.targetId)}
              type="number"
              value={obj.amountPercentage}
              variant="outlined"
            />
          </Box>
          {!obj.delete && <AddCircleOutlineIcon className="icon add" onClick={addField} />}
          {obj.delete && (
            <HighlightOffIcon className="icon delete" onClick={() => removeField(obj.targetId)} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TargetFields;
