import React from "react";
import "./OtherServices.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useProfileBoxShow from "../../../../hooks/useProfileBoxShow";
import { Link } from "gatsby";
import VerifiedIcon from "components/Provider/VerifiedIcon";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const OtherServices = ({ provider }) => {
  const { show, setShow, isMobile } = useProfileBoxShow();

  return (
    <Box
      alignItems="flex-start"
      className="otherServices"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {!isMobile && (
        <Typography variant="h3">
          <FormattedMessage id="srv.otherServices" />
        </Typography>
      )}

      {isMobile && (
        <Typography onClick={() => setShow(!show)} variant="h3">
          <FormattedMessage id="srv.otherServices" />
          {show && <ExpandLessIcon className="expandIcon" />}
          {!show && <ExpandMoreIcon className="expandIcon" />}
        </Typography>
      )}

      {show && (
        <Box className="otherServicesBody">
          <Link className="link" to="">
            <Typography variant="h4">
              Algo Scalping 5x - Split B 1{true && <VerifiedIcon />}
            </Typography>
          </Link>
          <Link className="link" to="">
            <Typography variant="h4">
              Algo Scalping 5x - Split B 2{true && <VerifiedIcon />}
            </Typography>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default OtherServices;
