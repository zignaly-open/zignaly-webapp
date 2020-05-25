import React, { useState } from "react";
import "./signalProvidersLayout.scss";
import { getDisplayName } from "../../utils";
import { Box } from "@material-ui/core";
import FAQ from "../../components/FAQ";
import ProvidersHeader from "../../components/Providers/ProvidersHeader";

/**
 * HOC wrap component with copy traders layout.
 *
 * @param {React.ComponentType<any>} Component The component to wrap.
 *
 * @returns {Function} Wrap component function.
 */
const withSignalProvidersLayout = (Component) => {
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

    return (
      <Box
        alignItems="flex-start"
        className="copyTradersLayout"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <ProvidersHeader
          path={props.path}
          showFilters={showFilters}
          showSort={showSort}
          toggleFilters={toggleFilters}
          toggleSort={toggleSort}
        />
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

// export default injectIntl(withSignalProvidersLayout);
export default withSignalProvidersLayout;
