import React from "react";
import LogoIcon from "../../../../images/logo/logoIcon.svg";
import VerifiedIcon from "components/Provider/VerifiedIcon";
import LazyLoad from "react-lazyload";
import "./ProviderLogo.scss";

/**
 * @typedef {Object} ProviderLogoPropTypes
 * @property {string} url logo url
 * @property {string} size logo size
 * @property {string} title logo title
 * @property {string} [defaultImage] Placeholder image.
 */

/**
 * Provides a provider logo
 *
 * @param {ProviderLogoPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProviderLogo = ({ url, size, title, defaultImage = LogoIcon, verified }) => {
  /**
   * Function to handle image url loading error.
   *
   * @param {React.SyntheticEvent} e Error event received.
   * @returns {void} None.
   */
  const onLogoError = (e) => {
    const targetElement = /** @type {HTMLInputElement} */ (e.target);
    targetElement.src = defaultImage;
  };

  // Handle no provider logo, returned as "images/providersLogo/default.png"
  // const logo = url.startsWith("http") ? url : DefaultProviderLogo;

  return (
    <LazyLoad
      height={size}
      offset={300}
      once
      placeholder={
        <img className="providerLogo" height={size} src={defaultImage} title={title} width={size} />
      }
      style={{ position: "relative" }}
    >
      <img
        className="providerLogo"
        height={size}
        onError={onLogoError}
        src={url || defaultImage}
        title={title}
        width={size}
      />
      {true && <VerifiedIcon />}
    </LazyLoad>
  );
};

export default ProviderLogo;
