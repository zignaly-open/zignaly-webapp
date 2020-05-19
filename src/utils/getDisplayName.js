/**
 * Received a component with default properties.
 *
 * @typedef {object} WrappedComponentType
 * @property {string} displayName
 * @property {string} name
 */

/**
 *
 * @param {WrappedComponentType} WrappedComponent
 */

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default getDisplayName;
