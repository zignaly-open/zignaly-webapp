import React, { useState } from "react";
import "./providersLayout.scss";
import { getDisplayName } from "../../utils";
import { Box, Icon } from "@material-ui/core";
import SortIcon from "../../images/filters/sort.svg";
import SortFillIcon from "../../images/filters/sort-fill.svg";
import FilterIcon from "../../images/filters/filter.svg";
import FilterFillIcon from "../../images/filters/filter-fill.svg";
import FAQ from "../../components/FAQ";
import ProvidersHeader from "../../components/Providers/ProvidersHeader";

/**
 * HOC wrap component with copy traders layout.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withProvidersLayout = (Component) => {
  /**
   * @typedef {Object} WithSignalProvidersPropsType
   * @property {string} path Providers page path.
   */

  /**
   * Perform component wrapping.
   *
   * @param {WithSignalProvidersPropsType} props Default params.
   *
   * @returns {JSX.Element} Component JSX.
   */
  const WrapperComponent = (props) => {
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const toggleSort = () => {
      setShowSort(!showSort);
    };

    const filters = (
      <Box
        alignItems="center"
        bgcolor="grid.main"
        className="settings"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
      >
        {!props.path.startsWith("/signalProviders") && (
          <Icon>
            <img
              alt="zignaly"
              className="icon"
              onClick={() => toggleFilters()}
              src={showFilters ? FilterFillIcon : FilterIcon}
            />
          </Icon>
        )}

        <Icon>
          <img
            alt="zignaly"
            className="icon"
            onClick={() => toggleSort()}
            src={showSort ? SortFillIcon : SortIcon}
          />
        </Icon>
      </Box>
    );

    return (
      <Box
        alignItems="flex-start"
        className="providersLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <ProvidersHeader path={props.path} rightComponent={filters} />
        <Box className="pageContent">
          <Component
            {...props}
            showFilters={showFilters}
            showSort={showSort}
            toggleFilters={toggleFilters}
            toggleSort={toggleSort}
          />
        </Box>
        <Box className="faq">
          <FAQ />
        </Box>
      </Box>
    );
  };
  WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
  return WrapperComponent;
};

export default withProvidersLayout;
