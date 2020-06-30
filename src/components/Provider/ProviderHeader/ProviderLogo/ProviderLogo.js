import React from "react";
import LogoIcon from "../../../../images/logo/logoIcon.svg";
// import DefaultProviderLogo from "../../../images/defaultProviderLogo.png";

/**
 * @typedef {Object} ProviderLogoPropTypes
 * @property {string} url logo url
 * @property {string} size logo size
 * @property {string} title logo title
 */

/**
 * Provides a provider logo
 *
 * @param {ProviderLogoPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProviderLogo = ({ url, size, title }) => {
  /**
   * Function to handle image url loading error.
   *
   * @param {React.SyntheticEvent} e Error event received.
   * @returns {void} None.
   */
  const onLogoError = (e) => {
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    targetElement.src = LogoIcon;
  };

  // Handle no provider logo, returned as "images/providersLogo/default.png"
  // const logo = url.startsWith("http") ? url : DefaultProviderLogo;

  return (
    <img
      alt={title}
      className="providerLogo"
      height={size}
      onError={onLogoError}
      src={url || LogoIcon}
      title={title}
      width={size}
    />
  );
};

export default ProviderLogo;
