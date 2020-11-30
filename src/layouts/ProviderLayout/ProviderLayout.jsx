import React from "react";
import "./ProviderLayout.scss";
import { Box, CircularProgress } from "@material-ui/core";
import ProviderHeader from "../../components/Provider/ProviderHeader";
import FAQ from "../../components/FAQ";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";
import ProviderContext from "components/Provider/ProviderContext";
import useProviderContext from "hooks/useProviderContext";

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
const ProviderLayout = ({ children }) => {
  const storeViews = useStoreViewsSelector();

  return (
    <Box
      alignItems="flex-start"
      className="providerLayout"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      {storeViews.provider.loading || !storeViews.provider.id ? (
        <Box
          alignItems="center"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      ) : (
        <>
          <ProviderHeader />
          <Box className="pageContent">{children}</Box>
        </>
      )}
      <Box className="faq">
        <FAQ />
      </Box>
    </Box>
  );
};

export default ProviderLayout;
