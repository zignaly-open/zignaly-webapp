import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { OutlinedInput, InputAdornment } from "@material-ui/core";
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
 * * @typedef {import("react-hook-form/dist/types").Control} Control
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
 * @property {string} [format="string"] Pass "number" to set/get value as number.
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
    format = "string",
    ...others
  } = props;
  const context = useFormContext();
  if (!control) {
    control = context.control;
    errors = context.errors;
  }

  /**
   * @param {React.ChangeEvent<*>} e Event
   * @returns {string} Formatted number
   */
  const handleChangeNumber = (e) => {
    const val = e.target.value;
    if (val === "") return "";

    // Replace commas
    let formattedVal = val.replace(",", ".");
    // Remove spaces
    formattedVal = formattedVal.replace(" ", "");

    // Check valid number
    if (!isNaN(formattedVal) || formattedVal === "-") {
      // Check negative
      if (allowNegative || parseFloat(formattedVal) >= 0) return formattedVal;
    }
    return null;
  };

  const transform = {
    // https://github.com/react-hook-form/react-hook-form/issues/615
    input: (/** @type {number} */ value) => (isNaN(value) || value === 0 ? "" : value.toString()), // incoming input value
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
        defaultValue={defaultValue}
        name={name}
        render={({ onChange: _onChange, value }) => (
          <OutlinedInput
            className="customInput outlineInput inputNoArrows"
            endAdornment={suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null}
            error={!!errors[name]}
            name={name}
            onChange={(e) => {
              const val = handleChangeNumber(e);
              // Ignore if invalid character
              if (val === null) return;

              // Apply formatted value
              e.target.value = val;

              // const val = e.target.value;
              const valNumber = parseFloat(val) || 0;
              // const val = format !== "number" ? handleChangeNumber(e) : e.target.valueAsNumber;
              // or transform.output(e)

              if (!allowNegative) {
                if (val === "-") {
                  // Remove negative sign alone
                  e.target.value = "";
                } else if (valNumber < 0) {
                  // Force positive number
                  e.target.value = Math.abs(valNumber).toString();
                }
              }

              // Format event value
              if (format === "number") {
                // @ts-ignore
                e.target.value = valNumber;
              }

              _onChange(e);

              // if (val !== null) {
              // Callback
              if (onChange) {
                // e.target.value = val;
                // Call callback asynchronously to avoid outdated errors issue https://github.com/react-hook-form/react-hook-form/issues/2875
                // Even with useCallback, it wasn't working with CustomNumberInput.
                setTimeout(() => onChange(e), 0);
              }
              // }
            }}
            // type="number"
            value={format !== "number" ? value : transform.input(value)}
            {...others}
          />
        )}
        rules={rules}
      />
      {showErrorMessage && errors[name] && (
        <span className="errorText">{errors[name].message}</span>
      )}
    </>
  );
};

export default CustomNumberInput;
