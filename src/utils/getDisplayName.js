/**
 * Extract display name from wrapped component.
 *
 * @param {React.ComponentType} WrappedComponent Wrapped component.
 *
 * @returns {String} Wrapped component name.
 */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default getDisplayName;
