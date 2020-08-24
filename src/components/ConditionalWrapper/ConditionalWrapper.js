import React from "react";

/**
 * @typedef {Object} ConditionalWrapperPropTypes
 * @property {boolean} condition
 * @property {React.FunctionComponent} wrapper
 * @property {JSX.Element} children
 */

/**
 * Conditionally wrap children component
 * @param {ConditionalWrapperPropTypes} props Props
 * @returns {JSX.Element} Element.
 */
const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;
