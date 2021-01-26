import React, { useState } from "react";
import { getDisplayName } from "../../utils";
import { Box, Typography, Hidden, useMediaQuery } from "@material-ui/core";
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
import CreateTraderForm from "../../components/Forms/CreateTraderForm";
import { showCreateProvider, showCreateTrader } from "../../store/actions/ui";
import useStoreUIModalSelector from "../../hooks/useStoreUIModalSelector";
import { useDispatch } from "react-redux";
import "./ProvidersLayout.scss";
import { useTheme } from "@material-ui/core/styles";
import ServiceIcon from "../../images/offerServiceIcon.svg";

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
    // const [createTrader, showCreateTrader] = useState(false);
    const [modifiedFiltersCount, setModifiedFiltersCount] = useState(0);
    const storeModal = useStoreUIModalSelector();
    const isCopyTrading = props.path.startsWith("/copyTraders");
    const isProfitSharing = props.path.startsWith("/profitSharing");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const toggleSort = () => {
      setShowSort(!showSort);
    };

    const createButtonText = () => {
      if (isMobile) {
        return `${isCopyTrading ? "copyt" : isProfitSharing ? "profit" : "signalp"}.become.mobile`;
      }
      return `${isCopyTrading ? "copyt" : isProfitSharing ? "profit" : "signalp"}.become`;
    };

    const filters = (
      <>
        <Modal
          onClose={() => dispatch(showCreateProvider(false))}
          persist={false}
          size="medium"
          state={storeModal.createProvider}
        >
          <CreateProviderForm />
        </Modal>
        <Modal
          onClose={() => dispatch(showCreateTrader(false))}
          persist={false}
          size="fullscreen"
          state={storeModal.createTrader}
        >
          <CreateTraderForm isCopyTrading={isCopyTrading} />
        </Modal>
        <Hidden xsDown>
          <CustomButton
            className="textPurple borderPurple becomeProviderButton"
            onClick={() =>
              dispatch(
                isCopyTrading || isProfitSharing
                  ? showCreateTrader(true)
                  : showCreateProvider(true),
              )
            }
          >
            <Typography variant="body1">
              <FormattedMessage id={createButtonText()} />
            </Typography>
            <img alt="service-icon" className="buttonIcon" src={ServiceIcon} />
          </CustomButton>
        </Hidden>
        <Box
          alignItems="center"
          bgcolor="grid.content"
          className="settings"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <img
            className="icon iconPurple"
            onClick={() => toggleFilters()}
            src={showFilters ? FilterFillIcon : FilterIcon}
            title="Filter"
          />
          {modifiedFiltersCount > 0 && (
            <Typography className="modified" variant="subtitle1">
              {modifiedFiltersCount}
            </Typography>
          )}
          <img
            className="icon iconPurple"
            onClick={() => toggleSort()}
            src={showSort ? SortFillIcon : SortIcon}
            title="Sort"
          />
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
            setModifiedFiltersCount={setModifiedFiltersCount}
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
