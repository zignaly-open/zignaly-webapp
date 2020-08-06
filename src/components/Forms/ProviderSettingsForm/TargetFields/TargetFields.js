import React, { useState, useEffect } from "react";
import "./TargetFields.scss";
import { Box, TextField, InputAdornment } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

/**
 * @typedef {Object} TargetObject
 * @property {Number} targetId
 * @property {String} amountPercentage
 * @property {Number} priceTargetPercentage
 * @property {Number} amountError
 * @property {Boolean} priceError
 */

/**
 * Target Fields component to add dynamic fields.
 *
 * @typedef {Object} DefaultProps Default props.
 * @property {Function} onChange Change event.
 * @property {Array<*>} defaultValue
 * @property {String} type
 */

/**
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} Component JSX.
 */
const TargetFields = ({ onChange, defaultValue, type }) => {
  /**
   * @type {TargetObject}
   */
  const targetFieldObject = {
    targetId: 1,
    amountPercentage: "0",
    priceTargetPercentage: 0,
    amountError: 0,
    priceError: false,
  };

  const [values, setValues] = useState([targetFieldObject]);

  const initData = () => {
    if (defaultValue && defaultValue.length) {
      let count = 1;
      for (let a = 0; a < defaultValue.length; a++) {
        defaultValue[a].targetId = count;
        defaultValue[a].delete = true;
        count++;
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
    list = clearErrors(list);
    let index = list.findIndex((item) => item.targetId === id);
    let field = list.find((item) => item.targetId === id);
    if (target.name === "amount") {
      // convert amount to positive for both dca and take profit targets.
      field.amountPercentage = Math.sign(target.value) === -1 ? target.value * -1 : target.value;
      if (type === "takeprofit") {
        let previousFieldsSum = 0;
        list.forEach((item) => {
          if (item.targetId !== field.targetId) {
            previousFieldsSum += parseFloat(item.amountPercentage);
          }
        });
        if (previousFieldsSum + parseFloat(field.amountPercentage) > 100) {
          field.amountError = 100 - previousFieldsSum;
        } else {
          field.amountError = 0;
        }
      }
    } else if (type === "dca") {
      // convert value to negative for price targets of dca targets.
      field.priceTargetPercentage =
        Math.sign(target.value) === 1 ? target.value * -1 : target.value;
    } else {
      // convert value to negative for price targets of take profits targets.
      field.priceTargetPercentage =
        Math.sign(target.value) === -1 ? target.value * -1 : target.value;
    }
    list[index] = field;
    setValues(list);
  };

  const addField = () => {
    let field = { ...targetFieldObject };
    let list = [...values];
    field.targetId = list.length ? list[list.length - 1].targetId + 1 : 0;
    list.push(field);
    setValues(list);
  };

  const removeField = () => {
    let list = [...values];
    list.splice(list.length - 1, 1);
    setValues(list);
    onChange(list);
  };

  /**
   *
   * @param {Array<TargetObject>} list Target object collection.
   * @returns {Array<TargetObject>} Target object collection.
   */
  const clearErrors = (list) => {
    list.forEach((item) => {
      item.amountError = 0;
    });
    return list;
  };

  return (
    <Box className="targetFields">
      {values.map((obj, index) => (
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
          {!!obj.amountError && (
            <span className="errorText">{`Amount cannot be greater than ${obj.amountError}`}</span>
          )}
        </Box>
      ))}
      <AddCircleOutlineIcon className="icon add" onClick={addField} />
      <HighlightOffIcon className="icon delete" onClick={removeField} />
    </Box>
  );
};

export default TargetFields;
