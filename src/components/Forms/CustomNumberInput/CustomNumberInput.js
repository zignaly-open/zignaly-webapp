import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { OutlinedInput, InputAdornment } from "@material-ui/core";
import { isNil } from "lodash";
import isNumeric from "utils/isNumeric";
import { Input } from "styles/styles";
// import MaskedInput from "@biproxi/react-text-mask";
// import createNumberMask from "text-mask-addons/dist/createNumberMask";

// https://github.com/react-hook-form/react-hook-form/pull/1207/files
// https://material-ui.com/components/text-fields/
// https://codesandbox.io/s/4es23
// https://github.com/text-mask/text-mask/issues/406
// const TextMaskCustom = (props) => {
//   const { inputRef, onChange, ...other } = props;
//   const defaultMaskOptions = {
//     prefix: "",
//     suffix: "",
//     includeThousandsSeparator: false,
//     // thousandsSeparatorSymbol: ",",
//     allowDecimal: true,
//     decimalSymbol: ".",
//     decimalLimit: 8, // how many digits allowed after the decimal
//     integerLimit: 10, // limit length of integer numbers
//     allowNegative: false,
//     allowLeadingZeroes: false,
//   };

//   const maskOptions = {};
//   const currencyMask = createNumberMask({
//     ...defaultMaskOptions,
//     ...maskOptions,
//   });

//   return (
//     <MaskedInput
//       {...other}
//       ref={(ref) => {
//         inputRef(ref ? ref.inputElement : null);
//       }}
//       mask={currencyMask}
//       guide={false}
//       // placeholderChar={"\u2000"}
//       showMask={false}
//       onChange={(e) => {
//         console.log(e.target.value);
//         e.persist();
//         onChange(e.target.value);
//       }}
//     />
//   );
// };

/**
 * @typedef {import("react-hook-form/dist/types").ValidationRules} ValidationRules
 * @typedef {import("react-hook-form/dist/types").Control} Control
 * @typedef {import("react-hook-form/dist/types/form").FieldErrors} FieldErrors
 * @typedef {import("@material-ui/core/Input").InputProps} InputProps
 */

/**
 * @typedef {Object} Props
 * @property {string} name Control name
 * @property {string|number} [defaultValue] defaultValue
 * @property {function} [onChange] Change callback
 * @property {ValidationRules} [rules] Change callback
 * @property {string} [suffix] Suffix
 * @property {boolean} [allowNegative] Allow negative numbers
 * @property {Control} [control]
 * @property {FieldErrors} [errors]
 * @property {boolean} [error]
 * @property {boolean} [showErrorMessage]
 * @property {boolean} [newDesign]
 *
 * @typedef {InputProps & Props} EnhancedProps
 */
/**
 * @param {EnhancedProps} props Props
 * @returns {JSX.Element} JSX
 */
const CustomNumberInput = (props) => {
  let {
    name,
    defaultValue = "",
    onChange,
    rules,
    allowNegative = false,
    suffix,
    errors,
    control,
    showErrorMessage = true,
    type = "text",
    newDesign = false,
    ...others
  } = props;
  const context = useFormContext();
  if (!control) {
    control = context.control;
    errors = context.errors;
  }

  /**
   * @param {React.ChangeEvent<*>} e Event
   * @param {function} _onChange React Hook Form onChange callback
   * @returns {string} Formatted number
   */
  const handleChange = (e, _onChange) => {
    // Replace commas
    let val = e.target.value.replace(",", ".");
    // Remove spaces
    val = val.replace(" ", "");

    // Disallow non numbers while allowing '-'
    if (val !== "" && !isNumeric(val) && (val !== "-" || !allowNegative)) {
      return;
    }

    // Fix sign
    if (!allowNegative && parseFloat(val) < 0) {
      val = Math.abs(parseFloat(val)).toString();
    }

    // Update value
    _onChange(type === "number" ? (val === "" ? null : parseFloat(val)) : val);
    // _onChange(type === "number" ? (val === "" ? null : parseFloat(val)) : val);

    // Custom Callback
    if (onChange) {
      // e.target.value = val;
      // Call callback asynchronously to avoid react-hook-form outdated errors issue https://github.com/react-hook-form/react-hook-form/issues/2875
      // Even with useCallback, it wasn't working with CustomNumberInput.
      setTimeout(() => onChange(e), 0);
    }
  };

  const transform = {
    // https://github.com/react-hook-form/react-hook-form/issues/615
    input: (/** @type {number} */ value) => (isNil(value) ? "" : value.toString()), // incoming input value
    // output: (/** @type {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} */ e) => {
    //   // Convert to number for easier validation
    //   const output = parseInt(e.target.value, 10);
    //   return isNaN(output) ? 0 : output;
    // },
  };

  // todo: we could add sign prefix here
  return (
    <>
      <Controller
        control={control}
        // Empty string if null/undefined value, to avoid swtiching from uncontrolled to controlled
        defaultValue={isNil(defaultValue) ? "" : defaultValue}
        name={name}
        render={({ onChange: _onChange, value }) =>
          newDesign ? (
            <Input
              className="inputNoArrows"
              fullWidth
              endAdornment={
                suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null
              }
              error={!!errors[name]}
              name={name}
              onChange={(e) => handleChange(e, _onChange)}
              type={type}
              value={type !== "number" ? value : transform.input(value)}
              {...others}
            />
          ) : (
            <OutlinedInput
              className="customInput outlineInput inputNoArrows"
              endAdornment={
                suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null
              }
              error={!!errors[name]}
              name={name}
              onChange={(e) => handleChange(e, _onChange)}
              type={type}
              value={type !== "number" ? value : transform.input(value)}
              {...others}
            />
          )
        }
        rules={rules}
      />
      {showErrorMessage && errors[name] && (
        <span className="errorText">{errors[name].message}</span>
      )}
    </>
  );
};

export default CustomNumberInput;
