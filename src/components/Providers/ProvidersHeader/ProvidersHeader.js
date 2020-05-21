import React from "react";
import "./ProvidersHeader.scss";
import { Box, Icon, Typography } from "@material-ui/core";
import { routesMapping } from "../../../utils/routesMapping";
import SubNavHeader from "../../SubNavHeader";
import SortIcon from "../../../images/filters/sort.svg";
import SortFillIcon from "../../../images/filters/sort-fill.svg";
import FilterIcon from "../../../images/filters/filter.svg";
import FilterFillIcon from "../../../images/filters/filter-fill.svg";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} SubNavHeaderPropTypes
 * @property {boolean} showFilters Flag to indicate if filters are displayed.
 * @property {boolean} showSort Flag to indicate if sort options are displayed.
 * @property {function} toggleFilters Callback that delegate filters toggle state to caller.
 * @property {function} toggleSort Callback that delegate sort toggle state to caller.
 * @property {string} path Current route path.
 */

/**
 * Provides the navigation bar for the providers with filter buttons.
 *
 * @param {SubNavHeaderPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersHeader = ({ showFilters, showSort, toggleFilters, toggleSort, path }) => {
  const sectionNavitation = routesMapping(path);

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
      <SubNavHeader links={sectionNavitation.links}>
        <Box
          alignItems="center"
          className="settings"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Icon>
            <img
              alt="zignaly"
              className="icon"
              onClick={() => toggleFilters()}
              src={showFilters ? FilterFillIcon : FilterIcon}
            />
          </Icon>

          <Icon>
            <img
              alt="zignaly"
              className="icon"
              onClick={() => toggleSort()}
              src={showSort ? SortFillIcon : SortIcon}
            />
          </Icon>
        </Box>
      </SubNavHeader>
    </Box>
  );
};

export default ProvidersHeader;
