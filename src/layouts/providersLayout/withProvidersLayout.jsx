import React, { useState } from "react";
import "./providersLayout.scss";
import { getDisplayName } from "../../utils";
import { Box, Icon, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import SortIcon from "../../images/filters/sort.svg";
import SortFillIcon from "../../images/filters/sort-fill.svg";
import FilterIcon from "../../images/filters/filter.svg";
import FilterFillIcon from "../../images/filters/filter-fill.svg";
import FAQ from "../../components/FAQ";
import ProvidersHeader from "../../components/Providers/ProvidersHeader";
import CustomButton from "../../components/CustomButton";
import Modal from "../../components/Modal";
import CreateProviderForm from "../../components/Forms/CreateProviderForm";

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
    const [isProviderModalOpen, openProviderModal] = useState(false);
    const isCopyTrading = props.path.startsWith("/copyTraders");

    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const toggleSort = () => {
      setShowSort(!showSort);
    };

    const filters = (
      <>
        <Modal
          onClose={() => openProviderModal(false)}
          persist={false}
          size="medium"
          state={isProviderModalOpen}
        >
          <CreateProviderForm isCopyTrading={isCopyTrading} />
        </Modal>
        <CustomButton
          className="textPurple borderPurple becomeProviderButton"
          onClick={() => openProviderModal(true)}
        >
          <Typography variant="body1">
            <FormattedMessage id={`${isCopyTrading ? "copyt" : "signalp"}.become`} />
          </Typography>
        </CustomButton>
        <Box
          alignItems="center"
          bgcolor="grid.main"
          className="settings"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          {isCopyTrading && (
            <Icon>
              <img
                className="icon"
                onClick={() => toggleFilters()}
                src={showFilters ? FilterFillIcon : FilterIcon}
                title="Filter"
              />
            </Icon>
          )}
          <Icon>
            <img
              className="icon"
              onClick={() => toggleSort()}
              src={showSort ? SortFillIcon : SortIcon}
              title="Sort"
            />
          </Icon>
        </Box>
      </>
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
