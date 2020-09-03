import React, { useState } from "react";

/**
 * @typedef {Object} Expandable
 * @property {boolean} expanded Flag to indicate if expanded toggle is enabled.
 * @property {string} expandClass Class name to represent expandable visual state.
 * @property {function(boolean):void} setExpanded Toggle expanded state.
 */

/**
 * Provides expandable state and switch element.
 *
 * Supports expand / collapse display on other components.
 *
 * @param {boolean} [defaultExpand=false] Flag to indicate if expandable is expanded by default.
 * @returns {Expandable} An expandable object.
 */
const useExpandable = (defaultExpand = false) => {
  const [expanded, setExpanded] = useState(defaultExpand);
  const expandClass = expanded ? "expanded" : "collapsed";

  return {
    expanded,
    expandClass,
    setExpanded,
  };
};

export default useExpandable;
