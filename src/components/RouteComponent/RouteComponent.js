import React from "react";

/**
 * @typedef {import("@reach/router").RouteComponentProps} RouteComponentProps
 * @typedef {import("react").FunctionComponent} FunctionComponent
 */

/**
 * @typedef {Object} RouteCustomProps
 * @property {FunctionComponent} component
 * @property {string} providerId
 */

/**
 * @typedef {RouteCustomProps & RouteComponentProps} ExtendedRouteComponentProps
 */

/**
 * @param {ExtendedRouteComponentProps} props Route props.
 * @returns {JSX.Element} Component element.
 */
export function ProviderRoute(props) {
  const { /** @type {FunctionComponent} */ component, ...others } = props;
  return <>{component(others)}</>;
}
