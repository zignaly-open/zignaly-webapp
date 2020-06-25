import React, { useState } from "react";
import { Switch } from "@material-ui/core";

/**
 * @typedef {Object} Expandable
 * @property {boolean} expanded Flag to indicate if expanded toggle is enabled.
 * @property {string} expandClass Class name to represent expandable visual state.
 * @property {JSX.Element} expandableControl Material UI Switch.
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

  /**
   * Handle toggle switch action.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Click event.
   * @returns {Void} None.
   */
  const handleToggle = (event) => {
    const targetElement = event.currentTarget;
    setExpanded(targetElement.checked);
  };

  return {
    expanded,
    expandClass,
    expandableControl: <Switch checked={expanded} onChange={handleToggle} size="small" />,
  };
};

export default useExpandable;
