import React from "react";
// @ts-ignore
import { findFlagUrlByIso2Code } from "country-flags-svg";

/**
 * @typedef {Object} FlagIconPropTypes
 * @property {string} code Exchange name.
 * @property {String} [size] Icon size.
 * @property {String} [className] className
 * @property {String} [titleName] title
 */

/**
 * Provides exchange icon.
 *
 * @param {FlagIconPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const FlagIcon = (props) => {
  const { code, size, className, titleName } = props;
  const flagUrl = findFlagUrlByIso2Code(code);

  return (
    <img
      alt={code}
      className={`flagIcon ${size ? size : ""} ${className ? className : ""}`}
      src={flagUrl}
      title={titleName ? titleName : code}
    />
  );
};
export default FlagIcon;
