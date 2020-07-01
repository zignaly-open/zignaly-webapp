import React, { Fragment } from "react";
import "./providerLayout.scss";
import { Box, CircularProgress } from "@material-ui/core";
import ProviderHeader from "../../components/Provider/ProviderHeader";
import FAQ from "../../components/FAQ";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";

/**
 * @typedef {Object} ProviderLayoutProps
 * @property {Object} children
 */

/**
 * Default component props.
 *
 * @param {ProviderLayoutProps} props Default component props.
 * @returns {JSX.Element} Component.
 */
const withProviderLayout = ({ children }) => {
  const storeViews = useStoreViewsSelector();
  return (
    <Box
      alignItems="flex-start"
      className="providerLayout"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {storeViews.provider.loading && (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      )}
      {!storeViews.provider.loading && (
        <Fragment>
          <ProviderHeader />
          <Box className="pageContent">{children}</Box>
        </Fragment>
      )}
      <Box className="faq">
        <FAQ />
      </Box>
    </Box>
  );
};

export default withProviderLayout;
