import React from "react";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

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
  console.log(storeViews.provider);
  return <Box>dynamic route for </Box>;
};

export default CopyTradersProfile;
