import React, { Fragment } from "react";
import "./WhoWeAre.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";
import FlagIcon from "components/FlagIcon";
import { prefixLinkForXSS } from "utils/formatters";
import { Link } from "gatsby";
import VerifiedIcon from "components/Provider/VerifiedIcon";
import ProviderLogo from "components/Provider/ProviderHeader/ProviderLogo";
import SocialLink from "../SocialLink";

/**
 * @param {Object} props Props
 * @param {string} props.name Name
 * @param {string} props.logoUrl Logo
 * @param {string} props.url Url
 * @param {boolean} props.verified Verified
 * @returns {JSX.Element} Component JSX.
 */
const ProviderName = ({ name, logoUrl, verified, url }) => (
  <Box alignItems="center" className="providerName" display="flex">
    <ProviderLogo size="40px" title={name} url={logoUrl} />
    <Link className="link" to={url}>
      <Typography variant="h4">{name}</Typography>
    </Link>
  </Box>
);

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 * Who we are compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const WhoWeAre = ({ provider }) => {
  const { show, setShow, isMobile } = useProfileBoxShow();

  return (
    <Box
      alignItems="flex-start"
      className="whoWeAre"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.who" />
        </Typography>
      )}

      {isMobile && (
        <Typography onClick={() => setShow(!show)} variant="h3">
          <FormattedMessage id="srv.who" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}
      {show && (
        <>
          <Box
            alignItems="flex-start"
            className="topBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Box className="teamBox" display="flex" flexDirection="row" flexWrap="wrap">
              {provider.team &&
                provider.team.length > 0 &&
                provider.team.map((item, index) => (
                  <Box
                    alignItems="center"
                    className="teamItem"
                    display="flex"
                    flexDirection="row"
                    key={index}
                  >
                    <span className="name">{item.name}</span>
                    <FlagIcon className="flag" code={item.countryCode.toUpperCase()} />
                  </Box>
                ))}
            </Box>
          </Box>
          <Box
            alignItems="flex-start"
            className="bottomBox"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.social" />
            </Typography>

            <Box
              alignItems="center"
              className="socialBox"
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
            >
              {provider.social &&
                provider.social.length > 0 &&
                provider.social.map((social, index) => (
                  <Fragment key={index}>
                    {social.network && (
                      <SocialLink type={social.network.toLowerCase()} url={social.link} />
                    )}
                  </Fragment>
                ))}
            </Box>
            <Link className="link" target="_blank" to={prefixLinkForXSS(provider.website)}>
              <Typography>{provider.website}</Typography>
            </Link>
            <Box className="otherServicesBox">
              <Typography variant="h3">
                <FormattedMessage id="srv.otherServices" />
              </Typography>

              <Box display="flex" flexWrap="wrap">
                <ProviderName
                  logoUrl={provider.logoUrl}
                  name={provider.name}
                  url={provider.providerLink}
                  verified={true}
                />
                <ProviderName
                  logoUrl={provider.logoUrl}
                  name={provider.name}
                  url={provider.providerLink}
                  verified={true}
                />
                <ProviderName
                  logoUrl={provider.logoUrl}
                  name={provider.name}
                  url={provider.providerLink}
                  verified={true}
                />
                <ProviderName
                  logoUrl={provider.logoUrl}
                  name={provider.name}
                  url={provider.providerLink}
                  verified={true}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WhoWeAre;
