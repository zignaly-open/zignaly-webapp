import React, { useState, useEffect } from "react";
import "./ProvidersHeader.scss";
import { Box, Typography } from "@material-ui/core";
import { routesMapping } from "../../../utils/routesMapping";
import SubNavHeader from "../../SubNavHeader";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} SubNavHeaderPropTypes
 * @property {Object} [rightComponent] Optional component to display at the right of the menu.
 * @property {string} path Current route path.
 */

/**
 * Provides the navigation bar for the providers with filter buttons.
 *
 * @param {SubNavHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersHeader = ({ path, rightComponent }) => {
  const isCopyTrading = path.startsWith("/copyTraders");
  const sectionNavitation = routesMapping(path);
  const [links, setLinks] = useState(sectionNavitation.links);

  const initLinks = () => {
    if (!isCopyTrading) {
      let data = sectionNavitation.links.filter((item) => item.id !== "srv.analytics");
      setLinks(data);
    }
  };

  useEffect(initLinks, []);

  return (
    <Box className="providersHeader">
      <Box className="titleBox" display="flex" flexDirection="column">
        <Typography variant="h1">
          {sectionNavitation.id && <FormattedMessage id={sectionNavitation.id} />}
        </Typography>
        <h4 className="subHeader">
          {sectionNavitation.subtitleId && <FormattedMessage id={sectionNavitation.subtitleId} />}
          {sectionNavitation.subtitle2Id && (
            <>
              <br />
              <FormattedMessage id={sectionNavitation.subtitle2Id} />
            </>
          )}
        </h4>
      </Box>
      <SubNavHeader links={links} rightComponent={rightComponent} />
    </Box>
  );
};

export default ProvidersHeader;
