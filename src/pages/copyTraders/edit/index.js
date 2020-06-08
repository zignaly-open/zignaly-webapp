import React from "react";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";

/**
 * @typedef {Object} CopyTradersProfilePageProps
 * @property {String} path
 * @property {String} providerId
 */

/**
 * Position detail page component.
 *
 * @param {CopyTradersProfilePageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTradersProfile = (props) => {
  const storeViews = useStoreViewsSelector();
  return <Box>dynamic route for edit </Box>;
};

export default compose(withProviderLayout)(CopyTradersProfile);
