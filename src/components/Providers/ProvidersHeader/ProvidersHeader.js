import React from "react";
import PropTypes from "prop-types";
import "./ProvidersHeader.scss";
import { Box, Icon, Typography } from "@material-ui/core";
import { routesMapping } from "../../../utils/routesMapping";
import SubNavHeader from "../../SubNavHeader";
import SortIcon from "../../../images/filters/sort.svg";
import SortFillIcon from "../../../images/filters/sort-fill.svg";
import FilterIcon from "../../../images/filters/filter.svg";
import FilterFillIcon from "../../../images/filters/filter-fill.svg";
import { FormattedMessage } from "react-intl";

const ProvidersHeader = ({ showFilters, showSort, toggleFilters, toggleSort, path }) => {
  return (
    <Box className="providersHeader">
      <Box className="titleBox" display="flex" flexDirection="column">
        <Typography variant="h1">
          <FormattedMessage id={routesMapping(path).id} />
        </Typography>
        <h4 className="subHeader">
          <FormattedMessage id="signalProviders.subtitle" />
          <br />
          <FormattedMessage id="signalProviders.subtitle2" />
        </h4>
      </Box>
      <SubNavHeader links={routesMapping(path).links}>
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

ProvidersHeader.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  showSort: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  toggleSort: PropTypes.func.isRequired,
};
export default ProvidersHeader;
