import React from "react";

/**
 * @typedef {import("@reach/router").RouteComponentProps} RouteComponentProps
 * @typedef {import("react").FunctionComponent} FunctionComponent
 * @typedef {import('../../services/tradeApiClient.types').ProviderExchangeSettingsObject} ProviderExchangeSettingsObject
 * @typedef {import('../../services/tradeApiClient.types').QuoteAssetsDict} QuoteAssetsDict
 *
 */

/**
 * @typedef {Object} RouteCustomProps
 * @property {FunctionComponent} component
 * @property {string} providerId
 * @property {QuoteAssetsDict} [quotes]
 * @property {ProviderExchangeSettingsObject} [settings]
 * @property {Function} [loadData]
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
